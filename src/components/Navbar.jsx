import {
  useEffect,
  useState
} from 'react'

import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'

import {
  ChevronDown,
  CircleUserRound,
  Home,
  Info,
  Mail,
  MapPin,
  Menu,
  PackageSearch,
  Search,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  X
} from 'lucide-react'

import {
  useCart
} from '../context/CartContext'

export default function Navbar() {
  const {
    cartCount,
    cartSubtotal
  } =
    useCart()

  const location =
    useLocation()

  const navigate =
    useNavigate()

  const [
    mobileMenuOpen,
    setMobileMenuOpen
  ] =
    useState(false)

  const [
    searchTerm,
    setSearchTerm
  ] =
    useState('')

  const [
    categoryOpen,
    setCategoryOpen
  ] =
    useState(false)

  const closeMobileMenu =
    () => {
      setMobileMenuOpen(false)
      setCategoryOpen(false)
    }

  useEffect(
    () => {
      setMobileMenuOpen(false)
      setCategoryOpen(false)
    },
    [
      location.pathname
    ]
  )

  useEffect(
    () => {
      if (
        !mobileMenuOpen
      ) {
        return undefined
      }

      const handleEscape =
        (
          event
        ) => {
          if (
            event.key ===
            'Escape'
          ) {
            setMobileMenuOpen(
              false
            )

            setCategoryOpen(
              false
            )
          }
        }

      document.addEventListener(
        'keydown',
        handleEscape
      )

      return () => {
        document.removeEventListener(
          'keydown',
          handleEscape
        )
      }
    },
    [
      mobileMenuOpen
    ]
  )

  const handleSearch =
    (
      event
    ) => {
      event.preventDefault()

      const cleanSearch =
        searchTerm.trim()

      if (
        cleanSearch
      ) {
        navigate(
          `/products?search=${encodeURIComponent(
            cleanSearch
          )}`
        )

        return
      }

      navigate(
        '/products'
      )
    }

  const goToCategory =
    (
      category
    ) => {
      setCategoryOpen(false)

      navigate(
        `/products?category=${encodeURIComponent(
          category
        )}`
      )
    }

  return (
    <>
      {/* =========================
          PREMIUM TOPBAR
      ========================= */}

      <div className="ce-nav-topbar">

        <div className="ce-nav-topbar-inner">

          <div className="ce-nav-delivery">

            <MapPin
              size={13}
            />

            <span>
              Delivering across selected locations
            </span>

          </div>

          <div className="ce-nav-topbar-message">
            Free delivery on orders above ₹499
            <span>
              •
            </span>
            Freshly packed
            <span>
              •
            </span>
            Quality checked
          </div>

          <Link
            to="/track-order"
            className="ce-top-track-link"
          >
            <PackageSearch
              size={13}
            />

            Track Order
          </Link>

        </div>

      </div>

      {/* =========================
          MAIN NAVBAR
      ========================= */}

      <header className="ce-navbar">

        <div className="ce-navbar-main">

          {/* BRAND */}

          <Link
            to="/"
            className="ce-navbar-brand"
            onClick={
              closeMobileMenu
            }
          >

            <div className="ce-navbar-logo">
              C
            </div>

            <div>

              <strong>
                Cordial Express
              </strong>

              <span>
                Everyday essentials
              </span>

            </div>

          </Link>

          {/* SEARCH */}

          <form
            className="ce-navbar-search"
            onSubmit={
              handleSearch
            }
          >

            <Search
              size={18}
            />

            <input
              type="search"
              placeholder="Search for atta, masala, coffee, snacks..."
              value={
                searchTerm
              }
              onChange={
                (
                  event
                ) =>
                  setSearchTerm(
                    event.target.value
                  )
              }
            />

            <button
              type="submit"
            >
              Search
            </button>

          </form>

          {/* ACTIONS */}

          <div className="ce-navbar-actions">

            <Link
              to="/login"
              className="ce-account-action"
              onClick={
                closeMobileMenu
              }
            >

              <CircleUserRound
                size={21}
              />

              <div>

                <span>
                  Hello,
                </span>

                <strong>
                  Account
                </strong>

              </div>

            </Link>

            <Link
              to="/cart"
              className="ce-cart-action"
              onClick={
                closeMobileMenu
              }
              aria-label={`Cart with ${cartCount} items`}
            >

              <div className="ce-cart-icon-wrap">

                <ShoppingCart
                  size={21}
                />

                {cartCount >
                  0 && (

                  <span className="ce-cart-badge">
                    {cartCount}
                  </span>

                )}

              </div>

              <div>

                <span>
                  My Cart
                </span>

                <strong>
                  ₹{Number(
                    cartSubtotal || 0
                  ).toLocaleString(
                    'en-IN'
                  )}
                </strong>

              </div>

            </Link>

            <button
              type="button"
              className="ce-mobile-menu-button"
              aria-label={
                mobileMenuOpen
                  ? 'Close menu'
                  : 'Open menu'
              }
              aria-expanded={
                mobileMenuOpen
              }
              onClick={
                () =>
                  setMobileMenuOpen(
                    (
                      current
                    ) =>
                      !current
                  )
              }
            >

              {mobileMenuOpen ? (
                <X
                  size={22}
                />
              ) : (
                <Menu
                  size={22}
                />
              )}

            </button>

          </div>

        </div>

        {/* =========================
            DESKTOP MENU
        ========================= */}

        <div className="ce-navbar-bottom">

          <div className="ce-navbar-bottom-inner">

            <div className="ce-category-dropdown-wrap">

              <button
                type="button"
                className="ce-category-menu-button"
                onClick={
                  () =>
                    setCategoryOpen(
                      (
                        current
                      ) =>
                        !current
                    )
                }
              >

                <ShoppingBag
                  size={16}
                />

                Categories

                <ChevronDown
                  size={15}
                  className={
                    categoryOpen
                      ? 'rotate'
                      : ''
                  }
                />

              </button>

              {categoryOpen && (

                <div className="ce-category-dropdown">

                  <button
                    type="button"
                    onClick={
                      () =>
                        goToCategory(
                          'Spices & Masalas'
                        )
                    }
                  >
                    Spices & Masalas
                  </button>

                  <button
                    type="button"
                    onClick={
                      () =>
                        goToCategory(
                          'Dry Fruits'
                        )
                    }
                  >
                    Dry Fruits
                  </button>

                  <button
                    type="button"
                    onClick={
                      () =>
                        goToCategory(
                          'Flours & Grains'
                        )
                    }
                  >
                    Flours & Grains
                  </button>

                  <button
                    type="button"
                    onClick={
                      () =>
                        goToCategory(
                          'Snacks'
                        )
                    }
                  >
                    Snacks
                  </button>

                  <button
                    type="button"
                    onClick={
                      () =>
                        goToCategory(
                          'Beverages'
                        )
                    }
                  >
                    Beverages
                  </button>

                  <button
                    type="button"
                    onClick={
                      () =>
                        goToCategory(
                          'Daily Essentials'
                        )
                    }
                  >
                    Daily Essentials
                  </button>

                </div>

              )}

            </div>

            <nav className="ce-desktop-links">

              <Link
                to="/"
                className={
                  location.pathname ===
                  '/'
                    ? 'active'
                    : ''
                }
              >
                Home
              </Link>

              <Link
                to="/products"
                className={
                  location.pathname ===
                  '/products'
                    ? 'active'
                    : ''
                }
              >
                Products
              </Link>

              <Link
                to="/about"
                className={
                  location.pathname ===
                  '/about'
                    ? 'active'
                    : ''
                }
              >
                About
              </Link>

              <Link
                to="/contact"
                className={
                  location.pathname ===
                  '/contact'
                    ? 'active'
                    : ''
                }
              >
                Contact
              </Link>

              <Link
                to="/track-order"
                className={
                  location.pathname ===
                  '/track-order'
                    ? 'active'
                    : ''
                }
              >
                Track Order
              </Link>

            </nav>

            <div className="ce-nav-promise">
              Secure checkout • Easy ordering
            </div>

          </div>

        </div>

        {/* =========================
            MOBILE MENU
        ========================= */}

        {mobileMenuOpen && (

          <nav
            className="ce-mobile-menu"
            aria-label="Mobile navigation"
          >

            <form
              className="ce-mobile-search"
              onSubmit={
                handleSearch
              }
            >

              <Search
                size={17}
              />

              <input
                type="search"
                placeholder="Search products..."
                value={
                  searchTerm
                }
                onChange={
                  (
                    event
                  ) =>
                    setSearchTerm(
                      event.target.value
                    )
                }
              />

              <button
                type="submit"
              >
                Go
              </button>

            </form>

            <Link
              to="/"
              onClick={
                closeMobileMenu
              }
            >
              <Home
                size={18}
              />
              Home
            </Link>

            <Link
              to="/products"
              onClick={
                closeMobileMenu
              }
            >
              <Store
                size={18}
              />
              Products
            </Link>

            <Link
              to="/about"
              onClick={
                closeMobileMenu
              }
            >
              <Info
                size={18}
              />
              About
            </Link>

            <Link
              to="/contact"
              onClick={
                closeMobileMenu
              }
            >
              <Mail
                size={18}
              />
              Contact
            </Link>

            <Link
              to="/track-order"
              onClick={
                closeMobileMenu
              }
            >
              <PackageSearch
                size={18}
              />
              Track Order
            </Link>

            <div className="ce-mobile-divider" />

            <Link
              to="/login"
              onClick={
                closeMobileMenu
              }
            >
              <User
                size={18}
              />
              Account
            </Link>

            <Link
              to="/cart"
              onClick={
                closeMobileMenu
              }
            >
              <ShoppingCart
                size={18}
              />

              Cart

              {cartCount >
                0 && (

                <span className="ce-mobile-cart-count">
                  {cartCount}
                </span>

              )}

            </Link>

          </nav>

        )}

      </header>

      {mobileMenuOpen && (

        <button
          type="button"
          className="ce-mobile-overlay"
          aria-label="Close navigation"
          onClick={
            closeMobileMenu
          }
        />

      )}
    </>
  )
}