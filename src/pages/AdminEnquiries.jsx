import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Link
} from 'react-router-dom'

import {
  Mail,
  Inbox,
  RefreshCw,
  Search,
  Eye,
  CheckCircle2,
  Clock3,
  Trash2,
  X,
  Phone,
  CalendarDays,
  MessageSquareText,
  Package,
  ShoppingBag,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react'

import './AdminEnquiries.css'

const API_URL =
  'import.meta.env.VITE_API_URL'

const STATUS_OPTIONS = [
  'New',
  'Read',
  'Resolved'
]

function formatDate(value) {
  if (!value) {
    return 'Not available'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return 'Not available'
  }

  return date.toLocaleString(
    'en-IN',
    {
      dateStyle: 'medium',
      timeStyle: 'short'
    }
  )
}

function statusClass(status) {
  return String(
    status || 'New'
  )
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export default function AdminEnquiries() {

  const [
    enquiries,
    setEnquiries
  ] = useState([])

  const [
    counts,
    setCounts
  ] = useState({
    total: 0,
    new: 0,
    read: 0,
    resolved: 0
  })

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    error,
    setError
  ] = useState('')

  const [
    search,
    setSearch
  ] = useState('')

  const [
    statusFilter,
    setStatusFilter
  ] = useState('All')

  const [
    selected,
    setSelected
  ] = useState(null)

  const [
    updatingId,
    setUpdatingId
  ] = useState(null)

  const [
    copied,
    setCopied
  ] = useState('')

  const token =
    localStorage.getItem(
      'cordialAdminToken'
    )

  const fetchEnquiries =
    useCallback(
      async () => {
        try {

          setLoading(true)
          setError('')

          const response =
            await fetch(
              `${API_URL}/api/admin/enquiries`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          const data =
            await response.json()

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
              'Unable to load enquiries.'
            )
          }

          setEnquiries(
            Array.isArray(
              data.enquiries
            )
              ? data.enquiries
              : []
          )

          setCounts(
            data.counts || {
              total: 0,
              new: 0,
              read: 0,
              resolved: 0
            }
          )

        } catch (fetchError) {

          console.error(
            'Admin enquiries fetch error:',
            fetchError
          )

          setError(
            fetchError.message ||
            'Unable to load enquiries.'
          )

        } finally {
          setLoading(false)
        }
      },
      [token]
    )

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  const filteredEnquiries =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase()

      return enquiries.filter(
        (enquiry) => {

          const matchesStatus =
            statusFilter === 'All' ||
            enquiry.status === statusFilter

          if (!matchesStatus) {
            return false
          }

          if (!query) {
            return true
          }

          return [
            enquiry.name,
            enquiry.email,
            enquiry.phone,
            enquiry.subject,
            enquiry.message,
            enquiry.status
          ].some(
            (value) =>
              String(value || '')
                .toLowerCase()
                .includes(query)
          )
        }
      )

    }, [
      enquiries,
      search,
      statusFilter
    ])

  const refreshCountsLocally =
    (items) => {

      setCounts({
        total:
          items.length,

        new:
          items.filter(
            (item) =>
              item.status === 'New'
          ).length,

        read:
          items.filter(
            (item) =>
              item.status === 'Read'
          ).length,

        resolved:
          items.filter(
            (item) =>
              item.status === 'Resolved'
          ).length
      })
    }

  const updateStatus =
    async (
      enquiryId,
      status
    ) => {

      try {

        setUpdatingId(
          enquiryId
        )

        setError('')

        const response =
          await fetch(
            `${API_URL}/api/admin/enquiries/${enquiryId}/status`,
            {
              method: 'PATCH',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({
                status
              })
            }
          )

        const data =
          await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            'Unable to update enquiry.'
          )
        }

        setEnquiries(
          (current) => {

            const next =
              current.map(
                (item) =>
                  item.id === enquiryId
                    ? data.enquiry
                    : item
              )

            refreshCountsLocally(
              next
            )

            return next
          }
        )

        setSelected(
          (current) =>
            current?.id === enquiryId
              ? data.enquiry
              : current
        )

      } catch (updateError) {

        console.error(
          'Update enquiry error:',
          updateError
        )

        setError(
          updateError.message ||
          'Unable to update enquiry.'
        )

      } finally {
        setUpdatingId(null)
      }
    }

  const openEnquiry =
    async (enquiry) => {

      setSelected(enquiry)
      setCopied('')

      if (
        enquiry.status === 'New'
      ) {
        await updateStatus(
          enquiry.id,
          'Read'
        )
      }
    }

  const deleteEnquiry =
    async (enquiry) => {

      const confirmed =
        window.confirm(
          `Delete enquiry from ${enquiry.name}? This cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      try {

        setUpdatingId(
          enquiry.id
        )

        setError('')

        const response =
          await fetch(
            `${API_URL}/api/admin/enquiries/${enquiry.id}`,
            {
              method: 'DELETE',

              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          )

        const data =
          await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            'Unable to delete enquiry.'
          )
        }

        setEnquiries(
          (current) => {

            const next =
              current.filter(
                (item) =>
                  item.id !== enquiry.id
              )

            refreshCountsLocally(
              next
            )

            return next
          }
        )

        if (
          selected?.id === enquiry.id
        ) {
          setSelected(null)
        }

      } catch (deleteError) {

        console.error(
          'Delete enquiry error:',
          deleteError
        )

        setError(
          deleteError.message ||
          'Unable to delete enquiry.'
        )

      } finally {
        setUpdatingId(null)
      }
    }

  const copyValue =
    async (
      value,
      label
    ) => {

      if (!value) {
        return
      }

      try {

        await navigator.clipboard.writeText(
          value
        )

        setCopied(label)

        window.setTimeout(
          () => {
            setCopied('')
          },
          1600
        )

      } catch {
        setCopied('')
      }
    }

  return (
    <main className="admin-enquiries-page">

      <header className="admin-enquiries-topbar">

        <div>

          <span className="admin-enquiries-eyebrow">
            Cordial Express Admin
          </span>

          <h1>
            Customer Enquiries
          </h1>

          <p>
            Review and manage messages submitted
            through the Contact page.
          </p>

        </div>

        <div className="admin-enquiries-top-actions">

          <Link
            to="/admin/orders"
            className="admin-enquiries-nav-link"
          >
            <Package size={16} />
            Orders
          </Link>

          <Link
            to="/admin/products"
            className="admin-enquiries-nav-link"
          >
            <ShoppingBag size={16} />
            Products
          </Link>

          <button
            type="button"
            className="admin-enquiries-refresh"
            onClick={fetchEnquiries}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

        </div>

      </header>

      <section className="admin-enquiries-stats">

        <article>

          <div className="admin-enquiries-stat-icon">
            <Inbox size={19} />
          </div>

          <span>Total</span>

          <strong>
            {counts.total}
          </strong>

        </article>

        <article>

          <div className="admin-enquiries-stat-icon new">
            <Mail size={19} />
          </div>

          <span>New</span>

          <strong>
            {counts.new}
          </strong>

        </article>

        <article>

          <div className="admin-enquiries-stat-icon read">
            <Eye size={19} />
          </div>

          <span>Read</span>

          <strong>
            {counts.read}
          </strong>

        </article>

        <article>

          <div className="admin-enquiries-stat-icon resolved">
            <CheckCircle2 size={19} />
          </div>

          <span>Resolved</span>

          <strong>
            {counts.resolved}
          </strong>

        </article>

      </section>

      <section className="admin-enquiries-toolbar">

        <div className="admin-enquiries-search">

          <Search size={17} />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search name, email, subject or message..."
          />

        </div>

        <div className="admin-enquiries-filters">

          {[
            'All',
            ...STATUS_OPTIONS
          ].map(
            (status) => (

              <button
                type="button"
                key={status}
                className={
                  statusFilter === status
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setStatusFilter(
                    status
                  )
                }
              >
                {status}
              </button>

            )
          )}

        </div>

      </section>

      {error && (

        <div className="admin-enquiries-error">

          <AlertCircle size={18} />

          <span>
            {error}
          </span>

        </div>

      )}

      <section className="admin-enquiries-card">

        {loading ? (

          <div className="admin-enquiries-state">

            <RefreshCw size={24} />

            <strong>
              Loading enquiries...
            </strong>

          </div>

        ) : filteredEnquiries.length === 0 ? (

          <div className="admin-enquiries-state">

            <Inbox size={30} />

            <strong>
              No enquiries found
            </strong>

            <span>
              New contact messages will
              appear here.
            </span>

          </div>

        ) : (

          <div className="admin-enquiries-table-wrap">

            <table className="admin-enquiries-table">

              <thead>

                <tr>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredEnquiries.map(
                  (enquiry) => (

                    <tr
                      key={enquiry.id}
                      className={
                        enquiry.status === 'New'
                          ? 'is-new'
                          : ''
                      }
                    >

                      <td>

                        <div className="admin-enquiry-customer">

                          <strong>
                            {enquiry.name}
                          </strong>

                          <span>
                            {enquiry.email}
                          </span>

                          {enquiry.phone && (
                            <span>
                              {enquiry.phone}
                            </span>
                          )}

                        </div>

                      </td>

                      <td>

                        <div className="admin-enquiry-subject">

                          <strong>
                            {enquiry.subject}
                          </strong>

                          <span>
                            {enquiry.message}
                          </span>

                        </div>

                      </td>

                      <td className="admin-enquiry-date">
                        {formatDate(
                          enquiry.created_at
                        )}
                      </td>

                      <td>

                        <span
                          className={
                            `admin-enquiry-status ${statusClass(
                              enquiry.status
                            )}`
                          }
                        >
                          {enquiry.status}
                        </span>

                      </td>

                      <td>

                        <div className="admin-enquiry-actions">

                          <button
                            type="button"
                            title="Open enquiry"
                            onClick={() =>
                              openEnquiry(
                                enquiry
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Delete enquiry"
                            className="danger"
                            disabled={
                              updatingId ===
                              enquiry.id
                            }
                            onClick={() =>
                              deleteEnquiry(
                                enquiry
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {selected && (
        <>

          <button
            type="button"
            className="admin-enquiry-modal-overlay"
            aria-label="Close enquiry"
            onClick={() =>
              setSelected(null)
            }
          />

          <aside className="admin-enquiry-drawer">

            <div className="admin-enquiry-drawer-header">

              <div>

                <span className="admin-enquiries-eyebrow">
                  Enquiry #{selected.id}
                </span>

                <h2>
                  {selected.subject}
                </h2>

              </div>

              <button
                type="button"
                className="admin-enquiry-close"
                onClick={() =>
                  setSelected(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="admin-enquiry-contact-grid">

              <div>

                <Mail size={17} />

                <span>Email</span>

                <strong>
                  {selected.email}
                </strong>

                <div className="admin-enquiry-mini-actions">

                  <button
                    type="button"
                    onClick={() =>
                      copyValue(
                        selected.email,
                        'email'
                      )
                    }
                  >
                    <Copy size={14} />

                    {copied === 'email'
                      ? 'Copied'
                      : 'Copy'}
                  </button>

                  <a
                    href={`mailto:${selected.email}`}
                  >
                    <ExternalLink size={14} />
                    Email
                  </a>

                </div>

              </div>

              <div>

                <Phone size={17} />

                <span>Phone</span>

                <strong>
                  {selected.phone ||
                    'Not provided'}
                </strong>

                {selected.phone && (

                  <div className="admin-enquiry-mini-actions">

                    <button
                      type="button"
                      onClick={() =>
                        copyValue(
                          selected.phone,
                          'phone'
                        )
                      }
                    >
                      <Copy size={14} />

                      {copied === 'phone'
                        ? 'Copied'
                        : 'Copy'}
                    </button>

                    <a
                      href={`tel:${selected.phone}`}
                    >
                      <ExternalLink size={14} />
                      Call
                    </a>

                  </div>

                )}

              </div>

            </div>

            <div className="admin-enquiry-meta">

              <div>

                <CalendarDays size={16} />

                <span>Received</span>

                <strong>
                  {formatDate(
                    selected.created_at
                  )}
                </strong>

              </div>

              <div>

                <Clock3 size={16} />

                <span>Last Updated</span>

                <strong>
                  {formatDate(
                    selected.updated_at
                  )}
                </strong>

              </div>

            </div>

            <div className="admin-enquiry-message">

              <div>

                <MessageSquareText size={18} />

                <strong>
                  Customer Message
                </strong>

              </div>

              <p>
                {selected.message}
              </p>

            </div>

            <div className="admin-enquiry-status-editor">

              <label>
                Enquiry Status
              </label>

              <div>

                {STATUS_OPTIONS.map(
                  (status) => (

                    <button
                      type="button"
                      key={status}
                      disabled={
                        updatingId ===
                        selected.id
                      }
                      className={
                        selected.status === status
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        updateStatus(
                          selected.id,
                          status
                        )
                      }
                    >

                      {status === 'Resolved' && (
                        <CheckCircle2 size={15} />
                      )}

                      {status}

                    </button>

                  )
                )}

              </div>

            </div>

            <button
              type="button"
              className="admin-enquiry-delete-large"
              disabled={
                updatingId ===
                selected.id
              }
              onClick={() =>
                deleteEnquiry(
                  selected
                )
              }
            >
              <Trash2 size={16} />
              Delete Enquiry
            </button>

          </aside>

        </>
      )}

    </main>
  )
}