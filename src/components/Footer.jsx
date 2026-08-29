import {
  Mail,
  MapPin,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles
} from 'lucide-react'

import {
  Link
} from 'react-router-dom'

export default function Footer() {
  const currentYear =
    new Date().getFullYear()

  return (
    <footer className="ce-footer">

      <div className="ce-footer-main">

        <div className="ce-footer-brand">

          <Link
            to="/"
            className="ce-footer-logo"
          >

            <span>
              C
            </span>

            <div>

              <strong>
                Cordial Express
              </strong>

              <small>
                Everyday essentials
              </small>

            </div>

          </Link>

          <p>
            A simple and dependable way
            to discover everyday grocery
            products, place orders and
            track deliveries.
          </p>

          <div className="ce-footer-badge">

            <Sparkles
              size={14}
            />

            Everyday essentials,
            delivered with care.

          </div>

        </div>

        <div className="ce-footer-column">

          <h3>
            Shop
          </h3>

          <Link
            to="/products"
          >
            All Products
          </Link>

          <Link
            to="/products?category=Spices%20%26%20Masalas"
          >
            Spices & Masalas
          </Link>

          <Link
            to="/products?category=Dry%20Fruits"
          >
            Dry Fruits
          </Link>

          <Link
            to="/products?category=Beverages"
          >
            Beverages
          </Link>

          <Link
            to="/products?category=Daily%20Essentials"
          >
            Daily Essentials
          </Link>

        </div>

        <div className="ce-footer-column">

          <h3>
            Company
          </h3>

          <Link
            to="/about"
          >
            About Us
          </Link>

          <Link
            to="/contact"
          >
            Contact
          </Link>

          <Link
            to="/products"
          >
            Store
          </Link>

          <Link
            to="/track-order"
          >
            Track Order
          </Link>

        </div>

        <div className="ce-footer-column">

          <h3>
            Customer Care
          </h3>

          <Link
            to="/cart"
          >
            Your Cart
          </Link>

          <Link
            to="/checkout"
          >
            Checkout
          </Link>

          <Link
            to="/track-order"
          >
            Order Tracking
          </Link>

          <Link
            to="/contact"
          >
            Help & Support
          </Link>

        </div>

        <div className="ce-footer-contact">

          <h3>
            Get in touch
          </h3>

          <div>

            <Mail
              size={16}
            />

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

          <div>

            <PackageSearch
              size={16}
            />

            <div>

              <span>
                Track an order
              </span>

              <Link
                to="/track-order"
              >
                Open tracking
              </Link>

            </div>

          </div>

          <div>

            <MapPin
              size={16}
            />

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

      </div>

      <div className="ce-footer-trust">

        <div>

          <ShieldCheck
            size={16}
          />

          <span>
            Secure checkout
          </span>

        </div>

        <div>

          <ShoppingBag
            size={16}
          />

          <span>
            Quality everyday products
          </span>

        </div>

        <div>

          <PackageSearch
            size={16}
          />

          <span>
            Order tracking
          </span>

        </div>

      </div>

      <div className="ce-footer-bottom">

        <span>
          © {currentYear} Cordial Express.
          All rights reserved.
        </span>

        <div>

          <Link
            to="/about"
          >
            About
          </Link>

          <Link
            to="/contact"
          >
            Support
          </Link>

          <Link
            to="/track-order"
          >
            Track Order
          </Link>

        </div>

      </div>

    </footer>
  )
}