import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  AlertCircle,
  Boxes,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  Clock3,
  CreditCard,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  Package,
  PackageCheck,
  Phone,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  UserRound,
  X
} from 'lucide-react'

import {
  useAdminAuth
} from '../context/AdminAuthContext.jsx'

import './AdminOrders.css'

const API_URL =
  'import.meta.env.VITE_API_URL'

const STATUSES = [
  'Pending',
  'Confirmed',
  'Packed',
  'Shipped',
  'Delivered',
  'Cancelled'
]

function formatCurrency(
  value
) {
  const amount =
    Number(value || 0)

  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }
  ).format(amount)
}

function formatOrderId(
  value
) {
  return `CE-${String(
    value
  ).padStart(
    5,
    '0'
  )}`
}

function getStatusClass(
  status
) {
  return String(
    status || 'Pending'
  )
    .toLowerCase()
    .replace(
      /\s+/g,
      '-'
    )
}

function formatDate(
  value
) {
  if (!value) {
    return '-'
  }

  try {
    let normalized =
      String(value)

    if (
      !normalized.includes(
        'T'
      )
    ) {
      normalized =
        normalized.replace(
          ' ',
          'T'
        )
    }

    const date =
      new Date(
        normalized
      )

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value
    }

    return date.toLocaleString(
      'en-IN',
      {
        dateStyle:
          'medium',

        timeStyle:
          'short'
      }
    )
  } catch {
    return value
  }
}

async function readResponse(
  response
) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

export default function AdminOrders() {
  const navigate =
    useNavigate()

  const {
    token,
    admin,
    logout
  } =
    useAdminAuth()

  const [
    orders,
    setOrders
  ] =
    useState([])

  const [
    stats,
    setStats
  ] =
    useState({
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      revenue: 0
    })

  const [
    search,
    setSearch
  ] =
    useState('')

  const [
    filterStatus,
    setFilterStatus
  ] =
    useState('All')

  const [
    loading,
    setLoading
  ] =
    useState(true)

  const [
    refreshing,
    setRefreshing
  ] =
    useState(false)

  const [
    error,
    setError
  ] =
    useState('')

  const [
    expandedOrder,
    setExpandedOrder
  ] =
    useState(null)

  const [
    orderDetails,
    setOrderDetails
  ] =
    useState({})

  const [
    detailLoadingId,
    setDetailLoadingId
  ] =
    useState(null)

  const [
    updatingOrderId,
    setUpdatingOrderId
  ] =
    useState(null)

  const [
    deletingOrderId,
    setDeletingOrderId
  ] =
    useState(null)

  const [
    mobileMenuOpen,
    setMobileMenuOpen
  ] =
    useState(false)

  const handleUnauthorized =
    useCallback(
      () => {
        logout()

        navigate(
          '/admin/login',
          {
            replace: true
          }
        )
      },
      [
        logout,
        navigate
      ]
    )

  const getHeaders =
    useCallback(
      (
        includeJson = false
      ) => {
        const headers = {
          Authorization:
            `Bearer ${token}`
        }

        if (
          includeJson
        ) {
          headers[
            'Content-Type'
          ] =
            'application/json'
        }

        return headers
      },
      [
        token
      ]
    )

  const fetchOrders =
    useCallback(
      async () => {
        const response =
          await fetch(
            `${API_URL}/api/orders`,
            {
              headers:
                getHeaders()
            }
          )

        if (
          response.status ===
          401
        ) {
          handleUnauthorized()

          return null
        }

        const data =
          await readResponse(
            response
          )

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              'Unable to load orders.'
          )
        }

        const receivedOrders =
          Array.isArray(
            data.orders
          )
            ? data.orders
            : []

        setOrders(
          receivedOrders
        )

        return receivedOrders
      },
      [
        getHeaders,
        handleUnauthorized
      ]
    )

  const fetchStats =
    useCallback(
      async () => {
        const response =
          await fetch(
            `${API_URL}/api/admin/stats`,
            {
              headers:
                getHeaders()
            }
          )

        if (
          response.status ===
          401
        ) {
          handleUnauthorized()

          return null
        }

        const data =
          await readResponse(
            response
          )

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              'Unable to load order statistics.'
          )
        }

        const receivedStats =
          data.stats || {}

        setStats({
          totalOrders:
            Number(
              receivedStats.totalOrders ||
                0
            ),

          pendingOrders:
            Number(
              receivedStats.pendingOrders ||
                0
            ),

          deliveredOrders:
            Number(
              receivedStats.deliveredOrders ||
                0
            ),

          revenue:
            Number(
              receivedStats.revenue ||
                0
            )
        })

        return receivedStats
      },
      [
        getHeaders,
        handleUnauthorized
      ]
    )

  const loadDashboard =
    useCallback(
      async (
        isRefresh = false
      ) => {
        try {
          setError('')

          if (
            isRefresh
          ) {
            setRefreshing(
              true
            )
          } else {
            setLoading(
              true
            )
          }

          await Promise.all([
            fetchOrders(),
            fetchStats()
          ])
        } catch (
          loadError
        ) {
          console.error(
            'Admin dashboard error:',
            loadError
          )

          if (
            loadError instanceof
            TypeError
          ) {
            setError(
              'Unable to connect to the Cordial Express server. Make sure the backend is running on port 5000.'
            )
          } else {
            setError(
              loadError.message ||
                'Unable to load the admin dashboard.'
            )
          }
        } finally {
          setLoading(
            false
          )

          setRefreshing(
            false
          )
        }
      },
      [
        fetchOrders,
        fetchStats
      ]
    )

  useEffect(
    () => {
      if (
        !token
      ) {
        handleUnauthorized()

        return
      }

      loadDashboard()
    },
    [
      token,
      handleUnauthorized,
      loadDashboard
    ]
  )

  const filteredOrders =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase()

        return orders.filter(
          (
            order
          ) => {
            const statusMatches =
              filterStatus ===
                'All' ||
              order.status ===
                filterStatus

            const searchableText =
              [
                order.id,
                formatOrderId(
                  order.id
                ),
                order.customer_name,
                order.phone,
                order.email,
                order.city,
                order.state,
                order.pincode,
                order.payment_method,
                order.status
              ]
                .filter(
                  Boolean
                )
                .join(' ')
                .toLowerCase()

            const searchMatches =
              !query ||
              searchableText.includes(
                query
              )

            return (
              statusMatches &&
              searchMatches
            )
          }
        )
      },
      [
        orders,
        search,
        filterStatus
      ]
    )

  const updateStatus =
    async (
      orderId,
      newStatus
    ) => {
      try {
        setUpdatingOrderId(
          orderId
        )

        const response =
          await fetch(
            `${API_URL}/api/orders/${orderId}/status`,
            {
              method:
                'PATCH',

              headers:
                getHeaders(
                  true
                ),

              body:
                JSON.stringify({
                  status:
                    newStatus
                })
            }
          )

        if (
          response.status ===
          401
        ) {
          handleUnauthorized()

          return
        }

        const data =
          await readResponse(
            response
          )

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              'Unable to update the order status.'
          )
        }

        setOrders(
          (
            current
          ) =>
            current.map(
              (
                order
              ) =>
                order.id ===
                orderId
                  ? {
                      ...order,
                      status:
                        newStatus
                    }
                  : order
            )
        )

        setOrderDetails(
          (
            current
          ) => {
            if (
              !current[
                orderId
              ]
            ) {
              return current
            }

            return {
              ...current,

              [orderId]: {
                ...current[
                  orderId
                ],

                status:
                  newStatus
              }
            }
          }
        )

        await fetchStats()
      } catch (
        updateError
      ) {
        console.error(
          'Update status error:',
          updateError
        )

        window.alert(
          updateError.message ||
            'Unable to update order status.'
        )

        await fetchOrders()
      } finally {
        setUpdatingOrderId(
          null
        )
      }
    }

  const toggleOrder =
    async (
      orderId
    ) => {
      if (
        expandedOrder ===
        orderId
      ) {
        setExpandedOrder(
          null
        )

        return
      }

      setExpandedOrder(
        orderId
      )

      if (
        orderDetails[
          orderId
        ]
      ) {
        return
      }

      try {
        setDetailLoadingId(
          orderId
        )

        const response =
          await fetch(
            `${API_URL}/api/orders/${orderId}`,
            {
              headers:
                getHeaders()
            }
          )

        if (
          response.status ===
          401
        ) {
          handleUnauthorized()

          return
        }

        const data =
          await readResponse(
            response
          )

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              'Unable to load order details.'
          )
        }

        const details =
          data.order

        if (
          !details
        ) {
          throw new Error(
            'Order details were not returned by the server.'
          )
        }

        setOrderDetails(
          (
            current
          ) => ({
            ...current,

            [orderId]:
              details
          })
        )
      } catch (
        detailError
      ) {
        console.error(
          'Order details error:',
          detailError
        )

        window.alert(
          detailError.message ||
            'Unable to load order details.'
        )

        setExpandedOrder(
          null
        )
      } finally {
        setDetailLoadingId(
          null
        )
      }
    }

  const deleteOrder =
    async (
      orderId
    ) => {
      const confirmed =
        window.confirm(
          `Delete order ${formatOrderId(
            orderId
          )}? This action cannot be undone.`
        )

      if (
        !confirmed
      ) {
        return
      }

      try {
        setDeletingOrderId(
          orderId
        )

        const response =
          await fetch(
            `${API_URL}/api/orders/${orderId}`,
            {
              method:
                'DELETE',

              headers:
                getHeaders()
            }
          )

        if (
          response.status ===
          401
        ) {
          handleUnauthorized()

          return
        }

        const data =
          await readResponse(
            response
          )

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              'Unable to delete order.'
          )
        }

        setOrders(
          (
            current
          ) =>
            current.filter(
              (
                order
              ) =>
                order.id !==
                orderId
            )
        )

        setOrderDetails(
          (
            current
          ) => {
            const updated = {
              ...current
            }

            delete updated[
              orderId
            ]

            return updated
          }
        )

        if (
          expandedOrder ===
          orderId
        ) {
          setExpandedOrder(
            null
          )
        }

        await fetchStats()
      } catch (
        deleteError
      ) {
        console.error(
          'Delete order error:',
          deleteError
        )

        window.alert(
          deleteError.message ||
            'Unable to delete order.'
        )
      } finally {
        setDeletingOrderId(
          null
        )
      }
    }

  const handleLogout =
    () => {
      logout()

      navigate(
        '/admin/login',
        {
          replace: true
        }
      )
    }

  const clearFilters =
    () => {
      setSearch('')

      setFilterStatus(
        'All'
      )
    }

  const activeOrders =
    Math.max(
      0,
      Number(
        stats.totalOrders ||
          0
      ) -
        Number(
          stats.deliveredOrders ||
            0
        )
    )

  return (
    <main className="ce-admin-page">

      <aside
        className={`ce-admin-sidebar ${
          mobileMenuOpen
            ? 'is-open'
            : ''
        }`}
      >

        <div className="ce-admin-sidebar-head">

          <Link
            to="/"
            className="ce-admin-brand"
          >

            <div className="ce-admin-brand-mark">
              C
            </div>

            <div>

              <strong>
                Cordial Express
              </strong>

              <span>
                ADMIN CONSOLE
              </span>

            </div>

          </Link>

          <button
            type="button"
            className="ce-admin-sidebar-close"
            onClick={
              () =>
                setMobileMenuOpen(
                  false
                )
            }
            aria-label="Close admin menu"
          >

            <X
              size={20}
            />

          </button>

        </div>

        <nav className="ce-admin-nav">

          <span className="ce-admin-nav-label">
            MANAGEMENT
          </span>

          <Link
            to="/admin/orders"
            className="ce-admin-nav-link active"
          >

            <LayoutDashboard
              size={18}
            />

            <span>
              Orders
            </span>

          </Link>

          <Link
            to="/admin/products"
            className="ce-admin-nav-link"
          >

            <Boxes
              size={18}
            />

            <span>
              Products
            </span>

          </Link>

          <Link
            to="/admin/enquiries"
            className="ce-admin-nav-link"
          >

            <MessageSquareText
              size={18}
            />

            <span>
              Enquiries
            </span>

          </Link>

          <span className="ce-admin-nav-label ce-admin-nav-label-store">
            STORE
          </span>

          <Link
            to="/"
            className="ce-admin-nav-link"
          >

            <Store
              size={18}
            />

            <span>
              View Store
            </span>

          </Link>

        </nav>

        <div className="ce-admin-sidebar-footer">

          <div className="ce-admin-user-card">

            <div className="ce-admin-user-avatar">

              <UserRound
                size={18}
              />

            </div>

            <div>

              <strong>
                {
                  admin?.name ||
                  'Cordial Express Admin'
                }
              </strong>

              <span>
                {
                  admin?.email ||
                  'Administrator'
                }
              </span>

            </div>

          </div>

          <button
            type="button"
            className="ce-admin-logout-button"
            onClick={
              handleLogout
            }
          >

            <LogOut
              size={17}
            />

            Logout

          </button>

        </div>

      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="ce-admin-overlay"
          onClick={
            () =>
              setMobileMenuOpen(
                false
              )
          }
          aria-label="Close menu"
        />
      )}

      <section className="ce-admin-content">

        <header className="ce-admin-topbar">

          <div className="ce-admin-topbar-left">

            <button
              type="button"
              className="ce-admin-menu-button"
              onClick={
                () =>
                  setMobileMenuOpen(
                    true
                  )
              }
              aria-label="Open admin menu"
            >

              <Menu
                size={20}
              />

            </button>

            <div>

              <span>
                STORE MANAGEMENT
              </span>

              <h1>
                Orders
              </h1>

            </div>

          </div>

          <div className="ce-admin-topbar-actions">

            <div className="ce-admin-status-pill">

              <span />

              Admin Active

            </div>

            <button
              type="button"
              className="ce-admin-refresh"
              onClick={
                () =>
                  loadDashboard(
                    true
                  )
              }
              disabled={
                refreshing ||
                loading
              }
            >

              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? 'is-spinning'
                    : ''
                }
              />

              <span>
                {
                  refreshing
                    ? 'Refreshing'
                    : 'Refresh'
                }
              </span>

            </button>

          </div>

        </header>

        <div className="ce-admin-content-inner">

          <section className="ce-admin-heading">

            <div>

              <span className="ce-admin-eyebrow">
                ORDER MANAGEMENT
              </span>

              <h2>
                Store orders at a glance.
              </h2>

              <p>
                Review customer orders,
                manage fulfilment status
                and access delivery
                information.
              </p>

            </div>

          </section>

          <section className="ce-admin-stats">

            <article className="ce-admin-stat-card">

              <div className="ce-admin-stat-icon">

                <ShoppingBag
                  size={20}
                />

              </div>

              <div>

                <span>
                  Total Orders
                </span>

                <strong>
                  {
                    stats.totalOrders
                  }
                </strong>

                <small>
                  All recorded orders
                </small>

              </div>

            </article>

            <article className="ce-admin-stat-card">

              <div className="ce-admin-stat-icon pending">

                <Clock3
                  size={20}
                />

              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>
                  {
                    stats.pendingOrders
                  }
                </strong>

                <small>
                  Awaiting action
                </small>

              </div>

            </article>

            <article className="ce-admin-stat-card">

              <div className="ce-admin-stat-icon delivered">

                <CircleCheckBig
                  size={20}
                />

              </div>

              <div>

                <span>
                  Delivered
                </span>

                <strong>
                  {
                    stats.deliveredOrders
                  }
                </strong>

                <small>
                  Completed orders
                </small>

              </div>

            </article>

            <article className="ce-admin-stat-card">

              <div className="ce-admin-stat-icon revenue">

                <IndianRupee
                  size={20}
                />

              </div>

              <div>

                <span>
                  Revenue
                </span>

                <strong>
                  {
                    formatCurrency(
                      stats.revenue
                    )
                  }
                </strong>

                <small>
                  Recorded revenue
                </small>

              </div>

            </article>

          </section>

          <section className="ce-admin-summary-strip">

            <div>

              <PackageCheck
                size={18}
              />

              <span>
                Active Orders
              </span>

              <strong>
                {
                  activeOrders
                }
              </strong>

            </div>

            <div>

              <Package
                size={18}
              />

              <span>
                Showing
              </span>

              <strong>
                {
                  filteredOrders.length
                }
              </strong>

            </div>

            <div>

              <Truck
                size={18}
              />

              <span>
                Status Filters
              </span>

              <strong>
                {
                  STATUSES.length
                }
              </strong>

            </div>

          </section>

          <section className="ce-admin-orders-panel">

            <div className="ce-admin-panel-head">

              <div>

                <span>
                  CUSTOMER ORDERS
                </span>

                <h3>
                  Order Management
                </h3>

              </div>

              <span className="ce-admin-result-count">
                {
                  filteredOrders.length
                }{' '}
                {
                  filteredOrders.length ===
                  1
                    ? 'order'
                    : 'orders'
                }
              </span>

            </div>

            <div className="ce-admin-toolbar">

              <div className="ce-admin-search">

                <Search
                  size={17}
                />

                <input
                  type="search"
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search order ID, customer, phone, city..."
                />

                {search && (
                  <button
                    type="button"
                    onClick={
                      () =>
                        setSearch(
                          ''
                        )
                    }
                    aria-label="Clear search"
                  >

                    <X
                      size={15}
                    />

                  </button>
                )}

              </div>

              <div className="ce-admin-filter-wrap">

                <select
                  value={
                    filterStatus
                  }
                  onChange={(
                    event
                  ) =>
                    setFilterStatus(
                      event.target.value
                    )
                  }
                >

                  <option value="All">
                    All Statuses
                  </option>

                  {STATUSES.map(
                    (
                      status
                    ) => (
                      <option
                        key={
                          status
                        }
                        value={
                          status
                        }
                      >
                        {
                          status
                        }
                      </option>
                    )
                  )}

                </select>

                <ChevronDown
                  size={15}
                />

              </div>

              {(
                search ||
                filterStatus !==
                  'All'
              ) && (
                <button
                  type="button"
                  className="ce-admin-clear-filter"
                  onClick={
                    clearFilters
                  }
                >
                  Clear
                </button>
              )}

            </div>

            {error && (
              <div className="ce-admin-error">

                <AlertCircle
                  size={18}
                />

                <div>

                  <strong>
                    Unable to load orders
                  </strong>

                  <span>
                    {error}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={
                    () =>
                      loadDashboard(
                        true
                      )
                  }
                >
                  Try Again
                </button>

              </div>
            )}

            {loading ? (

              <div className="ce-admin-loading">

                <RefreshCw
                  size={28}
                  className="is-spinning"
                />

                <strong>
                  Loading orders
                </strong>

                <span>
                  Preparing your admin
                  dashboard...
                </span>

              </div>

            ) : filteredOrders.length ===
              0 ? (

              <div className="ce-admin-empty">

                <div>

                  <ShoppingBag
                    size={27}
                  />

                </div>

                <h3>
                  No orders found
                </h3>

                <p>
                  {
                    search ||
                    filterStatus !==
                      'All'
                      ? 'Try changing your search or status filter.'
                      : 'Customer orders will appear here when they are placed.'
                  }
                </p>

                {(
                  search ||
                  filterStatus !==
                    'All'
                ) && (
                  <button
                    type="button"
                    onClick={
                      clearFilters
                    }
                  >
                    Clear Filters
                  </button>
                )}

              </div>

            ) : (

              <div className="ce-admin-order-list">

                {filteredOrders.map(
                  (
                    order
                  ) => {
                    const isExpanded =
                      expandedOrder ===
                      order.id

                    const details =
                      orderDetails[
                        order.id
                      ]

                    const statusClass =
                      getStatusClass(
                        order.status
                      )

                    return (
                      <article
                        key={
                          order.id
                        }
                        className={`ce-admin-order-card ${
                          isExpanded
                            ? 'expanded'
                            : ''
                        }`}
                      >

                        <div className="ce-admin-order-row">

                          <div className="ce-admin-order-id">

                            <span>
                              ORDER
                            </span>

                            <strong>
                              {
                                formatOrderId(
                                  order.id
                                )
                              }
                            </strong>

                          </div>

                          <div className="ce-admin-order-customer">

                            <span>
                              CUSTOMER
                            </span>

                            <strong>
                              {
                                order.customer_name ||
                                'Customer'
                              }
                            </strong>

                            <small>
                              {
                                order.phone ||
                                '-'
                              }
                            </small>

                          </div>

                          <div className="ce-admin-order-date">

                            <span>
                              PLACED
                            </span>

                            <strong>
                              {
                                formatDate(
                                  order.created_at
                                )
                              }
                            </strong>

                          </div>

                          <div className="ce-admin-order-price">

                            <span>
                              TOTAL
                            </span>

                            <strong>
                              {
                                formatCurrency(
                                  order.total
                                )
                              }
                            </strong>

                          </div>

                          <div className="ce-admin-order-status">

                            <span
                              className={`ce-admin-status-badge status-${statusClass}`}
                            >
                              {
                                order.status ||
                                'Pending'
                              }
                            </span>

                            <div className="ce-admin-status-select">

                              <select
                                value={
                                  order.status ||
                                  'Pending'
                                }
                                disabled={
                                  updatingOrderId ===
                                  order.id
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateStatus(
                                    order.id,
                                    event.target.value
                                  )
                                }
                              >

                                {STATUSES.map(
                                  (
                                    status
                                  ) => (
                                    <option
                                      key={
                                        status
                                      }
                                      value={
                                        status
                                      }
                                    >
                                      {
                                        status
                                      }
                                    </option>
                                  )
                                )}

                              </select>

                              <ChevronDown
                                size={14}
                              />

                            </div>

                          </div>

                          <button
                            type="button"
                            className="ce-admin-expand"
                            onClick={
                              () =>
                                toggleOrder(
                                  order.id
                                )
                            }
                            aria-label={
                              isExpanded
                                ? 'Collapse order'
                                : 'View order details'
                            }
                          >

                            {
                              isExpanded
                                ? (
                                  <ChevronUp
                                    size={19}
                                  />
                                )
                                : (
                                  <ChevronDown
                                    size={19}
                                  />
                                )
                            }

                          </button>

                        </div>

                        {isExpanded && (
                          <div className="ce-admin-order-details">

                            {
                              detailLoadingId ===
                              order.id
                                ? (
                                  <div className="ce-admin-detail-loading">

                                    <RefreshCw
                                      size={21}
                                      className="is-spinning"
                                    />

                                    Loading order details...

                                  </div>
                                )
                                : !details
                                  ? (
                                    <div className="ce-admin-detail-loading">
                                      No order details available.
                                    </div>
                                  )
                                  : (
                                    <>

                                      <div className="ce-admin-detail-grid">

                                        <section className="ce-admin-detail-card">

                                          <div className="ce-admin-detail-title">

                                            <MapPin
                                              size={17}
                                            />

                                            <div>

                                              <span>
                                                DELIVERY
                                              </span>

                                              <h4>
                                                Customer Details
                                              </h4>

                                            </div>

                                          </div>

                                          <div className="ce-admin-detail-lines">

                                            <div>

                                              <MapPin
                                                size={15}
                                              />

                                              <span>
                                                {
                                                  details.address ||
                                                  '-'
                                                }
                                                {
                                                  details.city
                                                    ? `, ${details.city}`
                                                    : ''
                                                }
                                                {
                                                  details.state
                                                    ? `, ${details.state}`
                                                    : ''
                                                }
                                                {
                                                  details.pincode
                                                    ? ` - ${details.pincode}`
                                                    : ''
                                                }
                                              </span>

                                            </div>

                                            <div>

                                              <Phone
                                                size={15}
                                              />

                                              <a
                                                href={
                                                  details.phone
                                                    ? `tel:${details.phone}`
                                                    : undefined
                                                }
                                              >
                                                {
                                                  details.phone ||
                                                  '-'
                                                }
                                              </a>

                                            </div>

                                            {details.email && (
                                              <div>

                                                <Mail
                                                  size={15}
                                                />

                                                <a
                                                  href={`mailto:${details.email}`}
                                                >
                                                  {
                                                    details.email
                                                  }
                                                </a>

                                              </div>
                                            )}

                                            <div>

                                              <CreditCard
                                                size={15}
                                              />

                                              <span>
                                                {
                                                  details.payment_method ||
                                                  'Cash on Delivery'
                                                }
                                              </span>

                                            </div>

                                          </div>

                                        </section>

                                        <section className="ce-admin-detail-card">

                                          <div className="ce-admin-detail-title">

                                            <Package
                                              size={17}
                                            />

                                            <div>

                                              <span>
                                                ITEMS
                                              </span>

                                              <h4>
                                                Ordered Products
                                              </h4>

                                            </div>

                                          </div>

                                          <div className="ce-admin-items">

                                            {
                                              Array.isArray(
                                                details.items
                                              ) &&
                                              details.items.length >
                                                0
                                                ? details.items.map(
                                                    (
                                                      item,
                                                      index
                                                    ) => (
                                                      <div
                                                        className="ce-admin-item"
                                                        key={
                                                          item.id ||
                                                          `${order.id}-${index}`
                                                        }
                                                      >

                                                        <div>

                                                          <strong>
                                                            {
                                                              item.product_name ||
                                                              item.name ||
                                                              'Product'
                                                            }
                                                          </strong>

                                                          <span>
                                                            Qty{' '}
                                                            {
                                                              item.quantity
                                                            }{' '}
                                                            ×{' '}
                                                            {
                                                              formatCurrency(
                                                                item.price
                                                              )
                                                            }
                                                          </span>

                                                        </div>

                                                        <strong>
                                                          {
                                                            formatCurrency(
                                                              Number(
                                                                item.price ||
                                                                0
                                                              ) *
                                                              Number(
                                                                item.quantity ||
                                                                0
                                                              )
                                                            )
                                                          }
                                                        </strong>

                                                      </div>
                                                    )
                                                  )
                                                : (
                                                  <p className="ce-admin-no-items">
                                                    No product details available.
                                                  </p>
                                                )
                                            }

                                          </div>

                                        </section>

                                      </div>

                                      <div className="ce-admin-order-footer">

                                        <div className="ce-admin-order-totals">

                                          <div>

                                            <span>
                                              Subtotal
                                            </span>

                                            <strong>
                                              {
                                                formatCurrency(
                                                  details.subtotal
                                                )
                                              }
                                            </strong>

                                          </div>

                                          <div>

                                            <span>
                                              Delivery
                                            </span>

                                            <strong>
                                              {
                                                Number(
                                                  details.delivery_charge ||
                                                  0
                                                ) ===
                                                0
                                                  ? 'FREE'
                                                  : formatCurrency(
                                                      details.delivery_charge
                                                    )
                                              }
                                            </strong>

                                          </div>

                                          <div className="total">

                                            <span>
                                              Total
                                            </span>

                                            <strong>
                                              {
                                                formatCurrency(
                                                  details.total
                                                )
                                              }
                                            </strong>

                                          </div>

                                        </div>

                                        <button
                                          type="button"
                                          className="ce-admin-delete"
                                          disabled={
                                            deletingOrderId ===
                                            order.id
                                          }
                                          onClick={
                                            () =>
                                              deleteOrder(
                                                order.id
                                              )
                                          }
                                        >

                                          {
                                            deletingOrderId ===
                                            order.id
                                              ? (
                                                <RefreshCw
                                                  size={16}
                                                  className="is-spinning"
                                                />
                                              )
                                              : (
                                                <Trash2
                                                  size={16}
                                                />
                                              )
                                          }

                                          {
                                            deletingOrderId ===
                                            order.id
                                              ? 'Deleting...'
                                              : 'Delete Order'
                                          }

                                        </button>

                                      </div>

                                    </>
                                  )
                            }

                          </div>
                        )}

                      </article>
                    )
                  }
                )}

              </div>

            )}

          </section>

        </div>

      </section>

    </main>
  )
}