import {
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles
} from 'lucide-react'

import {
  useAdminAuth
} from '../context/AdminAuthContext.jsx'

const API_URL =
  'import.meta.env.VITE_API_URL'

export default function AdminLogin() {
  const navigate =
    useNavigate()

  const {
    login
  } =
    useAdminAuth()

  const [
    email,
    setEmail
  ] =
    useState('')

  const [
    password,
    setPassword
  ] =
    useState('')

  const [
    showPassword,
    setShowPassword
  ] =
    useState(false)

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

  const clearError =
    () => {
      if (error) {
        setError('')
      }
    }

  const handleEmailChange =
    (
      event
    ) => {
      setEmail(
        event.target.value
      )

      clearError()
    }

  const handlePasswordChange =
    (
      event
    ) => {
      setPassword(
        event.target.value
      )

      clearError()
    }

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault()

      if (loading) {
        return
      }

      setError('')

      const cleanEmail =
        email
          .trim()
          .toLowerCase()

      const cleanPassword =
        password.trim()

      if (
        !cleanEmail ||
        !cleanPassword
      ) {
        setError(
          'Please enter your email and password.'
        )

        return
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (
        !emailPattern.test(
          cleanEmail
        )
      ) {
        setError(
          'Please enter a valid email address.'
        )

        return
      }

      try {
        setLoading(true)

        const response =
          await fetch(
            `${API_URL}/api/admin/login`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  email:
                    cleanEmail,

                  password:
                    cleanPassword
                })
            }
          )

        let data = {}

        try {
          data =
            await response.json()
        } catch {
          data = {}
        }

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
              'Invalid admin email or password.'
          )
        }

        if (
          !data.token
        ) {
          throw new Error(
            'The server did not return an admin access token.'
          )
        }

        const adminData =
          data.admin ||
          data.user ||
          {
            email:
              cleanEmail
          }

        login(
          data.token,
          adminData
        )

        navigate(
          '/admin/orders',
          {
            replace: true
          }
        )
      } catch (
        loginError
      ) {
        console.error(
          'Admin login error:',
          loginError
        )

        if (
          loginError instanceof TypeError
        ) {
          setError(
            'Unable to connect to the Cordial Express server. Make sure the backend is running.'
          )
        } else {
          setError(
            loginError.message ||
              'Unable to sign in to the admin portal.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

  return (
    <main className="ce-admin-login-page">

      <section className="ce-admin-login-shell">

        {/* LEFT PANEL */}

        <div className="ce-admin-login-brand">

          <span className="ce-admin-login-eyebrow">

            <Sparkles
              size={13}
            />

            Cordial Express

          </span>

          <h1>
            Secure
            <span>
              administration.
            </span>
          </h1>

          <p>
            Sign in to manage products,
            inventory, customer orders
            and support enquiries from
            one secure workspace.
          </p>

          <div className="ce-admin-login-benefits">

            <div>

              <ShieldCheck
                size={18}
              />

              <div>

                <strong>
                  Protected access
                </strong>

                <span>
                  Administrative tools
                  are restricted to
                  authorised staff.
                </span>

              </div>

            </div>

            <div>

              <LockKeyhole
                size={18}
              />

              <div>

                <strong>
                  Secure session
                </strong>

                <span>
                  Your admin session
                  uses authenticated
                  access.
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* LOGIN PANEL */}

        <div className="ce-admin-login-card">

          <div className="ce-admin-login-card-heading">

            <div className="ce-admin-login-icon">

              <ShieldCheck
                size={24}
              />

            </div>

            <div>

              <span>
                STAFF ACCESS
              </span>

              <h2>
                Admin Login
              </h2>

              <p>
                Enter your administrator
                credentials to continue.
              </p>

            </div>

          </div>

          <form
            className="ce-admin-login-form"
            onSubmit={
              handleSubmit
            }
          >

            {/* EMAIL */}

            <label>

              <span>
                Email Address
              </span>

              <div className="ce-admin-login-input">

                <Mail
                  size={17}
                />

                <input
                  type="email"
                  value={
                    email
                  }
                  onChange={
                    handleEmailChange
                  }
                  autoComplete="username"
                  placeholder="admin@example.com"
                  disabled={
                    loading
                  }
                />

              </div>

            </label>

            {/* PASSWORD */}

            <label>

              <span>
                Password
              </span>

              <div className="ce-admin-login-input">

                <LockKeyhole
                  size={17}
                />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={
                    password
                  }
                  onChange={
                    handlePasswordChange
                  }
                  autoComplete="current-password"
                  placeholder="Enter password"
                  disabled={
                    loading
                  }
                />

                <button
                  type="button"
                  className="ce-admin-password-toggle"
                  onClick={
                    () =>
                      setShowPassword(
                        (
                          current
                        ) =>
                          !current
                      )
                  }
                  disabled={
                    loading
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >

                  {
                    showPassword
                      ? (
                        <EyeOff
                          size={16}
                        />
                      )
                      : (
                        <Eye
                          size={16}
                        />
                      )
                  }

                </button>

              </div>

            </label>

            {/* ERROR */}

            {error && (

              <div
                className="ce-admin-login-error"
                role="alert"
              >

                <AlertCircle
                  size={17}
                />

                <span>
                  {error}
                </span>

              </div>

            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="ce-admin-login-submit"
              disabled={
                loading
              }
            >

              {
                loading
                  ? (
                    <>

                      <LoaderCircle
                        size={17}
                        className="ce-admin-login-spinner"
                      />

                      Signing In...

                    </>
                  )
                  : (
                    <>

                      <ShieldCheck
                        size={17}
                      />

                      Sign In

                      <ArrowRight
                        size={15}
                      />

                    </>
                  )
              }

            </button>

          </form>

          <div className="ce-admin-login-note">

            <LockKeyhole
              size={14}
            />

            <span>
              Access is restricted to
              authorised Cordial Express
              administrators.
            </span>

          </div>

          <Link
            to="/"
            className="ce-admin-login-back"
          >
            ← Return to Cordial Express
          </Link>

        </div>

      </section>

    </main>
  )
}