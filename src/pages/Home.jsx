import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock3,
  Headphones,
  Heart,
  Leaf,
  LockKeyhole,
  Mail,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  Users,
  Zap
} from 'lucide-react'

import {
  Link
} from 'react-router-dom'

import {
  useCart
} from '../context/CartContext'

const API_URL =
  'import.meta.env.VITE_API_URL'

const categoryCards = [
  {
    name:
      'Spices & Masalas',

    image:
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=500&q=80'
  },
  {
    name:
      'Dry Fruits',

    image:
      'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=500&q=80'
  },
  {
    name:
      'Flours & Grains',

    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80'
  },
  {
    name:
      'Snacks',

    image:
      'https://images.unsplash.com/photo-1621939514649-280e2aa9454f?auto=format&fit=crop&w=500&q=80'
  },
  {
    name:
      'Beverages',

    image:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=80'
  },
  {
    name:
      'Daily Essentials',

    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'
  }
]

const reviews = [
  {
    name:
      'Priya Sharma',

    text:
      'Great quality products and a very smooth shopping experience. Everything arrived carefully packed.'
  },
  {
    name:
      'Rahul Verma',

    text:
      'The products feel fresh and premium. Cordial Express is becoming my go-to store for essentials.'
  },
  {
    name:
      'Anjali Mehta',

    text:
      'Simple ordering, good prices and excellent packaging. A very convenient way to shop.'
  }
]

function getFallbackImage(
  product
) {
  const category =
    String(
      product?.category || ''
    ).toLowerCase()

  const name =
    String(
      product?.name || ''
    ).toLowerCase()

  if (
    category.includes(
      'spice'
    ) ||
    name.includes(
      'turmeric'
    ) ||
    name.includes(
      'masala'
    ) ||
    name.includes(
      'chilli'
    )
  ) {
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=85'
  }

  if (
    category.includes(
      'dry'
    ) ||
    name.includes(
      'cashew'
    ) ||
    name.includes(
      'almond'
    )
  ) {
    return 'https://images.unsplash.com/photo-1600189020840-e9918c25269d?auto=format&fit=crop&w=600&q=85'
  }

  if (
    category.includes(
      'grain'
    ) ||
    name.includes(
      'atta'
    ) ||
    name.includes(
      'rice'
    )
  ) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=85'
  }

  if (
    category.includes(
      'beverage'
    ) ||
    name.includes(
      'coffee'
    ) ||
    name.includes(
      'tea'
    )
  ) {
    return 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=85'
  }

  if (
    category.includes(
      'snack'
    )
  ) {
    return 'https://images.unsplash.com/photo-1621939514649-280e2aa9454f?auto=format&fit=crop&w=600&q=85'
  }

  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=85'
}

function normalizeProduct(
  product
) {
  const price =
    Number(
      product?.price || 0
    )

  const oldPrice =
    Number(
      product?.old_price ??
      product?.oldPrice ??
      0
    )

  const stock =
    Number(
      product?.stock || 0
    )

  const image =
    product?.image_url ||
    product?.imageUrl ||
    product?.image ||
    getFallbackImage(
      product
    )

  return {
    ...product,

    id:
      Number(
        product.id
      ),

    name:
      product.name ||
      'Cordial Express Product',

    category:
      product.category ||
      'Daily Essentials',

    price,

    oldPrice,

    stock,

    image,

    badge:
      product.badge ||
      '',

    description:
      product.description ||
      '',

    isActive:
      Number(
        product.is_active ?? 1
      ) !== 0
  }
}

function getDiscount(
  product
) {
  if (
    !product.oldPrice ||
    product.oldPrice <=
      product.price
  ) {
    return ''
  }

  const discount =
    Math.round(
      (
        (
          product.oldPrice -
          product.price
        ) /
        product.oldPrice
      ) *
        100
    )

  return `${discount}% OFF`
}

export default function Home() {

  const {
    addToCart
  } =
    useCart()

  const [
    products,
    setProducts
  ] =
    useState([])

  const [
    loading,
    setLoading
  ] =
    useState(true)

  const [
    error,
    setError
  ] =
    useState('')

  const [
    cartMessage,
    setCartMessage
  ] =
    useState('')

  const [
    addedProductId,
    setAddedProductId
  ] =
    useState(null)

  const loadProducts =
    async () => {
      try {

        setLoading(true)

        setError('')

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
            'Unable to load products.'
          )
        }

        const normalized =
          Array.isArray(
            data.products
          )
            ? data.products.map(
                normalizeProduct
              )
            : []

        setProducts(
          normalized
        )

      } catch (
        fetchError
      ) {

        console.error(
          'Home products error:',
          fetchError
        )

        setError(
          'Products could not be loaded right now.'
        )

      } finally {

        setLoading(false)

      }
    }

  useEffect(
    () => {
      loadProducts()
    },
    []
  )

  const bestsellers =
    useMemo(
      () =>
        products
          .filter(
            (product) =>
              product.isActive
          )
          .slice(
            0,
            5
          ),
      [products]
    )

  const recommended =
    useMemo(
      () =>
        products
          .filter(
            (product) =>
              product.isActive
          )
          .slice(
            3,
            8
          ),
      [products]
    )

  const handleAddToCart =
    (
      product
    ) => {

      if (
        Number(
          product.stock
        ) <= 0
      ) {
        setCartMessage(
          `${product.name} is out of stock.`
        )

        return
      }

      const result =
        addToCart(
          product,
          1
        )

      setAddedProductId(
        product.id
      )

      setCartMessage(
        result?.message ||
        `${product.name} added to cart.`
      )

      window.setTimeout(
        () => {
          setAddedProductId(
            null
          )
        },
        1000
      )

      window.setTimeout(
        () => {
          setCartMessage('')
        },
        2600
      )
    }

  return (
    <main className="ce-home">

      {cartMessage && (

        <div className="ce-cart-toast">

          <ShoppingCart
            size={17}
          />

          <span>
            {cartMessage}
          </span>

        </div>

      )}

      {/* =========================
          HERO
      ========================= */}

      <section className="ce-hero">

        <div className="ce-hero-copy">

          <div className="ce-hero-eyebrow">

            <Sparkles
              size={14}
            />

            Fresh • Trusted • Everyday

          </div>

          <h1>

            Everyday essentials,

            <span>
              delivered with care.
            </span>

          </h1>

          <p>

            Quality grocery products,
            pantry staples, snacks and
            household essentials delivered
            conveniently to your doorstep.

          </p>

          <div className="ce-hero-actions">

            <Link
              to="/products"
              className="ce-primary-button"
            >
              Shop Now

              <ArrowRight
                size={17}
              />
            </Link>

            <a
              href="#categories"
              className="ce-outline-button"
            >
              Explore Categories
            </a>

          </div>

          <div className="ce-hero-features">

            <div>

              <BadgeCheck
                size={16}
              />

              Quality Checked

            </div>

            <div>

              <PackageCheck
                size={16}
              />

              Freshly Packed

            </div>

            <div>

              <Truck
                size={16}
              />

              Fast Delivery

            </div>

          </div>

        </div>

        <div className="ce-hero-visual">

          <div className="ce-hero-glow" />

          <img
            className="ce-hero-main-image"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=90"
            alt="Cordial Express grocery essentials"
          />

          <div className="ce-floating-card ce-floating-one">

            <Leaf
              size={17}
            />

            <div>

              <strong>
                Fresh Quality
              </strong>

              <span>
                Selected with care
              </span>

            </div>

          </div>

          <div className="ce-floating-card ce-floating-two">

            <Truck
              size={17}
            />

            <div>

              <strong>
                Fast Delivery
              </strong>

              <span>
                At your doorstep
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =========================
          CATEGORIES
      ========================= */}

      <section
        className="ce-section"
        id="categories"
      >

        <div className="ce-section-heading">

          <div>

            <span>
              Explore the store
            </span>

            <h2>
              Shop by Category
            </h2>

          </div>

          <Link to="/products">

            View All

            <ChevronRight
              size={16}
            />

          </Link>

        </div>

        <div className="ce-category-row">

          {categoryCards.map(
            (
              category
            ) => (

              <Link
                to={`/products?category=${encodeURIComponent(
                  category.name
                )}`}
                className="ce-category-card"
                key={category.name}
              >

                <div className="ce-category-image">

                  <img
                    src={
                      category.image
                    }
                    alt={
                      category.name
                    }
                  />

                </div>

                <h3>
                  {category.name}
                </h3>

                <span>
                  Explore products
                </span>

              </Link>

            )
          )}

        </div>

      </section>

      {/* =========================
          BESTSELLERS
      ========================= */}

      <section className="ce-section">

        <div className="ce-section-heading">

          <div>

            <span>
              Customer favourites
            </span>

            <h2>
              Bestsellers
            </h2>

          </div>

          <Link to="/products">

            View All

            <ChevronRight
              size={16}
            />

          </Link>

        </div>

        {loading ? (

          <div className="ce-home-status">

            <RefreshCw
              size={24}
              className="ce-spin"
            />

            <strong>
              Loading products...
            </strong>

          </div>

        ) : error ? (

          <div className="ce-home-status">

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadProducts
              }
            >
              Try Again
            </button>

          </div>

        ) : bestsellers.length ===
          0 ? (

          <div className="ce-home-status">

            <strong>
              No products available.
            </strong>

            <Link to="/products">
              Browse Store
            </Link>

          </div>

        ) : (

          <div className="ce-product-grid">

            {bestsellers.map(
              (
                product
              ) => {

                const discount =
                  getDiscount(
                    product
                  )

                const outOfStock =
                  Number(
                    product.stock
                  ) <= 0

                return (

                  <article
                    className="ce-product-card"
                    key={
                      product.id
                    }
                  >

                    <div className="ce-product-image">

                      {discount && (

                        <span className="ce-discount">
                          {discount}
                        </span>

                      )}

                      {product.badge && (

                        <span className="ce-home-product-badge">
                          {product.badge}
                        </span>

                      )}

                      <button
                        type="button"
                        className="ce-heart"
                        aria-label={`Save ${product.name}`}
                      >
                        <Heart
                          size={16}
                        />
                      </button>

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        onError={
                          (
                            event
                          ) => {
                            event.currentTarget.src =
                              getFallbackImage(
                                product
                              )
                          }
                        }
                      />

                      {outOfStock && (

                        <div className="ce-out-stock-overlay">

                          <span>
                            Out of Stock
                          </span>

                        </div>

                      )}

                    </div>

                    <div className="ce-product-body">

                      <span className="ce-product-category">
                        {
                          product.category
                        }
                      </span>

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      <div className="ce-rating">

                        <Star
                          size={13}
                          fill="currentColor"
                        />

                        4.8

                        <span>
                          (200+)
                        </span>

                      </div>

                      <div className="ce-stock-text">

                        {outOfStock
                          ? 'Currently unavailable'
                          : `${product.stock} in stock`}

                      </div>

                      <div className="ce-product-footer">

                        <div className="ce-product-price">

                          <strong>
                            ₹{
                              product.price
                            }
                          </strong>

                          {product.oldPrice >
                            product.price && (

                            <del>
                              ₹{
                                product.oldPrice
                              }
                            </del>

                          )}

                        </div>

                        <button
                          type="button"
                          className={
                            `ce-add-button ${
                              outOfStock
                                ? 'disabled'
                                : ''
                            }`
                          }
                          disabled={
                            outOfStock
                          }
                          onClick={
                            () =>
                              handleAddToCart(
                                product
                              )
                          }
                        >

                          {addedProductId ===
                          product.id
                            ? '✓ Added'
                            : (
                              <>
                                <span>
                                  +
                                </span>

                                Add
                              </>
                            )}

                        </button>

                      </div>

                    </div>

                  </article>

                )
              }
            )}

          </div>

        )}

      </section>

      {/* =========================
          DEAL OF THE DAY
      ========================= */}

      <section className="ce-deal">

        <div className="ce-deal-copy">

          <span>
            DEAL OF THE DAY
          </span>

          <h2>

            Save up to

            <strong>
              {' '}25%
            </strong>

          </h2>

          <p>
            on your daily essentials
          </p>

          <Link
            to="/products"
            className="ce-yellow-button"
          >

            Shop Deals

            <ArrowRight
              size={16}
            />

          </Link>

        </div>

        <div className="ce-countdown">

          <span>

            <Clock3
              size={15}
            />

            Deal Ends In

          </span>

          <div>

            <article>

              <strong>
                03
              </strong>

              <small>
                Hours
              </small>

            </article>

            <article>

              <strong>
                24
              </strong>

              <small>
                Mins
              </small>

            </article>

            <article>

              <strong>
                16
              </strong>

              <small>
                Secs
              </small>

            </article>

          </div>

        </div>

        <div className="ce-deal-image">

          <img
            src="https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=800&q=90"
            alt="Grocery deal"
          />

          <span>
            BEST
            <br />
            DEAL
          </span>

        </div>

      </section>

      {/* =========================
          TRUST
      ========================= */}

      <section className="ce-trust-strip">

        <div>

          <ShieldCheck
            size={26}
          />

          <div>

            <strong>
              Quality You Can Trust
            </strong>

            <span>
              Carefully selected products
            </span>

          </div>

        </div>

        <div>

          <PackageCheck
            size={26}
          />

          <div>

            <strong>
              Freshly Packed
            </strong>

            <span>
              Packed with care
            </span>

          </div>

        </div>

        <div>

          <Truck
            size={26}
          />

          <div>

            <strong>
              Fast & Safe Delivery
            </strong>

            <span>
              Doorstep convenience
            </span>

          </div>

        </div>

        <div>

          <LockKeyhole
            size={26}
          />

          <div>

            <strong>
              Secure Checkout
            </strong>

            <span>
              Protected transactions
            </span>

          </div>

        </div>

      </section>

      {/* =========================
          RECOMMENDED
      ========================= */}

      {recommended.length >
        0 && (

        <section className="ce-section">

          <div className="ce-section-heading">

            <div>

              <span>
                Curated for you
              </span>

              <h2>
                Recommended for You
              </h2>

            </div>

            <Link to="/products">

              View All

              <ChevronRight
                size={16}
              />

            </Link>

          </div>

          <div className="ce-recommend-grid">

            {recommended.map(
              (
                product
              ) => {

                const outOfStock =
                  Number(
                    product.stock
                  ) <= 0

                return (

                  <article
                    className="ce-recommend-card"
                    key={
                      product.id
                    }
                  >

                    <div>

                      {product.badge && (

                        <span className="ce-small-badge">
                          {
                            product.badge
                          }
                        </span>

                      )}

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        onError={
                          (
                            event
                          ) => {
                            event.currentTarget.src =
                              getFallbackImage(
                                product
                              )
                          }
                        }
                      />

                    </div>

                    <h3>
                      {
                        product.name
                      }
                    </h3>

                    <div>

                      <strong>
                        ₹{
                          product.price
                        }
                      </strong>

                      <button
                        type="button"
                        disabled={
                          outOfStock
                        }
                        onClick={
                          () =>
                            handleAddToCart(
                              product
                            )
                        }
                      >

                        {outOfStock
                          ? 'Sold Out'
                          : '+ Add'}

                      </button>

                    </div>

                  </article>

                )
              }
            )}

          </div>

        </section>

      )}

      {/* =========================
          REVIEWS
      ========================= */}

      <section className="ce-community">

        <div className="ce-reviews">

          <div className="ce-community-title">

            <Users
              size={18}
            />

            <h2>
              What our customers say
            </h2>

          </div>

          <div className="ce-review-grid">

            {reviews.map(
              (
                review
              ) => (

                <article
                  className="ce-review-card"
                  key={
                    review.name
                  }
                >

                  <div className="ce-stars">

                    {[
                      1,
                      2,
                      3,
                      4,
                      5
                    ].map(
                      (
                        star
                      ) => (

                        <Star
                          key={
                            star
                          }
                          size={14}
                          fill="currentColor"
                        />

                      )
                    )}

                  </div>

                  <p>
                    “{
                      review.text
                    }”
                  </p>

                  <div className="ce-review-user">

                    <div>

                      {review.name
                        .split(' ')
                        .map(
                          (
                            word
                          ) =>
                            word[0]
                        )
                        .join('')}

                    </div>

                    <strong>
                      {
                        review.name
                      }
                    </strong>

                  </div>

                </article>

              )
            )}

          </div>

        </div>

        {/* =========================
            NEWSLETTER
        ========================= */}

        <div className="ce-newsletter-card">

          <Mail
            size={28}
          />

          <span>
            EXCLUSIVE OFFERS
          </span>

          <h2>
            Get offers &
            new arrivals.
          </h2>

          <p>
            Subscribe to receive
            deals, product updates
            and new arrivals.
          </p>

          <form
            onSubmit={
              (
                event
              ) => {
                event.preventDefault()
              }
            }
          >

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

            <button
              type="submit"
            >
              Subscribe
            </button>

          </form>

          <Link
            to="/contact"
            className="ce-support-link"
          >

            <Headphones
              size={15}
            />

            Contact Customer Support

          </Link>

        </div>

      </section>

      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="ce-final-cta">

        <div>

          <span>

            <Zap
              size={15}
            />

            Start shopping today

          </span>

          <h2>
            Everything your home needs,
            in one place.
          </h2>

        </div>

        <Link
          to="/products"
          className="ce-final-button"
        >

          Explore Products

          <ArrowRight
            size={17}
          />

        </Link>

      </section>

    </main>
  )
}