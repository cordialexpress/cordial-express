import {
  useEffect,
  useMemo,
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  PackagePlus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Package,
  Boxes,
  CircleCheckBig,
  TriangleAlert,
  X,
  Save,
  Plus,
  ArrowLeft,
  LogOut
} from 'lucide-react'

import {
  useAdminAuth
} from '../context/AdminAuthContext'

import './AdminProducts.css'

const API_URL =
  'import.meta.env.VITE_API_URL'

const categories = [
  'Spices & Masalas',
  'Dry Fruits',
  'Flours & Grains',
  'Snacks',
  'Beverages',
  'Daily Essentials'
]

const emptyForm = {
  name: '',
  category:
    'Spices & Masalas',
  price: '',
  oldPrice: '',
  stock: '',
  badge: '',
  description: '',
  imageUrl: '',
  isActive: true
}

export default function AdminProducts() {
  const navigate =
    useNavigate()

  const {
    token,
    admin,
    logout
  } = useAdminAuth()

  const [
    products,
    setProducts
  ] = useState([])

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    saving,
    setSaving
  ] = useState(false)

  const [
    error,
    setError
  ] = useState('')

  const [
    success,
    setSuccess
  ] = useState('')

  const [
    search,
    setSearch
  ] = useState('')

  const [
    categoryFilter,
    setCategoryFilter
  ] = useState('All')

  const [
    statusFilter,
    setStatusFilter
  ] = useState('All')

  const [
    showForm,
    setShowForm
  ] = useState(false)

  const [
    editingProduct,
    setEditingProduct
  ] = useState(null)

  const [
    form,
    setForm
  ] = useState(
    emptyForm
  )

  const authHeaders = {
    Authorization:
      `Bearer ${token}`
  }

  const handleUnauthorized =
    () => {
      logout()

      navigate(
        '/admin/login',
        {
          replace: true
        }
      )
    }

  const fetchProducts =
    async () => {
      try {
        setError('')

        const response =
          await fetch(
            `${API_URL}/api/admin/products`,
            {
              headers:
                authHeaders
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
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Unable to load products.'
          )
        }

        setProducts(
          data.products || []
        )
      } catch (err) {
        console.error(
          'Products error:',
          err
        )

        setError(
          err.message ||
            'Unable to load products.'
        )
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    if (!token) {
      handleUnauthorized()
      return
    }

    fetchProducts()
  }, [token])

  const filteredProducts =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase()

      return products.filter(
        (product) => {
          const matchesSearch =
            [
              product.id,
              product.name,
              product.category,
              product.badge
            ]
              .join(' ')
              .toLowerCase()
              .includes(
                searchValue
              )

          const matchesCategory =
            categoryFilter ===
              'All' ||
            product.category ===
              categoryFilter

          const matchesStatus =
            statusFilter ===
              'All' ||
            (statusFilter ===
              'Active' &&
              product.is_active ===
                1) ||
            (statusFilter ===
              'Inactive' &&
              product.is_active ===
                0) ||
            (statusFilter ===
              'Out of Stock' &&
              product.stock ===
                0)

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          )
        }
      )
    }, [
      products,
      search,
      categoryFilter,
      statusFilter
    ])

  const stats =
    useMemo(() => {
      return {
        total:
          products.length,

        active:
          products.filter(
            (product) =>
              product.is_active ===
              1
          ).length,

        outOfStock:
          products.filter(
            (product) =>
              product.stock ===
              0
          ).length,

        stockUnits:
          products.reduce(
            (
              total,
              product
            ) =>
              total +
              Number(
                product.stock
              ),
            0
          )
      }
    }, [products])

  const handleChange =
    (event) => {
      const {
        name,
        value,
        type,
        checked
      } = event.target

      setForm(
        (previous) => ({
          ...previous,

          [name]:
            type ===
            'checkbox'
              ? checked
              : value
        })
      )

      setError('')
      setSuccess('')
    }

  const openAddForm =
    () => {
      setEditingProduct(
        null
      )

      setForm(
        emptyForm
      )

      setShowForm(true)

      setError('')
      setSuccess('')
    }

  const openEditForm =
    (product) => {
      setEditingProduct(
        product
      )

      setForm({
        name:
          product.name || '',

        category:
          product.category ||
          categories[0],

        price:
          product.price ?? '',

        oldPrice:
          product.old_price ??
          '',

        stock:
          product.stock ?? '',

        badge:
          product.badge || '',

        description:
          product.description ||
          '',

        imageUrl:
          product.image_url ||
          '',

        isActive:
          product.is_active ===
          1
      })

      setShowForm(true)

      setError('')
      setSuccess('')
    }

  const closeForm = () => {
    if (saving) {
      return
    }

    setShowForm(false)

    setEditingProduct(
      null
    )

    setForm(
      emptyForm
    )
  }

  const validateForm = () => {
    if (!form.name.trim()) {
      return 'Product name is required.'
    }

    if (
      !form.category.trim()
    ) {
      return 'Category is required.'
    }

    if (
      form.price === '' ||
      Number(form.price) <
        0
    ) {
      return 'Enter a valid price.'
    }

    if (
      form.stock === '' ||
      Number(form.stock) <
        0
    ) {
      return 'Enter a valid stock quantity.'
    }

    if (
      form.oldPrice !== '' &&
      Number(
        form.oldPrice
      ) < 0
    ) {
      return 'Enter a valid old price.'
    }

    return ''
  }

  const handleSubmit =
    async (event) => {
      event.preventDefault()

      const validationError =
        validateForm()

      if (
        validationError
      ) {
        setError(
          validationError
        )
        return
      }

      try {
        setSaving(true)
        setError('')
        setSuccess('')

        const payload = {
          name:
            form.name.trim(),

          category:
            form.category,

          price:
            Number(
              form.price
            ),

          oldPrice:
            form.oldPrice ===
            ''
              ? null
              : Number(
                  form.oldPrice
                ),

          stock:
            Number(
              form.stock
            ),

          badge:
            form.badge.trim(),

          description:
            form.description.trim(),

          imageUrl:
            form.imageUrl.trim(),

          isActive:
            form.isActive
        }

        const isEditing =
          Boolean(
            editingProduct
          )

        const url =
          isEditing
            ? `${API_URL}/api/admin/products/${editingProduct.id}`
            : `${API_URL}/api/admin/products`

        const response =
          await fetch(
            url,
            {
              method:
                isEditing
                  ? 'PATCH'
                  : 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify(
                  payload
                )
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
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Unable to save product.'
          )
        }

        if (isEditing) {
          setProducts(
            (
              currentProducts
            ) =>
              currentProducts.map(
                (product) =>
                  product.id ===
                  editingProduct.id
                    ? data.product
                    : product
              )
          )

          setSuccess(
            'Product updated successfully.'
          )
        } else {
          setProducts(
            (
              currentProducts
            ) => [
              data.product,
              ...currentProducts
            ]
          )

          setSuccess(
            'Product added successfully.'
          )
        }

        setShowForm(false)

        setEditingProduct(
          null
        )

        setForm(
          emptyForm
        )
      } catch (err) {
        console.error(
          'Save product error:',
          err
        )

        setError(
          err.message ||
            'Unable to save product.'
        )
      } finally {
        setSaving(false)
      }
    }

  const deleteProduct =
    async (product) => {
      const confirmed =
        window.confirm(
          `Delete "${product.name}" permanently?`
        )

      if (!confirmed) {
        return
      }

      try {
        setError('')
        setSuccess('')

        const response =
          await fetch(
            `${API_URL}/api/admin/products/${product.id}`,
            {
              method:
                'DELETE',

              headers:
                authHeaders
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
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Unable to delete product.'
          )
        }

        setProducts(
          (
            currentProducts
          ) =>
            currentProducts.filter(
              (
                currentProduct
              ) =>
                currentProduct.id !==
                product.id
            )
        )

        setSuccess(
          `${product.name} deleted successfully.`
        )
      } catch (err) {
        setError(
          err.message ||
            'Unable to delete product.'
        )
      }
    }

  const toggleActive =
    async (product) => {
      try {
        const response =
          await fetch(
            `${API_URL}/api/admin/products/${product.id}`,
            {
              method:
                'PATCH',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify({
                  isActive:
                    product.is_active !==
                    1
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
          await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Unable to update product.'
          )
        }

        setProducts(
          (
            currentProducts
          ) =>
            currentProducts.map(
              (
                currentProduct
              ) =>
                currentProduct.id ===
                product.id
                  ? data.product
                  : currentProduct
            )
        )
      } catch (err) {
        setError(
          err.message ||
            'Unable to update product.'
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

  return (
    <main className="admin-products-page">
      <section className="admin-products-header">
        <div>
          <span className="admin-products-label">
            Cordial Express Admin
          </span>

          <h1>
            Product Management
          </h1>

          <p>
            Add products, update
            prices, control stock
            and manage availability.
          </p>

          {admin?.name && (
            <small>
              Logged in as{' '}
              <strong>
                {admin.name}
              </strong>
            </small>
          )}
        </div>

        <div className="admin-products-header-actions">
          <Link
            to="/admin/orders"
            className="admin-product-secondary-button"
          >
            <ArrowLeft
              size={16}
            />
            Orders
          </Link>

          <button
            type="button"
            className="admin-product-secondary-button"
            onClick={
              handleLogout
            }
          >
            <LogOut
              size={16}
            />
            Logout
          </button>

          <button
            type="button"
            className="admin-product-add-button"
            onClick={
              openAddForm
            }
          >
            <Plus
              size={17}
            />
            Add Product
          </button>
        </div>
      </section>

      <section className="admin-product-stats">
        <article>
          <div>
            <Package
              size={20}
            />
          </div>

          <span>
            Total Products
          </span>

          <strong>
            {stats.total}
          </strong>
        </article>

        <article>
          <div>
            <CircleCheckBig
              size={20}
            />
          </div>

          <span>
            Active
          </span>

          <strong>
            {stats.active}
          </strong>
        </article>

        <article>
          <div>
            <TriangleAlert
              size={20}
            />
          </div>

          <span>
            Out of Stock
          </span>

          <strong>
            {stats.outOfStock}
          </strong>
        </article>

        <article>
          <div>
            <Boxes
              size={20}
            />
          </div>

          <span>
            Stock Units
          </span>

          <strong>
            {stats.stockUnits}
          </strong>
        </article>
      </section>

      <section className="admin-product-content">
        <div className="admin-product-toolbar">
          <div className="admin-product-search">
            <Search
              size={17}
            />

            <input
              type="text"
              placeholder="Search products..."
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
            />
          </div>

          <select
            value={
              categoryFilter
            }
            onChange={(
              event
            ) =>
              setCategoryFilter(
                event.target
                  .value
              )
            }
          >
            <option value="All">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  value={
                    category
                  }
                  key={
                    category
                  }
                >
                  {category}
                </option>
              )
            )}
          </select>

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target
                  .value
              )
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

            <option value="Out of Stock">
              Out of Stock
            </option>
          </select>

          <button
            type="button"
            className="admin-product-refresh"
            onClick={() => {
              setLoading(true)
              fetchProducts()
            }}
          >
            <RefreshCw
              size={16}
            />
          </button>
        </div>

        {error && (
          <div className="admin-product-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-product-message success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="admin-product-empty">
            <RefreshCw
              size={28}
            />

            <p>
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length ===
          0 ? (
          <div className="admin-product-empty">
            <PackagePlus
              size={38}
            />

            <h3>
              No products found
            </h3>

            <p>
              Add a product or change
              your filters.
            </p>
          </div>
        ) : (
          <div className="admin-product-grid">
            {filteredProducts.map(
              (product) => (
                <article
                  className="admin-product-card"
                  key={
                    product.id
                  }
                >
                  <div className="admin-product-image">
                    {product.image_url ? (
                      <img
                        src={
                          product.image_url
                        }
                        alt={
                          product.name
                        }
                      />
                    ) : (
                      <div className="admin-product-placeholder">
                        <Package
                          size={34}
                        />
                      </div>
                    )}

                    {product.badge && (
                      <span className="admin-product-badge">
                        {
                          product.badge
                        }
                      </span>
                    )}
                  </div>

                  <div className="admin-product-card-body">
                    <div className="admin-product-card-top">
                      <span>
                        {
                          product.category
                        }
                      </span>

                      <span
                        className={
                          product.is_active ===
                          1
                            ? 'admin-product-active'
                            : 'admin-product-inactive'
                        }
                      >
                        {product.is_active ===
                        1
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </div>

                    <h3>
                      {
                        product.name
                      }
                    </h3>

                    <p>
                      {product.description ||
                        'No description added.'}
                    </p>

                    <div className="admin-product-price">
                      <strong>
                        ₹
                        {
                          product.price
                        }
                      </strong>

                      {product.old_price && (
                        <span>
                          ₹
                          {
                            product.old_price
                          }
                        </span>
                      )}
                    </div>

                    <div className="admin-product-stock">
                      <span>
                        Stock
                      </span>

                      <strong
                        className={
                          product.stock ===
                          0
                            ? 'out'
                            : ''
                        }
                      >
                        {product.stock ===
                        0
                          ? 'Out of Stock'
                          : `${product.stock} units`}
                      </strong>
                    </div>

                    <div className="admin-product-card-actions">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            product
                          )
                        }
                      >
                        <Pencil
                          size={15}
                        />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleActive(
                            product
                          )
                        }
                      >
                        <CircleCheckBig
                          size={15}
                        />

                        {product.is_active ===
                        1
                          ? 'Disable'
                          : 'Enable'}
                      </button>

                      <button
                        type="button"
                        className="delete"
                        onClick={() =>
                          deleteProduct(
                            product
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {showForm && (
        <div className="admin-product-modal-backdrop">
          <div className="admin-product-modal">
            <div className="admin-product-modal-header">
              <div>
                <span className="admin-products-label">
                  {editingProduct
                    ? 'Edit Product'
                    : 'New Product'}
                </span>

                <h2>
                  {editingProduct
                    ? editingProduct.name
                    : 'Add a Product'}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
              >
                <X
                  size={20}
                />
              </button>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >
              <div className="admin-product-form-grid">
                <div className="admin-product-field full">
                  <label>
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Example: Turmeric Powder"
                  />
                </div>

                <div className="admin-product-field">
                  <label>
                    Category *
                  </label>

                  <select
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleChange
                    }
                  >
                    {categories.map(
                      (
                        category
                      ) => (
                        <option
                          value={
                            category
                          }
                          key={
                            category
                          }
                        >
                          {
                            category
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="admin-product-field">
                  <label>
                    Badge
                  </label>

                  <input
                    type="text"
                    name="badge"
                    value={
                      form.badge
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Bestseller"
                  />
                </div>

                <div className="admin-product-field">
                  <label>
                    Selling Price ₹ *
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={
                      form.price
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="admin-product-field">
                  <label>
                    Old Price ₹
                  </label>

                  <input
                    type="number"
                    name="oldPrice"
                    min="0"
                    value={
                      form.oldPrice
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="admin-product-field">
                  <label>
                    Stock Quantity *
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={
                      form.stock
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="admin-product-field">
                  <label>
                    Product Image URL
                  </label>

                  <input
                    type="text"
                    name="imageUrl"
                    value={
                      form.imageUrl
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="admin-product-field full">
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    rows="4"
                    placeholder="Product description..."
                  />
                </div>

                <label className="admin-product-checkbox full">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={
                      form.isActive
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    Product is active
                    and visible to
                    customers
                  </span>
                </label>
              </div>

              {error && (
                <div className="admin-product-message error">
                  {error}
                </div>
              )}

              <div className="admin-product-modal-actions">
                <button
                  type="button"
                  className="admin-product-cancel-button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    saving
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-product-save-button"
                  disabled={
                    saving
                  }
                >
                  <Save
                    size={16}
                  />

                  {saving
                    ? 'Saving...'
                    : editingProduct
                      ? 'Save Changes'
                      : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}