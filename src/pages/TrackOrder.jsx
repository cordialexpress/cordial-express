import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Link,
  useSearchParams
} from 'react-router-dom'

import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  PackageCheck,
  PackageSearch,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck
} from 'lucide-react'

import './TrackOrder.css'

const API_URL =
  'import.meta.env.VITE_API_URL'

const TRACKING_STEPS = [
  {
    key: 'Pending',
    label: 'Order Placed',
    icon: Clock3
  },
  {
    key: 'Confirmed',
    label: 'Confirmed',
    icon: CheckCircle2
  },
  {
    key: 'Packed',
    label: 'Packed',
    icon: PackageCheck
  },
  {
    key: 'Shipped',
    label: 'Shipped',
    icon: Truck
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    icon: CheckCircle2
  }
]

function normalizeOrderId(
  value
) {
  const cleaned =
    String(
      value || ''
    )
      .trim()
      .replace(
        /^CE-/i,
        ''
      )

  const numeric =
    Number(
      cleaned
    )

  if (
    !Number.isInteger(
      numeric
    ) ||
    numeric <= 0
  ) {
    return ''
  }

  return String(
    numeric
  )
}

function formatDate(
  value
) {
  if (
    !value
  ) {
    return 'Not available'
  }

  const date =
    new Date(
      value
    )

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

export default function TrackOrder() {
  const [
    searchParams
  ] =
    useSearchParams()

  const initialOrderId =
    normalizeOrderId(
      searchParams.get(
        'order'
      )
    )

  const [
    orderId,
    setOrderId
  ] =
    useState(
      initialOrderId
    )

  const [
    phone,
    setPhone
  ] =
    useState('')

  const [
    loading,
    setLoading
  ] =
    useState(false)

  const [
    error,
    setError
  ] =
    useState('')

  const [
    order,
    setOrder
  ] =
    useState(null)

  useEffect(
    () => {
      const urlOrderId =
        normalizeOrderId(
          searchParams.get(
            'order'
          )
        )

      if (
        urlOrderId
      ) {
        setOrderId(
          urlOrderId
        )
      }
    },
    [
      searchParams
    ]
  )

  const normalizedPhone =
    phone.replace(
      /\D/g,
      ''
    )

  const formattedOrderNumber =
    order?.orderNumber ||
    (
      order?.id
        ? `CE-${String(
            order.id
          ).padStart(
            5,
            '0'
          )}`
        : ''
    )

  const currentStatus =
    order?.status ||
    'Pending'

  const currentStepIndex =
    useMemo(
      () =>
        TRACKING_STEPS.findIndex(
          (
            step
          ) =>
            step.key.toLowerCase() ===
            String(
              currentStatus
            ).toLowerCase()
        ),
      [
        currentStatus
      ]
    )

  const handleTrackOrder =
    async (
      event
    ) => {
      event.preventDefault()

      setError(
        ''
      )

      setOrder(
        null
      )

      const cleanOrderId =
        normalizeOrderId(
          orderId
        )

      if (
        !cleanOrderId
      ) {
        setError(
          'Please enter a valid order ID.'
        )

        return
      }

      if (
        !/^[6-9]\d{9}$/.test(
          normalizedPhone
        )
      ) {
        setError(
          'Please enter the 10-digit mobile number used during checkout.'
        )

        return
      }

      try {
        setLoading(
          true
        )

        const response =
          await fetch(
            `${API_URL}/api/track-order`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  orderId:
                    Number(
                      cleanOrderId
                    ),

                  phone:
                    normalizedPhone
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
            'Unable to find this order.'
          )
        }

        setOrder(
          data.order
        )
      } catch (
        err
      ) {
        console.error(
          'Track order error:',
          err
        )

        setError(
          err.message ||
          'Unable to track order.'
        )
      } finally {
        setLoading(
          false
        )
      }
    }

  const resetTracking =
    () => {
      setOrder(
        null
      )

      setError(
        ''
      )

      setPhone(
        ''
      )

      if (
        !initialOrderId
      ) {
        setOrderId(
          ''
        )
      }
    }

  return (
    <main className="ce-track-page">

      <section className="ce-track-hero">

        <div>

          <span className="ce-track-eyebrow">

            <Sparkles
              size={13}
            />

            Cordial Express Tracking

          </span>

          <h1>
            Track your
            <span>
              order journey.
            </span>
          </h1>

          <p>
            Enter your order ID and the
            mobile number used during
            checkout to see the latest
            delivery progress.
          </p>

        </div>

        <div className="ce-track-hero-card">

          <PackageSearch
            size={30}
          />

          <div>

            <strong>
              Live Order Status
            </strong>

            <span>
              Secure order lookup with
              mobile verification
            </span>

          </div>

        </div>

      </section>

      {!order && (

        <section className="ce-track-search-area">

          <div className="ce-track-search-card">

            <div className="ce-track-search-heading">

              <div className="ce-track-search-icon">

                <PackageSearch
                  size={21}
                />

              </div>

              <div>

                <span>
                  FIND YOUR ORDER
                </span>

                <h2>
                  Track your delivery
                </h2>

                <p>
                  Use the same mobile
                  number entered at
                  checkout.
                </p>

              </div>

            </div>

            {initialOrderId && (

              <div className="ce-track-prefilled">

                <CheckCircle2
                  size={15}
                />

                Order ID has been filled
                automatically from your
                recent order.

              </div>

            )}

            <form
              className="ce-track-form"
              onSubmit={
                handleTrackOrder
              }
            >

              <label>

                <span>
                  Order ID
                </span>

                <div className="ce-track-input">

                  <PackageSearch
                    size={17}
                  />

                  <input
                    type="text"
                    value={
                      orderId
                    }
                    onChange={
                      (
                        event
                      ) => {
                        const value =
                          event.target.value
                            .replace(
                              /[^0-9]/g,
                              ''
                            )

                        setOrderId(
                          value
                        )
                      }
                    }
                    inputMode="numeric"
                    placeholder="Example: 12"
                  />

                </div>

                <small>
                  You can enter the
                  numeric part of
                  CE-00012 as 12.
                </small>

              </label>

              <label>

                <span>
                  Mobile Number
                </span>

                <div className="ce-track-input">

                  <Search
                    size={17}
                  />

                  <input
                    type="tel"
                    value={
                      phone
                    }
                    onChange={
                      (
                        event
                      ) =>
                        setPhone(
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
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                  />

                </div>

              </label>

              {error && (

                <div className="ce-track-error">

                  <AlertCircle
                    size={17}
                  />

                  <span>
                    {error}
                  </span>

                </div>

              )}

              <button
                type="submit"
                className="ce-track-submit"
                disabled={
                  loading
                }
              >

                {loading ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="ce-spin"
                    />

                    Checking Order...
                  </>
                ) : (
                  <>
                    <PackageSearch
                      size={17}
                    />

                    Track Order

                    <ChevronRight
                      size={15}
                    />
                  </>
                )}

              </button>

            </form>

            <div className="ce-track-secure-note">

              <ShieldCheck
                size={15}
              />

              Your order information is
              protected using mobile
              verification.

            </div>

          </div>

        </section>

      )}

      {order && (

        <section className="ce-track-result">

          <div className="ce-track-result-header">

            <div>

              <span>
                ORDER FOUND
              </span>

              <h2>
                {
                  formattedOrderNumber
                }
              </h2>

              <p>
                Latest tracking
                information for your
                Cordial Express order.
              </p>

            </div>

            <span
              className={
                currentStatus ===
                'Cancelled'
                  ? 'ce-track-status cancelled'
                  : 'ce-track-status'
              }
            >
              {currentStatus}
            </span>

          </div>

          {currentStatus ===
          'Cancelled' ? (

            <div className="ce-track-cancelled">

              <AlertCircle
                size={28}
              />

              <div>

                <h3>
                  Order Cancelled
                </h3>

                <p>
                  This order has been
                  cancelled and will not
                  continue through the
                  normal delivery
                  process.
                </p>

              </div>

            </div>

          ) : (

            <div className="ce-track-timeline">

              {TRACKING_STEPS.map(
                (
                  step,
                  index
                ) => {
                  const Icon =
                    step.icon

                  const completed =
                    currentStatus ===
                      'Delivered' ||
                    (
                      currentStepIndex >=
                        0 &&
                      index <=
                        currentStepIndex
                    )

                  const active =
                    currentStepIndex ===
                    index

                  return (

                    <div
                      key={
                        step.key
                      }
                      className={
                        `ce-track-step ${
                          completed
                            ? 'completed'
                            : ''
                        } ${
                          active
                            ? 'active'
                            : ''
                        }`
                      }
                    >

                      <div className="ce-track-step-icon">

                        <Icon
                          size={18}
                        />

                      </div>

                      <span>
                        {step.label}
                      </span>

                      {index <
                        TRACKING_STEPS.length -
                          1 && (

                        <div className="ce-track-line" />

                      )}

                    </div>

                  )
                }
              )}

            </div>

          )}

          <div className="ce-track-info-grid">

            <div className="ce-track-info-card">

              <CalendarDays
                size={19}
              />

              <span>
                Order Placed
              </span>

              <strong>
                {
                  formatDate(
                    order.createdAt
                  )
                }
              </strong>

            </div>

            <div className="ce-track-info-card">

              <MapPin
                size={19}
              />

              <span>
                Delivery Area
              </span>

              <strong>
                {
                  [
                    order.city,
                    order.state,
                    order.pincode
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      ', '
                    ) ||
                  'Not available'
                }
              </strong>

            </div>

            <div className="ce-track-info-card">

              <CreditCard
                size={19}
              />

              <span>
                Payment
              </span>

              <strong>
                {
                  order.paymentMethod ||
                  'Cash on Delivery'
                }
              </strong>

            </div>

            <div className="ce-track-info-card">

              <RefreshCw
                size={19}
              />

              <span>
                Last Updated
              </span>

              <strong>
                {
                  formatDate(
                    order.updatedAt
                  )
                }
              </strong>

            </div>

          </div>

          <section className="ce-track-items-card">

            <div className="ce-track-items-heading">

              <div>

                <span>
                  ORDER CONTENTS
                </span>

                <h3>
                  Order Items
                </h3>

              </div>

              <ShoppingBag
                size={20}
              />

            </div>

            <div className="ce-track-items-list">

              {(
                order.items || []
              ).map(
                (
                  item
                ) => (

                  <div
                    className="ce-track-item-row"
                    key={
                      item.id ||
                      `${item.productName}-${item.quantity}`
                    }
                  >

                    <div>

                      <strong>
                        {
                          item.productName
                        }
                      </strong>

                      <span>
                        Qty:{' '}
                        {
                          item.quantity
                        }
                      </span>

                    </div>

                    <strong>
                      ₹{
                        (
                          Number(
                            item.price
                          ) *
                          Number(
                            item.quantity
                          )
                        ).toLocaleString(
                          'en-IN'
                        )
                      }
                    </strong>

                  </div>

                )
              )}

            </div>

            <div className="ce-track-summary-divider" />

            <div className="ce-track-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹{
                  Number(
                    order.subtotal ||
                    0
                  ).toLocaleString(
                    'en-IN'
                  )
                }
              </strong>

            </div>

            <div className="ce-track-summary-row">

              <span>
                Delivery
              </span>

              <strong>
                ₹{
                  Number(
                    order.deliveryCharge ||
                    0
                  ).toLocaleString(
                    'en-IN'
                  )
                }
              </strong>

            </div>

            <div className="ce-track-summary-divider" />

            <div className="ce-track-total-row">

              <span>
                Total
              </span>

              <strong>
                ₹{
                  Number(
                    order.total ||
                    0
                  ).toLocaleString(
                    'en-IN'
                  )
                }
              </strong>

            </div>

          </section>

          <div className="ce-track-actions">

            <button
              type="button"
              onClick={
                resetTracking
              }
            >

              <RefreshCw
                size={15}
              />

              Track Another Order

            </button>

            <Link
              to="/products"
            >

              <ShoppingBag
                size={15}
              />

              Continue Shopping

            </Link>

          </div>

        </section>

      )}

    </main>
  )
}