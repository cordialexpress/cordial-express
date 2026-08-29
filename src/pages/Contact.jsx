import {
  useState
} from 'react'

import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Headphones,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  Send,
  ShieldCheck,
  Sparkles
} from 'lucide-react'

import {
  Link
} from 'react-router-dom'

const API_URL =
  'import.meta.env.VITE_API_URL'

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
}

export default function Contact() {
  const [
    form,
    setForm
  ] = useState(
    INITIAL_FORM
  )

  const [
    loading,
    setLoading
  ] = useState(false)

  const [
    success,
    setSuccess
  ] = useState('')

  const [
    error,
    setError
  ] = useState('')

  const updateField =
    (
      field,
      value
    ) => {
      setForm(
        (current) => ({
          ...current,
          [field]: value
        })
      )

      if (success) {
        setSuccess('')
      }

      if (error) {
        setError('')
      }
    }

  const validateForm =
    () => {
      const name =
        form.name.trim()

      const email =
        form.email
          .trim()
          .toLowerCase()

      const phone =
        form.phone.replace(
          /\D/g,
          ''
        )

      const subject =
        form.subject.trim()

      const message =
        form.message.trim()

      if (
        !name ||
        !email ||
        !subject ||
        !message
      ) {
        return 'Please fill in all required fields.'
      }

      if (
        name.length < 2
      ) {
        return 'Please enter your full name.'
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
      ) {
        return 'Please enter a valid email address.'
      }

      if (
        phone &&
        !/^[6-9]\d{9}$/.test(
          phone
        )
      ) {
        return 'Please enter a valid 10-digit Indian mobile number.'
      }

      if (
        subject.length < 3
      ) {
        return 'Please enter a clear subject.'
      }

      if (
        message.length < 10
      ) {
        return 'Your message should be at least 10 characters long.'
      }

      return ''
    }

  const handleSubmit =
    async (event) => {
      event.preventDefault()

      if (loading) {
        return
      }

      setSuccess('')
      setError('')

      const validationError =
        validateForm()

      if (validationError) {
        setError(
          validationError
        )

        return
      }

      try {
        setLoading(true)

        const response =
          await fetch(
            `${API_URL}/api/contact`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body: JSON.stringify({
                name:
                  form.name.trim(),

                email:
                  form.email
                    .trim()
                    .toLowerCase(),

                phone:
                  form.phone.replace(
                    /\D/g,
                    ''
                  ),

                subject:
                  form.subject.trim(),

                message:
                  form.message.trim()
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
              'Unable to send your message.'
          )
        }

        setSuccess(
          data.message ||
            'Your message has been sent successfully.'
        )

        setForm(
          INITIAL_FORM
        )
      } catch (
        submitError
      ) {
        console.error(
          'Contact submission error:',
          submitError
        )

        if (
          submitError instanceof TypeError
        ) {
          setError(
            'Unable to connect to Cordial Express. Please make sure the server is running.'
          )
        } else {
          setError(
            submitError.message ||
              'Unable to send your message right now.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

  return (
    <main className="ce-contact-page">

      {/* HERO */}

      <section className="ce-contact-hero">

        <div className="ce-contact-hero-copy">

          <span className="ce-contact-eyebrow">

            <Sparkles
              size={13}
            />

            Cordial Express Support

          </span>

          <h1>
            We’re here
            <span>
              to help.
            </span>
          </h1>

          <p>
            Questions about a product,
            your order, delivery or
            Cordial Express? Send us a
            message and our support team
            can review your enquiry.
          </p>

          <div className="ce-contact-hero-actions">

            <a
              href="mailto:support@cordialexpress.com"
            >
              <Mail
                size={16}
              />

              Email Support
            </a>

            <Link
              to="/track-order"
            >
              <PackageSearch
                size={16}
              />

              Track Order
            </Link>

          </div>

        </div>

        <div className="ce-contact-hero-visual">

          <div className="ce-contact-hero-icon">

            <MessageCircle
              size={34}
            />

          </div>

          <div>

            <span>
              CUSTOMER SUPPORT
            </span>

            <strong>
              How can we help today?
            </strong>

            <p>
              Send your enquiry using
              the secure contact form.
            </p>

          </div>

        </div>

      </section>

      {/* QUICK HELP */}

      <section className="ce-contact-quick-grid">

        <Link
          to="/track-order"
          className="ce-contact-quick-card"
        >

          <div>
            <PackageSearch
              size={21}
            />
          </div>

          <span>
            ORDERS
          </span>

          <strong>
            Track an order
          </strong>

          <p>
            Check your latest order
            status using your order ID
            and mobile number.
          </p>

          <small>
            Open Tracking

            <ChevronRight
              size={13}
            />
          </small>

        </Link>

        <a
          href="mailto:support@cordialexpress.com"
          className="ce-contact-quick-card"
        >

          <div>
            <Mail
              size={21}
            />
          </div>

          <span>
            EMAIL
          </span>

          <strong>
            Email support
          </strong>

          <p>
            Contact Cordial Express
            directly for product,
            delivery or order questions.
          </p>

          <small>
            Send Email

            <ChevronRight
              size={13}
            />
          </small>

        </a>

        <div className="ce-contact-quick-card">

          <div>
            <Clock3
              size={21}
            />
          </div>

          <span>
            SUPPORT
          </span>

          <strong>
            Support availability
          </strong>

          <p>
            Customer enquiries can be
            submitted through our
            contact form at any time.
          </p>

          <small>
            Monday – Saturday
          </small>

        </div>

      </section>

      {/* MAIN AREA */}

      <section className="ce-contact-layout">

        {/* LEFT */}

        <aside className="ce-contact-info-panel">

          <span className="ce-contact-section-label">
            GET IN TOUCH
          </span>

          <h2>
            Need assistance?
          </h2>

          <p className="ce-contact-info-intro">
            Choose the easiest way to
            reach Cordial Express. For
            order-related questions,
            include your order ID so the
            enquiry is easier to review.
          </p>

          <div className="ce-contact-info-list">

            <div className="ce-contact-info-item">

              <div className="ce-contact-info-icon">
                <Mail
                  size={18}
                />
              </div>

              <div>

                <span>
                  Email
                </span>

                <a
                  href="mailto:support@cordialexpress.com"
                >
                  support@cordialexpress.com
                </a>

              </div>

            </div>

            <div className="ce-contact-info-item">

              <div className="ce-contact-info-icon">
                <Phone
                  size={18}
                />
              </div>

              <div>

                <span>
                  Phone
                </span>

                <strong>
                  Customer Support
                </strong>

              </div>

            </div>

            <div className="ce-contact-info-item">

              <div className="ce-contact-info-icon">
                <Clock3
                  size={18}
                />
              </div>

              <div>

                <span>
                  Support hours
                </span>

                <strong>
                  Monday – Saturday
                </strong>

              </div>

            </div>

            <div className="ce-contact-info-item">

              <div className="ce-contact-info-icon">
                <MapPin
                  size={18}
                />
              </div>

              <div>

                <span>
                  Service
                </span>

                <strong>
                  Cordial Express
                </strong>

              </div>

            </div>

          </div>

          <div className="ce-contact-help-note">

            <ShieldCheck
              size={19}
            />

            <div>

              <strong>
                Secure enquiry
              </strong>

              <p>
                Your enquiry is stored
                so the support team can
                review and manage it
                through the admin
                system.
              </p>

            </div>

          </div>

          <div className="ce-contact-order-help">

            <PackageSearch
              size={20}
            />

            <div>

              <strong>
                Looking for an order?
              </strong>

              <span>
                You may not need to
                contact support.
              </span>

              <Link
                to="/track-order"
              >
                Track Order

                <ChevronRight
                  size={13}
                />
              </Link>

            </div>

          </div>

        </aside>

        {/* FORM */}

        <section className="ce-contact-form-card">

          <div className="ce-contact-form-heading">

            <div>

              <span className="ce-contact-section-label">
                SEND A MESSAGE
              </span>

              <h2>
                How can we help?
              </h2>

              <p>
                Complete the form below
                and send your enquiry to
                Cordial Express.
              </p>

            </div>

            <div className="ce-contact-send-icon">

              <Send
                size={21}
              />

            </div>

          </div>

          <form
            className="ce-contact-form"
            onSubmit={
              handleSubmit
            }
          >

            <div className="ce-contact-field-grid">

              <div className="ce-contact-field">

                <label
                  htmlFor="contact-name"
                >
                  Full Name *
                </label>

                <input
                  id="contact-name"
                  type="text"
                  maxLength={80}
                  autoComplete="name"
                  value={
                    form.name
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'name',
                      event.target.value
                    )
                  }
                  placeholder="Your full name"
                />

              </div>

              <div className="ce-contact-field">

                <label
                  htmlFor="contact-email"
                >
                  Email Address *
                </label>

                <input
                  id="contact-email"
                  type="email"
                  maxLength={120}
                  autoComplete="email"
                  value={
                    form.email
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'email',
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                />

              </div>

              <div className="ce-contact-field">

                <label
                  htmlFor="contact-phone"
                >
                  Mobile Number

                  <span>
                    Optional
                  </span>
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoComplete="tel"
                  value={
                    form.phone
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'phone',
                      event.target.value
                        .replace(
                          /\D/g,
                          ''
                        )
                        .slice(
                          0,
                          10
                        )
                    )
                  }
                  placeholder="10-digit mobile number"
                />

              </div>

              <div className="ce-contact-field">

                <label
                  htmlFor="contact-subject"
                >
                  Subject *
                </label>

                <input
                  id="contact-subject"
                  type="text"
                  maxLength={120}
                  value={
                    form.subject
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      'subject',
                      event.target.value
                    )
                  }
                  placeholder="What is this about?"
                />

              </div>

            </div>

            <div className="ce-contact-field ce-contact-message-field">

              <div className="ce-contact-label-row">

                <label
                  htmlFor="contact-message"
                >
                  Message *
                </label>

                <span>
                  {
                    form.message.length
                  }
                  /2000
                </span>

              </div>

              <textarea
                id="contact-message"
                rows={7}
                maxLength={2000}
                value={
                  form.message
                }
                onChange={(
                  event
                ) =>
                  updateField(
                    'message',
                    event.target.value
                  )
                }
                placeholder="Tell us how we can help..."
              />

            </div>

            {error && (

              <div className="ce-contact-alert ce-contact-alert-error">

                <AlertCircle
                  size={18}
                />

                <div>

                  <strong>
                    Unable to send message
                  </strong>

                  <span>
                    {error}
                  </span>

                </div>

              </div>

            )}

            {success && (

              <div className="ce-contact-alert ce-contact-alert-success">

                <CheckCircle2
                  size={18}
                />

                <div>

                  <strong>
                    Message sent
                  </strong>

                  <span>
                    {success}
                  </span>

                </div>

              </div>

            )}

            <button
              type="submit"
              className="ce-contact-submit-button"
              disabled={
                loading
              }
            >

              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="ce-contact-spinner"
                  />

                  Sending Message...
                </>
              ) : (
                <>
                  <Send
                    size={17}
                  />

                  Send Message

                  <ChevronRight
                    size={15}
                  />
                </>
              )}

            </button>

            <div className="ce-contact-form-security">

              <ShieldCheck
                size={14}
              />

              Your message is sent
              directly to the Cordial
              Express support system.

            </div>

          </form>

        </section>

      </section>

      {/* BOTTOM SUPPORT CTA */}

      <section className="ce-contact-bottom">

        <div>

          <Headphones
            size={25}
          />

          <div>

            <span>
              NEED ORDER HELP?
            </span>

            <h2>
              Check your order status first.
            </h2>

            <p>
              Your latest status may
              already be available on
              the Track Order page.
            </p>

          </div>

        </div>

        <Link
          to="/track-order"
        >
          Track Order

          <ChevronRight
            size={15}
          />
        </Link>

      </section>

    </main>
  )
}