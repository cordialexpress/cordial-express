import {
  useMemo
} from 'react'

import {
  Link,
  useLocation
} from 'react-router-dom'

import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Home,
  PackageCheck,
  PackageSearch,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck
} from 'lucide-react'

export default function CheckoutSuccess() {
  const location =
    useLocation()

  const order =
    useMemo(
      () => {
        if (
          location.state?.order
        ) {
          return location.state.order
        }

        try {
          const savedOrder =
            sessionStorage.getItem(
              'cordialLastOrder'
            )

          if (
            savedOrder
          ) {
            return JSON.parse(
              savedOrder
            )
          }
        } catch (
          error
        ) {
          console.error(
            'Unable to read last order:',
            error
          )
        }

        return null
      },
      [
        location.state
      ]
    )

  const orderId =
    order?.id ||
    null

  const orderNumber =
    orderId
      ? `CE-${String(
          orderId
        ).padStart(
          5,
          '0'
        )}`
      : 'Not available'

  const total =
    Number(
      order?.total ||
      0
    )

  const status =
    order?.status ||
    'Pending'

  const paymentMethod =
    order?.payment_method ||
    order?.paymentMethod ||
    'Cash on Delivery'

  const customer =
    order?.customer ||
    {}

  const trackOrderLink =
    orderId
      ? `/track-order?order=${encodeURIComponent(
          orderId
        )}`
      : '/track-order'

  return (
    <main className="ce-success-page">

      <section className="ce-success-shell">

        {/* SUCCESS ICON */}

        <div className="ce-success-icon-wrap">

          <div className="ce-success-ring ce-success-ring-one" />
          <div className="ce-success-ring ce-success-ring-two" />

          <div className="ce-success-icon">

            <CheckCircle2
              size={40}
            />

          </div>

        </div>

        {/* HEADING */}

        <div className="ce-success-heading">

          <span className="ce-success-eyebrow">

            <Sparkles
              size={13}
            />

            Order Confirmed

          </span>

          <h1>
            Thank you for
            <span>
              your order.
            </span>
          </h1>

          <p>
            Your Cordial Express order
            has been placed successfully.
            Keep your order number safe
            so you can track its progress
            anytime.
          </p>

        </div>

        {/* STATUS STRIP */}

        <div className="ce-success-status-strip">

          <div>

            <BadgeCheck
              size={18}
            />

            <span>
              Order received
            </span>

          </div>

          <div className="ce-success-status-line" />

          <div>

            <PackageCheck
              size={18}
            />

            <span>
              Preparing order
            </span>

          </div>

          <div className="ce-success-status-line muted" />

          <div className="muted">

            <Truck
              size={18}
            />

            <span>
              Delivery
            </span>

          </div>

        </div>

        {/* ORDER DETAILS */}

        <section className="ce-success-order-card">

          <div className="ce-success-card-title">

            <div>

              <span>
                ORDER DETAILS
              </span>

              <h2>
                Your order summary
              </h2>

            </div>

            <ReceiptText
              size={22}
            />

          </div>

          <div className="ce-success-details-grid">

            <div>

              <span>
                Order ID
              </span>

              <strong>
                {orderNumber}
              </strong>

            </div>

            <div>

              <span>
                Status
              </span>

              <strong className="ce-success-status">
                {status}
              </strong>

            </div>

            <div>

              <span>
                Total
              </span>

              <strong>
                ₹{
                  total.toLocaleString(
                    'en-IN'
                  )
                }
              </strong>

            </div>

            <div>

              <span>
                Payment
              </span>

              <strong>
                {paymentMethod}
              </strong>

            </div>

          </div>

        </section>

        {/* TRACKING INFO */}

        <section className="ce-success-track-note">

          <PackageSearch
            size={22}
          />

          <div>

            <strong>
              Save your order ID
            </strong>

            <p>
              To track this order, use
              <b>
                {' '}
                {orderNumber}
              </b>{' '}
              together with the same
              mobile number entered
              during checkout.
            </p>

          </div>

        </section>

        {/* DELIVERY INFO */}

        {(customer?.name ||
          customer?.address ||
          customer?.phone) && (

          <section className="ce-success-delivery-card">

            <div className="ce-success-delivery-title">

              <Truck
                size={20}
              />

              <div>

                <span>
                  DELIVERY DETAILS
                </span>

                <h3>
                  Shipping information
                </h3>

              </div>

            </div>

            <div className="ce-success-delivery-grid">

              {customer?.name && (

                <div>

                  <span>
                    Customer
                  </span>

                  <strong>
                    {
                      customer.name
                    }
                  </strong>

                </div>

              )}

              {customer?.phone && (

                <div>

                  <span>
                    Mobile
                  </span>

                  <strong>
                    {
                      customer.phone
                    }
                  </strong>

                </div>

              )}

              {customer?.address && (

                <div className="ce-success-address">

                  <span>
                    Delivery Address
                  </span>

                  <strong>
                    {
                      customer.address
                    }

                    {customer.city
                      ? `, ${customer.city}`
                      : ''}

                    {customer.state
                      ? `, ${customer.state}`
                      : ''}

                    {customer.pincode
                      ? ` - ${customer.pincode}`
                      : ''}
                  </strong>

                </div>

              )}

            </div>

          </section>

        )}

        {/* TRUST */}

        <section className="ce-success-trust">

          <div>

            <ShieldCheck
              size={18}
            />

            <span>
              Securely processed
            </span>

          </div>

          <div>

            <PackageCheck
              size={18}
            />

            <span>
              Stock verified
            </span>

          </div>

          <div>

            <CircleDollarSign
              size={18}
            />

            <span>
              Server-verified pricing
            </span>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="ce-success-actions">

          <Link
            to={
              trackOrderLink
            }
            className="ce-success-primary"
          >

            <PackageSearch
              size={17}
            />

            Track This Order

            <ChevronRight
              size={15}
            />

          </Link>

          <Link
            to="/products"
            className="ce-success-secondary"
          >

            <ShoppingBag
              size={17}
            />

            Continue Shopping

          </Link>

        </div>

        <Link
          to="/"
          className="ce-success-home"
        >

          <Home
            size={14}
          />

          Back to Home

        </Link>

        {/* FINAL NOTE */}

        <div className="ce-success-footer-note">

          <Truck
            size={16}
          />

          <span>
            Delivery updates will appear
            on the Track Order page.
          </span>

        </div>

      </section>

    </main>
  )
}