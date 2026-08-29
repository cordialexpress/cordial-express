import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Search,
  Minus,
  Plus,
  ShoppingCart,
  Package,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

import {
  useCart
} from '../context/CartContext'

const API_URL =
  'import.meta.env.VITE_API_URL'

export default function Products() {
  const {
    addToCart
  } = useCart()

  const [
    products,
    setProducts
  ] = useState([])

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
    selectedCategory,
    setSelectedCategory
  ] = useState('All')

  const [
    quantities,
    setQuantities
  ] = useState({})

  const [
    addedProduct,
    setAddedProduct
  ] = useState(null)

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
              'Unable to load products'
          )
        }

        const normalizedProducts =
          (
            data.products || []
          ).map(
            (product) => ({
              id: product.id,

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

              isActive:
                product.is_active ===
                  undefined ||
                Number(
                  product.is_active
                ) === 1
            })
          )

        setProducts(
          normalizedProducts
        )
      } catch (err) {
        console.error(
          'Products error:',
          err
        )

        setError(
          err.message ||
            'Unable to load products'
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadProducts()
  }, [])

  const categories =
    useMemo(() => {
      const uniqueCategories =
        [
          ...new Set(
            products
              .map(
                (product) =>
                  product.category
              )
              .filter(Boolean)
          )
        ]

      return [
        'All',
        ...uniqueCategories
      ]
    }, [products])

  const filteredProducts =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase()

      return products.filter(
        (product) => {
          const matchesCategory =
            selectedCategory ===
              'All' ||
            product.category ===
              selectedCategory

          const matchesSearch =
            !query ||
            product.name
              .toLowerCase()
              .includes(query) ||
            product.category
              .toLowerCase()
              .includes(query) ||
            product.description
              .toLowerCase()
              .includes(query)

          return (
            matchesCategory &&
            matchesSearch
          )
        }
      )
    }, [
      products,
      search,
      selectedCategory
    ])

  const getQuantity = (
    productId
  ) => {
    return (
      quantities[
        productId
      ] || 1
    )
  }

  const increaseQuantity = (
    product
  ) => {
    const currentQuantity =
      getQuantity(
        product.id
      )

    if (
      currentQuantity >=
      product.stock
    ) {
      return
    }

    setQuantities(
      (current) => ({
        ...current,

        [product.id]:
          currentQuantity +
          1
      })
    )
  }

  const decreaseQuantity = (
    productId
  ) => {
    const currentQuantity =
      getQuantity(
        productId
      )

    if (
      currentQuantity <= 1
    ) {
      return
    }

    setQuantities(
      (current) => ({
        ...current,

        [productId]:
          currentQuantity -
          1
      })
    )
  }

  const handleAddToCart = (
    product
  ) => {
    if (
      product.stock <= 0
    ) {
      return
    }

    const quantity =
      Math.min(
        getQuantity(
          product.id
        ),
        product.stock
      )

    addToCart(
      product,
      quantity
    )

    setAddedProduct(
      product.id
    )

    setTimeout(() => {
      setAddedProduct(
        null
      )
    }, 1400)
  }

  return (
    <main className="products-page">
      <section className="products-hero">
        <div className="products-hero-content">
          <span className="section-label">
            Cordial Express Store
          </span>

          <h1>
            Everyday essentials,
            carefully selected.
          </h1>

          <p>
            Discover quality pantry
            staples, snacks,
            beverages and everyday
            essentials packed with
            care.
          </p>
        </div>

        <div className="products-hero-badge">
          <Package
            size={22}
          />

          <div>
            <strong>
              Quality Products
            </strong>

            <span>
              Freshly packed
            </span>
          </div>
        </div>
      </section>

      <section className="products-toolbar">
        <div className="products-search">
          <Search
            size={18}
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search products..."
          />
        </div>

        <button
          type="button"
          className="products-refresh-button"
          onClick={
            loadProducts
          }
        >
          <RefreshCw
            size={16}
          />

          Refresh
        </button>
      </section>

      {!loading &&
        !error &&
        categories.length >
          1 && (
          <section className="products-category-list">
            {categories.map(
              (category) => (
                <button
                  type="button"
                  key={
                    category
                  }
                  className={
                    selectedCategory ===
                    category
                      ? 'product-category-button active'
                      : 'product-category-button'
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category
                    )
                  }
                >
                  {category}
                </button>
              )
            )}
          </section>
        )}

      {loading && (
        <section className="products-state">
          <RefreshCw
            size={30}
          />

          <h2>
            Loading products...
          </h2>

          <p>
            Getting the latest
            products from Cordial
            Express.
          </p>
        </section>
      )}

      {!loading &&
        error && (
          <section className="products-state products-error-state">
            <AlertCircle
              size={32}
            />

            <h2>
              Unable to load
              products
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={
                loadProducts
              }
            >
              Try Again
            </button>
          </section>
        )}

      {!loading &&
        !error &&
        filteredProducts.length ===
          0 && (
          <section className="products-state">
            <Package
              size={32}
            />

            <h2>
              No products found
            </h2>

            <p>
              Try another search
              or category.
            </p>
          </section>
        )}

      {!loading &&
        !error &&
        filteredProducts.length >
          0 && (
          <section className="products-grid">
            {filteredProducts.map(
              (product) => {
                const quantity =
                  getQuantity(
                    product.id
                  )

                const outOfStock =
                  product.stock <=
                  0

                const discount =
                  product.oldPrice &&
                  product.oldPrice >
                    product.price
                    ? Math.round(
                        (
                          (
                            product.oldPrice -
                            product.price
                          ) /
                          product.oldPrice
                        ) *
                          100
                      )
                    : 0

                return (
                  <article
                    className="product-card"
                    key={
                      product.id
                    }
                  >
                    <div className="product-image-box">
                      {product.badge && (
                        <span className="product-badge">
                          {
                            product.badge
                          }
                        </span>
                      )}

                      {discount >
                        0 && (
                        <span className="product-discount">
                          {
                            discount
                          }
                          % OFF
                        </span>
                      )}

                      {product.image ? (
                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          className="product-image"
                          onError={(
                            event
                          ) => {
                            event.currentTarget.style.display =
                              'none'

                            event.currentTarget.nextElementSibling.style.display =
                              'flex'
                          }}
                        />
                      ) : null}

                      <div
                        className="product-placeholder"
                        style={{
                          display:
                            product.image
                              ? 'none'
                              : 'flex'
                        }}
                      >
                        <Package
                          size={42}
                        />
                      </div>

                      {outOfStock && (
                        <div className="product-out-of-stock">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    <div className="product-content">
                      <span className="product-category">
                        {
                          product.category
                        }
                      </span>

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      {product.description && (
                        <p className="product-description">
                          {
                            product.description
                          }
                        </p>
                      )}

                      <div className="product-price-row">
                        <strong>
                          ₹
                          {product.price.toLocaleString(
                            'en-IN'
                          )}
                        </strong>

                        {product.oldPrice &&
                          product.oldPrice >
                            product.price && (
                            <span>
                              ₹
                              {product.oldPrice.toLocaleString(
                                'en-IN'
                              )}
                            </span>
                          )}
                      </div>

                      <div className="product-stock-row">
                        {outOfStock ? (
                          <span className="stock-empty">
                            Currently
                            unavailable
                          </span>
                        ) : product.stock <=
                          5 ? (
                          <span className="stock-low">
                            Only{' '}
                            {
                              product.stock
                            }{' '}
                            left
                          </span>
                        ) : (
                          <span className="stock-available">
                            In stock
                          </span>
                        )}
                      </div>

                      {!outOfStock && (
                        <div className="product-quantity-row">
                          <span>
                            Quantity
                          </span>

                          <div className="product-quantity-control">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  product.id
                                )
                              }
                              disabled={
                                quantity <=
                                1
                              }
                            >
                              <Minus
                                size={
                                  15
                                }
                              />
                            </button>

                            <strong>
                              {
                                quantity
                              }
                            </strong>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  product
                                )
                              }
                              disabled={
                                quantity >=
                                product.stock
                              }
                            >
                              <Plus
                                size={
                                  15
                                }
                              />
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={
                          outOfStock
                        }
                        className={
                          addedProduct ===
                          product.id
                            ? 'product-add-button added'
                            : 'product-add-button'
                        }
                        onClick={() =>
                          handleAddToCart(
                            product
                          )
                        }
                      >
                        <ShoppingCart
                          size={17}
                        />

                        {outOfStock
                          ? 'Out of Stock'
                          : addedProduct ===
                              product.id
                            ? 'Added to Cart'
                            : 'Add to Cart'}
                      </button>
                    </div>
                  </article>
                )
              }
            )}
          </section>
        )}
    </main>
  )
}