import {
  useMemo,
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  AlertCircle,
  ArrowLeft,
  BadgeIndianRupee,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Landmark,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  WalletCards
} from 'lucide-react'

import {
  useCart
} from '../context/CartContext'

const API_URL =
  'import.meta.env.VITE_API_URL'

function getFallbackImage(item) {
  const category =
    String(
      item?.category || ''
    ).toLowerCase()

  const name =
    String(
      item?.name || ''
    ).toLowerCase()

  if (
    category.includes('spice') ||
    name.includes('turmeric') ||
    name.includes('masala') ||
    name.includes('chilli')
  ) {
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=85'
  }

  if (
    category.includes('dry') ||
    name.includes('cashew')
  ) {
    return 'https://images.unsplash.com/photo-1600189020840-e9918c25269d?auto=format&fit=crop&w=400&q=85'
  }

  if (
    category.includes('grain') ||
    name.includes('atta') ||
    name.includes('rice')
  ) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=85'
  }

  if (
    category.includes('beverage') ||
    name.includes('coffee')
  ) {
    return 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=85'
  }

  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=85'
}

export default function Checkout() {
  const navigate =
    useNavigate()

  const {
    cart,
    cartSubtotal,
    clearCart
  } =
    useCart()

  const [
    form,
    setForm
  ] =
    useState({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      paymentMethod:
        'Cash on Delivery'
    })

  const [
    errors,
    setErrors
  ] =
    useState({})

  const [
    submitError,
    setSubmitError
  ] =
    useState('')

  const [
    isSubmitting,
    setIsSubmitting
  ] =
    useState(false)

  const estimatedDeliveryCharge =
    useMemo(
      () =>
        cartSubtotal >= 499
          ? 0
          : 49,
      [
        cartSubtotal
      ]
    )

  const estimatedTotal =
    cartSubtotal +
    estimatedDeliveryCharge

  const totalItems =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item
          ) =>
            total +
            Number(
              item.quantity || 0
            ),
          0
        ),
      [
        cart
      ]
    )

  const totalSavings =
    useMemo(
      () =>
        cart.reduce(
          (
            total,
            item
          ) => {
            const oldPrice =
              Number(
                item.oldPrice || 0
              )

            const price =
              Number(
                item.price || 0
              )

            const quantity =
              Number(
                item.quantity || 0
              )

            if (
              oldPrice >
              price
            ) {
              return (
                total +
                (
                  oldPrice -
                  price
                ) *
                  quantity
              )
            }

            return total
          },
          0
        ),
      [
        cart
      ]
    )

  const handleChange =
    (
      event
    ) => {
      const {
        name,
        value
      } =
        event.target

      let nextValue =
        value

      if (
        name ===
        'phone'
      ) {
        nextValue =
          value
            .replace(
              /\D/g,
              ''
            )
            .slice(
              0,
              10
            )
      }

      if (
        name ===
        'pincode'
      ) {
        nextValue =
          value
            .replace(
              /\D/g,
              ''
            )
            .slice(
              0,
              6
            )
      }

      setForm(
        (
          current
        ) => ({
          ...current,
          [name]:
            nextValue
        })
      )

      setErrors(
        (
          current
        ) => ({
          ...current,
          [name]: ''
        })
      )

      setSubmitError('')
    }

  const validateForm =
    () => {
      const newErrors =
        {}

      if (
        !form.name.trim()
      ) {
        newErrors.name =
          'Please enter your full name.'
      }

      const cleanPhone =
        form.phone.replace(
          /\D/g,
          ''
        )

      if (
        !/^[6-9]\d{9}$/.test(
          cleanPhone
        )
      ) {
        newErrors.phone =
          'Enter a valid 10-digit Indian mobile number.'
      }

      if (
        form.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email.trim()
        )
      ) {
        newErrors.email =
          'Enter a valid email address.'
      }

      if (
        !form.address.trim()
      ) {
        newErrors.address =
          'Please enter your delivery address.'
      }

      if (
        !form.city.trim()
      ) {
        newErrors.city =
          'Please enter your city.'
      }

      if (
        !form.state.trim()
      ) {
        newErrors.state =
          'Please enter your state.'
      }

      if (
        !/^\d{6}$/.test(
          form.pincode.replace(
            /\D/g,
            ''
          )
        )
      ) {
        newErrors.pincode =
          'Enter a valid 6-digit PIN code.'
      }

      setErrors(
        newErrors
      )

      return (
        Object.keys(
          newErrors
        ).length ===
        0
      )
    }

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault()

      if (
        isSubmitting
      ) {
        return
      }

      if (
        cart.length ===
        0
      ) {
        setSubmitError(
          'Your cart is empty.'
        )

        return
      }

      if (
        !validateForm()
      ) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })

        return
      }

      try {
        setIsSubmitting(
          true
        )

        setSubmitError(
          ''
        )

        const cleanPhone =
          form.phone.replace(
            /\D/g,
            ''
          )

        const cleanPincode =
          form.pincode.replace(
            /\D/g,
            ''
          )

        const response =
          await fetch(
            `${API_URL}/api/orders`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  customer: {
                    name:
                      form.name.trim(),

                    phone:
                      cleanPhone,

                    email:
                      form.email.trim(),

                    address:
                      form.address.trim(),

                    city:
                      form.city.trim(),

                    state:
                      form.state.trim(),

                    pincode:
                      cleanPincode
                  },

                  items:
                    cart.map(
                      (
                        item
                      ) => ({
                        id:
                          item.id,

                        name:
                          item.name,

                        quantity:
                          item.quantity
                      })
                    ),

                  paymentMethod:
                    form.paymentMethod
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
            'Unable to place your order.'
          )
        }

        const placedOrder =
          data.order

        sessionStorage.setItem(
          'cordialLastOrder',
          JSON.stringify(
            placedOrder
          )
        )

        clearCart()

        navigate(
          '/checkout-success',
          {
            state: {
              order:
                placedOrder
            }
          }
        )
      } catch (
        error
      ) {
        console.error(
          'Checkout error:',
          error
        )

        if (
          error instanceof
            TypeError &&
          error.message
            .toLowerCase()
            .includes(
              'fetch'
            )
        ) {
          setSubmitError(
            'Unable to connect to the Cordial Express server. Make sure the backend is running.'
          )
        } else {
          setSubmitError(
            error.message ||
            'Unable to place your order.'
          )
        }

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      } finally {
        setIsSubmitting(
          false
        )
      }
    }

  if (
    cart.length ===
    0
  ) {
    return (
      <main className="ce-checkout-page">

        <section className="ce-checkout-empty">

          <div>
            <ShoppingBag
              size={34}
            />
          </div>

          <span>
            SECURE CHECKOUT
          </span>

          <h1>
            Your cart is empty.
          </h1>

          <p>
            Add some Cordial Express
            products before proceeding
            to checkout.
          </p>

          <Link
            to="/products"
          >
            Browse Products

            <ChevronRight
              size={16}
            />
          </Link>

        </section>

      </main>
    )
  }

  return (
    <main className="ce-checkout-page">

      {/* HERO */}

      <section className="ce-checkout-hero">

        <div>

          <Link
            to="/cart"
            className="ce-checkout-back"
          >
            <ArrowLeft
              size={16}
            />

            Back to Cart
          </Link>

          <span className="ce-checkout-eyebrow">

            <LockKeyhole
              size={13}
            />

            Secure Checkout

          </span>

          <h1>
            Complete your
            <span>
              order securely.
            </span>
          </h1>

          <p>
            Enter your delivery
            information, choose your
            payment method and review
            your order before placing it.
          </p>

        </div>

        <div className="ce-checkout-hero-status">

          <ShieldCheck
            size={28}
          />

          <div>
            <strong>
              Protected Checkout
            </strong>

            <span>
              Server-verified pricing
              and stock
            </span>
          </div>

        </div>

      </section>

      {/* CHECKOUT STEPS */}

      <section className="ce-checkout-steps">

        <div className="active">
          <span>1</span>

          <div>
            <strong>
              Details
            </strong>

            <small>
              Contact information
            </small>
          </div>
        </div>

        <div className="active">
          <span>2</span>

          <div>
            <strong>
              Delivery
            </strong>

            <small>
              Shipping address
            </small>
          </div>
        </div>

        <div className="active">
          <span>3</span>

          <div>
            <strong>
              Payment
            </strong>

            <small>
              Choose payment
            </small>
          </div>
        </div>

        <div>
          <span>4</span>

          <div>
            <strong>
              Confirmation
            </strong>

            <small>
              Place your order
            </small>
          </div>
        </div>

      </section>

      {/* ERROR */}

      {submitError && (

        <div className="ce-checkout-error">

          <AlertCircle
            size={20}
          />

          <div>

            <strong>
              Order could not be placed
            </strong>

            <span>
              {submitError}
            </span>

          </div>

        </div>

      )}

      <div className="ce-checkout-layout">

        {/* FORM */}

        <form
          id="checkout-form"
          className="ce-checkout-form"
          onSubmit={
            handleSubmit
          }
        >

          {/* CONTACT */}

          <section className="ce-checkout-card">

            <div className="ce-checkout-card-heading">

              <div className="ce-checkout-card-icon">

                <User
                  size={19}
                />

              </div>

              <div>

                <span>
                  STEP 01
                </span>

                <h2>
                  Contact Details
                </h2>

                <p>
                  We'll use these
                  details for your
                  order updates.
                </p>

              </div>

            </div>

            <div className="ce-checkout-fields">

              <label className="ce-checkout-field">

                <span>
                  Full Name *
                </span>

                <div
                  className={
                    errors.name
                      ? 'ce-checkout-input error'
                      : 'ce-checkout-input'
                  }
                >
                  <User
                    size={16}
                  />

                  <input
                    type="text"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                  />

                </div>

                {errors.name && (
                  <small>
                    {
                      errors.name
                    }
                  </small>
                )}

              </label>

              <label className="ce-checkout-field">

                <span>
                  Mobile Number *
                </span>

                <div
                  className={
                    errors.phone
                      ? 'ce-checkout-input error'
                      : 'ce-checkout-input'
                  }
                >
                  <Phone
                    size={16}
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="9876543210"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                  />

                </div>

                {errors.phone && (
                  <small>
                    {
                      errors.phone
                    }
                  </small>
                )}

              </label>

              <label className="ce-checkout-field ce-full-field">

                <span>
                  Email Address
                  <em>
                    Optional
                  </em>
                </span>

                <div
                  className={
                    errors.email
                      ? 'ce-checkout-input error'
                      : 'ce-checkout-input'
                  }
                >
                  <Mail
                    size={16}
                  />

                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="yourname@example.com"
                    autoComplete="email"
                  />

                </div>

                {errors.email && (
                  <small>
                    {
                      errors.email
                    }
                  </small>
                )}

              </label>

            </div>

          </section>

          {/* ADDRESS */}

          <section className="ce-checkout-card">

            <div className="ce-checkout-card-heading">

              <div className="ce-checkout-card-icon">

                <MapPin
                  size={19}
                />

              </div>

              <div>

                <span>
                  STEP 02
                </span>

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Tell us where your
                  order should be
                  delivered.
                </p>

              </div>

            </div>

            <div className="ce-checkout-fields">

              <label className="ce-checkout-field ce-full-field">

                <span>
                  Complete Address *
                </span>

                <div
                  className={
                    errors.address
                      ? 'ce-checkout-input ce-textarea-input error'
                      : 'ce-checkout-input ce-textarea-input'
                  }
                >
                  <MapPin
                    size={16}
                  />

                  <textarea
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House / Flat, Street, Area, Landmark"
                    rows={4}
                    autoComplete="street-address"
                  />

                </div>

                {errors.address && (
                  <small>
                    {
                      errors.address
                    }
                  </small>
                )}

              </label>

              <label className="ce-checkout-field">

                <span>
                  City *
                </span>

                <div
                  className={
                    errors.city
                      ? 'ce-checkout-input error'
                      : 'ce-checkout-input'
                  }
                >

                  <Building2
                    size={16}
                  />

                  <input
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                    autoComplete="address-level2"
                  />

                </div>

                {errors.city && (
                  <small>
                    {
                      errors.city
                    }
                  </small>
                )}

              </label>

              <label className="ce-checkout-field">

                <span>
                  State *
                </span>

                <div
                  className={
                    errors.state
                      ? 'ce-checkout-input error'
                      : 'ce-checkout-input'
                  }
                >

                  <Landmark
                    size={16}
                  />

                  <input
                    type="text"
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                    autoComplete="address-level1"
                  />

                </div>

                {errors.state && (
                  <small>
                    {
                      errors.state
                    }
                  </small>
                )}

              </label>

              <label className="ce-checkout-field">

                <span>
                  PIN Code *
                </span>

                <div
                  className={
                    errors.pincode
                      ? 'ce-checkout-input error'
                      : 'ce-checkout-input'
                  }
                >

                  <MapPin
                    size={16}
                  />

                  <input
                    type="text"
                    name="pincode"
                    value={
                      form.pincode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="110001"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                  />

                </div>

                {errors.pincode && (
                  <small>
                    {
                      errors.pincode
                    }
                  </small>
                )}

              </label>

            </div>

          </section>

          {/* PAYMENT */}

          <section className="ce-checkout-card">

            <div className="ce-checkout-card-heading">

              <div className="ce-checkout-card-icon">

                <WalletCards
                  size={19}
                />

              </div>

              <div>

                <span>
                  STEP 03
                </span>

                <h2>
                  Payment Method
                </h2>

                <p>
                  Choose how you'd
                  like to pay for
                  this order.
                </p>

              </div>

            </div>

            <div className="ce-payment-grid">

              <label
                className={
                  form.paymentMethod ===
                  'Cash on Delivery'
                    ? 'ce-payment-option active'
                    : 'ce-payment-option'
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={
                    form.paymentMethod ===
                    'Cash on Delivery'
                  }
                  onChange={
                    handleChange
                  }
                />

                <div className="ce-payment-icon">

                  <CircleDollarSign
                    size={22}
                  />

                </div>

                <div className="ce-payment-copy">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order
                    arrives.
                  </span>

                </div>

                <div className="ce-payment-check">

                  {form.paymentMethod ===
                    'Cash on Delivery' && (

                    <Check
                      size={14}
                    />

                  )}

                </div>

              </label>

              <label
                className={
                  form.paymentMethod ===
                  'Online Payment'
                    ? 'ce-payment-option active'
                    : 'ce-payment-option'
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online Payment"
                  checked={
                    form.paymentMethod ===
                    'Online Payment'
                  }
                  onChange={
                    handleChange
                  }
                />

                <div className="ce-payment-icon">

                  <CreditCard
                    size={22}
                  />

                </div>

                <div className="ce-payment-copy">

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    Payment gateway will
                    be enabled later.
                  </span>

                </div>

                <div className="ce-payment-check">

                  {form.paymentMethod ===
                    'Online Payment' && (

                    <Check
                      size={14}
                    />

                  )}

                </div>

              </label>

            </div>

            {form.paymentMethod ===
              'Online Payment' && (

              <div className="ce-online-payment-note">

                <AlertCircle
                  size={16}
                />

                Online payment is currently
                a placeholder option. The
                payment gateway will be
                connected in a later step.

              </div>

            )}

          </section>

          {/* MOBILE SUBMIT */}

          <button
            type="submit"
            className="ce-checkout-mobile-submit"
            disabled={
              isSubmitting
            }
          >

            {isSubmitting ? (
              <>
                <Loader2
                  size={18}
                  className="ce-spin"
                />

                Placing Order...
              </>
            ) : (
              <>
                Place Order

                <ChevronRight
                  size={17}
                />
              </>
            )}

          </button>

        </form>

        {/* SUMMARY */}

        <aside className="ce-checkout-summary">

          <section className="ce-checkout-summary-card">

            <div className="ce-checkout-summary-title">

              <div>

                <span>
                  ORDER SUMMARY
                </span>

                <h2>
                  Review order
                </h2>

              </div>

              <ShoppingBag
                size={22}
              />

            </div>

            <div className="ce-checkout-summary-items">

              {cart.map(
                (
                  item
                ) => (

                  <div
                    className="ce-checkout-summary-item"
                    key={
                      item.id
                    }
                  >

                    <div className="ce-checkout-item-image">

                      <img
                        src={
                          item.image ||
                          getFallbackImage(
                            item
                          )
                        }
                        alt={
                          item.name
                        }
                        onError={
                          (
                            event
                          ) => {
                            event.currentTarget.src =
                              getFallbackImage(
                                item
                              )
                          }
                        }
                      />

                      <span>
                        {
                          item.quantity
                        }
                      </span>

                    </div>

                    <div className="ce-checkout-item-copy">

                      <strong>
                        {
                          item.name
                        }
                      </strong>

                      <span>
                        Qty {
                          item.quantity
                        }
                      </span>

                    </div>

                    <strong className="ce-checkout-item-total">
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

            <div className="ce-checkout-summary-divider" />

            <div className="ce-checkout-summary-row">

              <span>
                Items ({totalItems})
              </span>

              <strong>
                ₹{
                  cartSubtotal.toLocaleString(
                    'en-IN'
                  )
                }
              </strong>

            </div>

            <div className="ce-checkout-summary-row">

              <span>
                Delivery
              </span>

              <strong
                className={
                  estimatedDeliveryCharge ===
                  0
                    ? 'free'
                    : ''
                }
              >
                {estimatedDeliveryCharge ===
                0
                  ? 'FREE'
                  : `₹${estimatedDeliveryCharge}`}
              </strong>

            </div>

            {totalSavings >
              0 && (

              <div className="ce-checkout-summary-row saving">

                <span>
                  Product Savings
                </span>

                <strong>
                  ₹{
                    totalSavings.toLocaleString(
                      'en-IN'
                    )
                  }
                </strong>

              </div>

            )}

            <div className="ce-checkout-summary-divider" />

            <div className="ce-checkout-grand-total">

              <div>

                <span>
                  Estimated Total
                </span>

                <small>
                  Server verified before confirmation
                </small>

              </div>

              <strong>
                ₹{
                  estimatedTotal.toLocaleString(
                    'en-IN'
                  )
                }
              </strong>

            </div>

            <button
              type="submit"
              form="checkout-form"
              className="ce-checkout-submit"
              disabled={
                isSubmitting
              }
            >

              {isSubmitting ? (
                <>
                  <Loader2
                    size={17}
                    className="ce-spin"
                  />

                  Placing Order...
                </>
              ) : (
                <>
                  Place Order

                  <ChevronRight
                    size={16}
                  />
                </>
              )}

            </button>

            <div className="ce-checkout-secure">

              <LockKeyhole
                size={13}
              />

              Secure order processing
            </div>

            <div className="ce-checkout-trust">

              <div>
                <ShieldCheck
                  size={16}
                />

                <span>
                  Server-verified pricing
                </span>
              </div>

              <div>
                <Truck
                  size={16}
                />

                <span>
                  Free delivery on ₹499+
                </span>
              </div>

              <div>
                <PackageCheck
                  size={16}
                />

                <span>
                  Live inventory validation
                </span>
              </div>

              <div>
                <BadgeIndianRupee
                  size={16}
                />

                <span>
                  No hidden checkout fees
                </span>
              </div>

            </div>

          </section>

          <div className="ce-checkout-help-card">

            <Sparkles
              size={18}
            />

            <div>

              <strong>
                Almost there!
              </strong>

              <span>
                Review your details carefully
                before placing the order.
              </span>

            </div>

          </div>

        </aside>

      </div>

    </main>
  )
}