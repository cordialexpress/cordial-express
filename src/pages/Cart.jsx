import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Link
} from 'react-router-dom'

import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Gift,
  Minus,
  PackageCheck,
  PackageX,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck
} from 'lucide-react'

import {
  useCart
} from '../context/CartContext'

import './Cart.css'

const API_URL =
  'import.meta.env.VITE_API_URL'

function getFallbackImage(
  item
) {
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
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=85'
  }

  if (
    category.includes('dry') ||
    name.includes('cashew')
  ) {
    return 'https://images.unsplash.com/photo-1600189020840-e9918c25269d?auto=format&fit=crop&w=500&q=85'
  }

  if (
    category.includes('grain') ||
    name.includes('atta') ||
    name.includes('rice')
  ) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=85'
  }

  if (
    category.includes('beverage') ||
    name.includes('coffee')
  ) {
    return 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=500&q=85'
  }

  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=85'
}

export default function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartSubtotal,
    syncCartProducts
  } =
    useCart()

  const [
    isSyncing,
    setIsSyncing
  ] =
    useState(true)

  const [
    syncError,
    setSyncError
  ] =
    useState('')

  const [
    cartNotice,
    setCartNotice
  ] =
    useState('')

  const deliveryCharge =
    cartSubtotal >= 499
      ? 0
      : cart.length > 0
        ? 49
        : 0

  const total =
    cartSubtotal +
    deliveryCharge

  const amountForFreeDelivery =
    Math.max(
      0,
      499 - cartSubtotal
    )

  const freeDeliveryProgress =
    Math.min(
      100,
      (
        cartSubtotal /
        499
      ) *
        100
    )

  const totalSavings =
    useMemo(
      () =>
        cart.reduce(
          (
            totalValue,
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
                totalValue +
                (
                  oldPrice -
                  price
                ) *
                  quantity
              )
            }

            return totalValue
          },
          0
        ),
      [
        cart
      ]
    )

  const itemCount =
    useMemo(
      () =>
        cart.reduce(
          (
            totalValue,
            item
          ) =>
            totalValue +
            Number(
              item.quantity || 0
            ),
          0
        ),
      [
        cart
      ]
    )

  const hasInvalidItems =
    useMemo(
      () =>
        cart.some(
          (
            item
          ) =>
            item.unavailable ||
            Number(
              item.stock
            ) <= 0
        ),
      [
        cart
      ]
    )

  const syncCart =
    async () => {
      try {
        setIsSyncing(
          true
        )

        setSyncError(
          ''
        )

        const response =
          await fetch(
            `${API_URL}/api/products`
          )

        const data =
          await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            'Unable to refresh cart.'
          )
        }

        const products =
          Array.isArray(
            data.products
          )
            ? data.products.map(
                (
                  product
                ) => ({
                  id:
                    product.id,

                  name:
                    product.name,

                  category:
                    product.category,

                  price:
                    Number(
                      product.price
                    ),

                  oldPrice:
                    product.old_price
                      ? Number(
                          product.old_price
                        )
                      : null,

                  stock:
                    Number(
                      product.stock ||
                      0
                    ),

                  badge:
                    product.badge ||
                    '',

                  description:
                    product.description ||
                    '',

                  image:
                    product.image_url ||
                    '',

                  is_active:
                    Number(
                      product.is_active
                    )
                })
              )
            : []

        syncCartProducts(
          products
        )

        setCartNotice(
          'Cart inventory refreshed.'
        )

        window.setTimeout(
          () => {
            setCartNotice(
              ''
            )
          },
          2200
        )
      } catch (
        error
      ) {
        console.error(
          'Cart sync error:',
          error
        )

        setSyncError(
          error.message ||
          'Unable to refresh cart inventory.'
        )
      } finally {
        setIsSyncing(
          false
        )
      }
    }

  useEffect(
    () => {
      syncCart()
    },
    []
  )

  const handleIncrease =
    (
      productId
    ) => {
      const result =
        increaseQuantity(
          productId
        )

      if (
        result &&
        result.success ===
          false
      ) {
        setCartNotice(
          result.message
        )

        window.setTimeout(
          () => {
            setCartNotice(
              ''
            )
          },
          2500
        )
      }
    }

  if (
    cart.length === 0
  ) {
    return (
      <main className="ce-cart-page">

        <section className="ce-cart-empty">

          <div className="ce-cart-empty-icon">

            <ShoppingBag
              size={34}
            />

          </div>

          <span>
            YOUR CART
          </span>

          <h1>
            Your cart is empty.
          </h1>

          <p>
            Discover quality everyday
            essentials and add your
            favourites to get started.
          </p>

          <Link
            to="/products"
            className="ce-cart-shop-button"
          >
            Explore Products

            <ChevronRight
              size={16}
            />
          </Link>

        </section>

      </main>
    )
  }

  return (
    <main className="ce-cart-page">

      {/* HERO */}

      <section className="ce-cart-hero">

        <div>

          <Link
            to="/products"
            className="ce-cart-back"
          >

            <ArrowLeft
              size={16}
            />

            Continue Shopping

          </Link>

          <span className="ce-cart-eyebrow">

            <Sparkles
              size={13}
            />

            Your Cart

          </span>

          <h1>
            Review your
            <span>
              shopping cart.
            </span>
          </h1>

          <p>
            Prices and stock are
            refreshed from our live
            inventory before checkout.
          </p>

        </div>

        <div className="ce-cart-hero-info">

          <ShoppingBag
            size={25}
          />

          <div>

            <strong>
              {itemCount}
            </strong>

            <span>
              {itemCount === 1
                ? 'item in cart'
                : 'items in cart'}
            </span>

          </div>

        </div>

      </section>

      {/* NOTICES */}

      {cartNotice && (

        <div className="ce-cart-notice">

          <CheckCircle2
            size={17}
          />

          {cartNotice}

        </div>

      )}

      {syncError && (

        <div className="ce-cart-warning">

          <AlertTriangle
            size={20}
          />

          <div>

            <strong>
              Inventory refresh failed
            </strong>

            <span>
              {syncError}
            </span>

          </div>

          <button
            type="button"
            onClick={
              syncCart
            }
          >

            <RefreshCw
              size={15}
            />

            Retry

          </button>

        </div>

      )}

      {hasInvalidItems && (

        <div className="ce-cart-warning danger">

          <PackageX
            size={20}
          />

          <div>

            <strong>
              Your cart needs attention
            </strong>

            <span>
              Remove unavailable items
              before checkout.
            </span>

          </div>

        </div>

      )}

      {/* FREE DELIVERY */}

      <section className="ce-cart-delivery-progress">

        <div className="ce-cart-delivery-top">

          <div>

            <Truck
              size={19}
            />

            {amountForFreeDelivery >
              0 ? (

              <span>
                Add{' '}
                <strong>
                  ₹{
                    amountForFreeDelivery.toLocaleString(
                      'en-IN'
                    )
                  }
                </strong>{' '}
                more for free delivery
              </span>

            ) : (

              <span>
                <strong>
                  You've unlocked free delivery!
                </strong>
              </span>

            )}

          </div>

          <span>
            ₹499 threshold
          </span>

        </div>

        <div className="ce-cart-progress-track">

          <div
            className="ce-cart-progress-fill"
            style={{
              width:
                `${freeDeliveryProgress}%`
            }}
          />

        </div>

      </section>

      {/* CART LAYOUT */}

      <div className="ce-cart-layout">

        {/* LEFT */}

        <section className="ce-cart-items-panel">

          <div className="ce-cart-panel-header">

            <div>

              <h2>
                Cart Items
              </h2>

              <span>
                {cart.length}{' '}
                {cart.length === 1
                  ? 'product'
                  : 'products'}
              </span>

            </div>

            <button
              type="button"
              className="ce-cart-refresh"
              onClick={
                syncCart
              }
              disabled={
                isSyncing
              }
            >

              <RefreshCw
                size={15}
                className={
                  isSyncing
                    ? 'ce-spin'
                    : ''
                }
              />

              {isSyncing
                ? 'Refreshing'
                : 'Refresh Stock'}

            </button>

          </div>

          <div className="ce-cart-list">

            {cart.map(
              (
                item
              ) => {
                const stock =
                  Number(
                    item.stock
                  )

                const unavailable =
                  item.unavailable ||
                  stock <= 0

                const atStockLimit =
                  Number(
                    item.quantity
                  ) >=
                  stock

                const lineTotal =
                  Number(
                    item.price
                  ) *
                  Number(
                    item.quantity
                  )

                return (

                  <article
                    key={
                      item.id
                    }
                    className={
                      unavailable
                        ? 'ce-cart-item unavailable'
                        : 'ce-cart-item'
                    }
                  >

                    <div className="ce-cart-item-image">

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

                      {item.badge && (

                        <span>
                          {
                            item.badge
                          }
                        </span>

                      )}

                    </div>

                    <div className="ce-cart-item-content">

                      <span className="ce-cart-category">
                        {
                          item.category
                        }
                      </span>

                      <h3>
                        {
                          item.name
                        }
                      </h3>

                      <div className="ce-cart-price">

                        <strong>
                          ₹{
                            Number(
                              item.price
                            ).toLocaleString(
                              'en-IN'
                            )
                          }
                        </strong>

                        {item.oldPrice &&
                          Number(
                            item.oldPrice
                          ) >
                            Number(
                              item.price
                            ) && (

                          <del>
                            ₹{
                              Number(
                                item.oldPrice
                              ).toLocaleString(
                                'en-IN'
                              )
                            }
                          </del>

                        )}

                      </div>

                      {unavailable ? (

                        <div className="ce-cart-stock danger">

                          <PackageX
                            size={13}
                          />

                          Currently unavailable

                        </div>

                      ) : stock <=
                        5 ? (

                        <div className="ce-cart-stock low">
                          Only {stock} left
                        </div>

                      ) : (

                        <div className="ce-cart-stock">

                          <BadgeCheck
                            size={13}
                          />

                          In stock

                        </div>

                      )}

                    </div>

                    <div className="ce-cart-item-controls">

                      <div className="ce-cart-quantity">

                        <button
                          type="button"
                          onClick={
                            () =>
                              decreaseQuantity(
                                item.id
                              )
                          }
                          disabled={
                            unavailable ||
                            Number(
                              item.quantity
                            ) <= 1
                          }
                        >

                          <Minus
                            size={14}
                          />

                        </button>

                        <strong>
                          {
                            item.quantity
                          }
                        </strong>

                        <button
                          type="button"
                          onClick={
                            () =>
                              handleIncrease(
                                item.id
                              )
                          }
                          disabled={
                            unavailable ||
                            atStockLimit
                          }
                        >

                          <Plus
                            size={14}
                          />

                        </button>

                      </div>

                      <div className="ce-cart-line-total">

                        <span>
                          Item Total
                        </span>

                        <strong>
                          ₹{
                            lineTotal.toLocaleString(
                              'en-IN'
                            )
                          }
                        </strong>

                      </div>

                      <button
                        type="button"
                        className="ce-cart-remove"
                        onClick={
                          () =>
                            removeFromCart(
                              item.id
                            )
                        }
                      >

                        <Trash2
                          size={15}
                        />

                        Remove

                      </button>

                    </div>

                  </article>

                )
              }
            )}

          </div>

          <div className="ce-cart-bottom-actions">

            <Link
              to="/products"
            >

              <ArrowLeft
                size={15}
              />

              Continue Shopping

            </Link>

            <button
              type="button"
              onClick={
                clearCart
              }
            >

              <Trash2
                size={15}
              />

              Clear Cart

            </button>

          </div>

        </section>

        {/* RIGHT SUMMARY */}

        <aside className="ce-cart-summary">

          <div className="ce-cart-summary-card">

            <div className="ce-cart-summary-heading">

              <div>

                <span>
                  ORDER SUMMARY
                </span>

                <h2>
                  Your total
                </h2>

              </div>

              <ShoppingBag
                size={22}
              />

            </div>

            <div className="ce-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹{
                  cartSubtotal.toLocaleString(
                    'en-IN'
                  )
                }
              </strong>

            </div>

            <div className="ce-summary-row">

              <span>
                Delivery
              </span>

              <strong
                className={
                  deliveryCharge ===
                  0
                    ? 'free'
                    : ''
                }
              >

                {deliveryCharge ===
                0
                  ? 'FREE'
                  : `₹${deliveryCharge}`}

              </strong>

            </div>

            {totalSavings >
              0 && (

              <div className="ce-summary-row saving">

                <span>
                  Your Savings
                </span>

                <strong>
                  -₹{
                    totalSavings.toLocaleString(
                      'en-IN'
                    )
                  }
                </strong>

              </div>

            )}

            <div className="ce-summary-divider" />

            <div className="ce-summary-total">

              <div>

                <span>
                  Total
                </span>

                <small>
                  Inclusive of delivery
                </small>

              </div>

              <strong>
                ₹{
                  total.toLocaleString(
                    'en-IN'
                  )
                }
              </strong>

            </div>

            {hasInvalidItems ? (

              <button
                type="button"
                className="ce-cart-checkout disabled"
                disabled
              >
                Remove Unavailable Items
              </button>

            ) : (

              <Link
                to="/checkout"
                className="ce-cart-checkout"
              >

                Proceed to Checkout

                <ChevronRight
                  size={16}
                />

              </Link>

            )}

            <p className="ce-cart-server-note">
              Final price and stock are
              verified again by the server
              before your order is placed.
            </p>

            <div className="ce-cart-benefit-list">

              <div>

                <ShieldCheck
                  size={17}
                />

                <span>
                  Secure checkout
                </span>

              </div>

              <div>

                <Truck
                  size={17}
                />

                <span>
                  Free delivery on ₹499+
                </span>

              </div>

              <div>

                <PackageCheck
                  size={17}
                />

                <span>
                  Quality checked products
                </span>

              </div>

            </div>

          </div>

          <div className="ce-cart-offer-card">

            <Gift
              size={21}
            />

            <div>

              <strong>
                More value with every order
              </strong>

              <span>
                Explore more essentials and
                unlock free delivery.
              </span>

            </div>

          </div>

        </aside>

      </div>

    </main>
  )
}