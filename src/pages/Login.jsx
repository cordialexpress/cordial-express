import {
  Link
} from 'react-router-dom'

import {
  ArrowRight,
  Headphones,
  LockKeyhole,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserRound
} from 'lucide-react'

export default function Login() {
  return (
    <main className="ce-login-page">

      <section className="ce-login-hero">

        <div className="ce-login-heading">

          <span className="ce-login-eyebrow">

            <Sparkles
              size={13}
            />

            Cordial Express

          </span>

          <h1>
            Welcome to your
            <span>
              account portal.
            </span>
          </h1>

          <p>
            Shop without creating an
            account, track an existing
            order or access the secure
            administration portal.
          </p>

        </div>

        <div className="ce-login-security-card">

          <div className="ce-login-security-icon">

            <LockKeyhole
              size={25}
            />

          </div>

          <div>

            <span>
              SECURE ACCESS
            </span>

            <strong>
              Simple. Private. Convenient.
            </strong>

            <p>
              Customer OTP login is not
              required for shopping at
              this time.
            </p>

          </div>

        </div>

      </section>

      <section className="ce-login-shell">

        <div className="ce-login-intro">

          <div className="ce-login-intro-icon">

            <UserRound
              size={24}
            />

          </div>

          <div>

            <span>
              ACCOUNT & SUPPORT
            </span>

            <h2>
              What would you like to do?
            </h2>

            <p>
              Choose an option below to
              continue with Cordial Express.
            </p>

          </div>

        </div>

        <div className="ce-login-options">

          {/* SHOP */}

          <Link
            to="/products"
            className="ce-login-option"
          >

            <div className="ce-login-option-top">

              <div className="ce-login-option-icon">

                <ShoppingBag
                  size={25}
                />

              </div>

              <span>
                SHOPPING
              </span>

            </div>

            <h3>
              Continue as Guest
            </h3>

            <p>
              Browse products, add
              essentials to your cart
              and place an order without
              creating an account.
            </p>

            <strong>
              Start Shopping

              <ArrowRight
                size={15}
              />
            </strong>

          </Link>

          {/* TRACK */}

          <Link
            to="/track-order"
            className="ce-login-option"
          >

            <div className="ce-login-option-top">

              <div className="ce-login-option-icon">

                <PackageSearch
                  size={25}
                />

              </div>

              <span>
                YOUR ORDERS
              </span>

            </div>

            <h3>
              Track an Order
            </h3>

            <p>
              Use your order ID and the
              same mobile number entered
              during checkout to check
              your latest order status.
            </p>

            <strong>
              Track Order

              <ArrowRight
                size={15}
              />
            </strong>

          </Link>

          {/* SUPPORT */}

          <Link
            to="/contact"
            className="ce-login-option"
          >

            <div className="ce-login-option-top">

              <div className="ce-login-option-icon">

                <Headphones
                  size={25}
                />

              </div>

              <span>
                CUSTOMER CARE
              </span>

            </div>

            <h3>
              Get Support
            </h3>

            <p>
              Have a question about a
              product, delivery or order?
              Send an enquiry to the
              Cordial Express team.
            </p>

            <strong>
              Contact Support

              <ArrowRight
                size={15}
              />
            </strong>

          </Link>

        </div>

        {/* ADMIN */}

        <section className="ce-login-admin">

          <div className="ce-login-admin-icon">

            <ShieldCheck
              size={27}
            />

          </div>

          <div className="ce-login-admin-copy">

            <span>
              STAFF ACCESS
            </span>

            <h2>
              Cordial Express Administration
            </h2>

            <p>
              Secure staff access for
              managing store products,
              inventory, customer orders
              and enquiries.
            </p>

          </div>

          <Link
            to="/admin/login"
            className="ce-login-admin-button"
          >
            Admin Login

            <ArrowRight
              size={15}
            />
          </Link>

        </section>

        <div className="ce-login-security">

          <ShieldCheck
            size={15}
          />

          <span>
            Order tracking uses your
            order ID and checkout mobile
            number for verification.
          </span>

        </div>

      </section>

    </main>
  )
}