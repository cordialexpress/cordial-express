import {
  useEffect,
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  UserRound,
  Package,
  Phone,
  LogOut,
  ShoppingBag,
  Smartphone
} from 'lucide-react'

import {
  useCustomerAuth
} from '../context/CustomerAuthContext'

const API_URL =
  'import.meta.env.VITE_API_URL'

export default function CustomerAccount() {
  const navigate =
    useNavigate()

  const {
    customer,
    customerToken,
    logoutCustomer
  } = useCustomerAuth()

  const [
    orders,
    setOrders
  ] = useState([])

  const [
    loading,
    setLoading
  ] = useState(true)

  const [
    error,
    setError
  ] = useState('')

  useEffect(() => {
    const loadOrders =
      async () => {
        try {
          setLoading(true)

          setError('')

          const response =
            await fetch(
              `${API_URL}/api/customer/orders`,
              {
                headers: {
                  Authorization:
                    `Bearer ${customerToken}`
                }
              }
            )

          const data =
            await response.json()

          if (
            response.status ===
            401
          ) {
            logoutCustomer()

            navigate(
              '/customer/login'
            )

            return
          }

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                'Unable to load orders'
            )
          }

          setOrders(
            data.orders || []
          )
        } catch (err) {
          setError(
            err.message ||
              'Unable to load orders'
          )
        } finally {
          setLoading(false)
        }
      }

    if (
      customerToken
    ) {
      loadOrders()
    }
  }, [
    customerToken
  ])

  const handleLogout =
    () => {
      logoutCustomer()

      navigate('/')
    }

  const displayPhone =
    customer?.formattedPhone ||
    (
      customer?.phone
        ? `+91 ${customer.phone}`
        : ''
    )

  return (
    <main className="customer-account-page">
      <section className="customer-account-header">
        <div className="customer-account-avatar">
          <UserRound
            size={30}
          />
        </div>

        <div>
          <span className="section-label">
            Customer Account
          </span>

          <h1>
            Welcome to
            Cordial Express
          </h1>

          <p>
            Your account is securely
            connected to your verified
            mobile number.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleLogout
          }
          className="customer-account-logout"
        >
          <LogOut
            size={16}
          />

          Logout
        </button>
      </section>

      <section className="customer-profile-card">
        <h2>
          My Account
        </h2>

        <div>
          <Smartphone
            size={17}
          />

          <span>
            Verified Mobile
          </span>
        </div>

        <div>
          <Phone
            size={17}
          />

          <strong>
            {displayPhone}
          </strong>
        </div>
      </section>

      <section className="customer-orders-section">
        <div className="customer-orders-title">
          <div>
            <span className="section-label">
              Purchase History
            </span>

            <h2>
              My Orders
            </h2>
          </div>

          <Package
            size={24}
          />
        </div>

        {error && (
          <div className="customer-auth-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="customer-orders-empty">
            Loading your
            orders...
          </div>
        ) : orders.length ===
          0 ? (
          <div className="customer-orders-empty">
            <ShoppingBag
              size={35}
            />

            <h3>
              No orders yet
            </h3>

            <p>
              Start shopping and your
              orders will appear here.
            </p>

            <Link
              to="/products"
              className="primary-button"
              style={{
                marginTop:
                  '18px'
              }}
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <div className="customer-order-list">
            {orders.map(
              (order) => (
                <article
                  key={
                    order.id
                  }
                  className="customer-order-card"
                >
                  <div>
                    <span>
                      Order
                    </span>

                    <strong>
                      CE-
                      {String(
                        order.id
                      ).padStart(
                        5,
                        '0'
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Status
                    </span>

                    <strong>
                      {order.status}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Total
                    </span>

                    <strong>
                      ₹
                      {Number(
                        order.total
                      ).toLocaleString(
                        'en-IN'
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Date
                    </span>

                    <strong>
                      {new Date(
                        order.created_at
                      ).toLocaleDateString(
                        'en-IN'
                      )}
                    </strong>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  )
}