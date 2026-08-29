import {
  useEffect,
  useRef,
  useState
} from 'react'

import {
  Link,
  useNavigate
} from 'react-router-dom'

import {
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'

import {
  useCustomerAuth
} from '../context/CustomerAuthContext'

const API_URL =
  'import.meta.env.VITE_API_URL'

export default function CustomerLogin() {
  const navigate =
    useNavigate()

  const {
    loginCustomer
  } = useCustomerAuth()

  const [
    phone,
    setPhone
  ] = useState('')

  const [
    otp,
    setOtp
  ] = useState([
    '',
    '',
    '',
    '',
    '',
    ''
  ])

  const [
    step,
    setStep
  ] = useState('phone')

  const [
    loading,
    setLoading
  ] = useState(false)

  const [
    error,
    setError
  ] = useState('')

  const [
    message,
    setMessage
  ] = useState('')

  const [
    resendSeconds,
    setResendSeconds
  ] = useState(0)

  const otpRefs =
    useRef([])

  useEffect(() => {
    if (
      resendSeconds <= 0
    ) {
      return
    }

    const timer =
      setInterval(() => {
        setResendSeconds(
          (previous) =>
            previous - 1
        )
      }, 1000)

    return () =>
      clearInterval(timer)
  }, [
    resendSeconds
  ])

  const cleanPhone =
    phone.replace(
      /\D/g,
      ''
    )

  const validPhone =
    /^[6-9]\d{9}$/.test(
      cleanPhone
    )

  const handlePhoneChange =
    (event) => {
      const value =
        event.target.value
          .replace(
            /\D/g,
            ''
          )
          .slice(
            0,
            10
          )

      setPhone(value)

      setError('')
    }

  const sendOtp =
    async () => {
      if (!validPhone) {
        setError(
          'Enter a valid 10-digit Indian mobile number.'
        )

        return
      }

      try {
        setLoading(true)

        setError('')

        setMessage('')

        const response =
          await fetch(
            `${API_URL}/api/customer/send-otp`,

            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  phone:
                    cleanPhone
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
              'Unable to send OTP'
          )
        }

        setStep('otp')

        setOtp([
          '',
          '',
          '',
          '',
          '',
          ''
        ])

        setMessage(
          data.message ||
            'OTP sent successfully'
        )

        setResendSeconds(
          30
        )

        setTimeout(
          () => {
            otpRefs.current[
              0
            ]?.focus()
          },
          100
        )
      } catch (err) {
        setError(
          err.message ||
            'Unable to send OTP'
        )
      } finally {
        setLoading(false)
      }
    }

  const handlePhoneSubmit =
    (event) => {
      event.preventDefault()

      sendOtp()
    }

  const handleOtpChange =
    (
      index,
      value
    ) => {
      const digit =
        value
          .replace(
            /\D/g,
            ''
          )
          .slice(-1)

      const updatedOtp =
        [...otp]

      updatedOtp[index] =
        digit

      setOtp(
        updatedOtp
      )

      setError('')

      if (
        digit &&
        index < 5
      ) {
        otpRefs.current[
          index + 1
        ]?.focus()
      }
    }

  const handleOtpKeyDown =
    (
      index,
      event
    ) => {
      if (
        event.key ===
          'Backspace' &&
        !otp[index] &&
        index > 0
      ) {
        otpRefs.current[
          index - 1
        ]?.focus()
      }

      if (
        event.key ===
          'ArrowLeft' &&
        index > 0
      ) {
        otpRefs.current[
          index - 1
        ]?.focus()
      }

      if (
        event.key ===
          'ArrowRight' &&
        index < 5
      ) {
        otpRefs.current[
          index + 1
        ]?.focus()
      }
    }

  const handlePaste =
    (event) => {
      const pastedCode =
        event.clipboardData
          .getData('text')
          .replace(
            /\D/g,
            ''
          )
          .slice(
            0,
            6
          )

      if (
        pastedCode.length !==
        6
      ) {
        return
      }

      event.preventDefault()

      setOtp(
        pastedCode.split('')
      )

      otpRefs.current[
        5
      ]?.focus()
    }

  const handleVerify =
    async (event) => {
      event.preventDefault()

      const finalOtp =
        otp.join('')

      if (
        finalOtp.length !==
        6
      ) {
        setError(
          'Enter the complete 6-digit OTP.'
        )

        return
      }

      try {
        setLoading(true)

        setError('')

        const response =
          await fetch(
            `${API_URL}/api/customer/verify-otp`,

            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  phone:
                    cleanPhone,

                  otp:
                    finalOtp
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
              'OTP verification failed'
          )
        }

        loginCustomer(
          data.token,
          data.customer
        )

        navigate(
          '/customer/account'
        )
      } catch (err) {
        setError(
          err.message ||
            'OTP verification failed'
        )
      } finally {
        setLoading(false)
      }
    }

  const changeNumber =
    () => {
      setStep('phone')

      setOtp([
        '',
        '',
        '',
        '',
        '',
        ''
      ])

      setError('')

      setMessage('')

      setResendSeconds(0)
    }

  return (
    <main className="customer-login-page">
      <section className="customer-login-card phone-login-card">
        <Link
          to="/login"
          className="customer-login-back"
        >
          <ArrowLeft
            size={16}
          />

          Account Portal
        </Link>

        <div className="customer-login-icon">
          <Smartphone
            size={29}
          />
        </div>

        <span className="section-label">
          Cordial Express
        </span>

        <h1>
          {step === 'phone'
            ? 'Login / Sign Up'
            : 'Verify OTP'}
        </h1>

        {step === 'phone' ? (
          <p>
            Enter your Indian mobile
            number. We'll send an OTP
            to securely login or create
            your account.
          </p>
        ) : (
          <p>
            Enter the 6-digit OTP sent
            to +91 {cleanPhone}.
          </p>
        )}

        {error && (
          <div className="customer-auth-error">
            {error}
          </div>
        )}

        {message && (
          <div className="customer-auth-success">
            <ShieldCheck
              size={16}
            />

            {message}
          </div>
        )}

        {step === 'phone' ? (
          <form
            onSubmit={
              handlePhoneSubmit
            }
          >
            <label>
              Mobile Number
            </label>

            <div className="india-phone-input">
              <div className="india-code">
                <span>
                  🇮🇳
                </span>

                +91
              </div>

              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="9876543210"
                maxLength="10"
                value={
                  phone
                }
                onChange={
                  handlePhoneChange
                }
                autoFocus
              />
            </div>

            <div className="phone-number-hint">
              Enter a 10-digit Indian
              mobile number beginning
              with 6, 7, 8 or 9.
            </div>

            <button
              type="submit"
              className="customer-login-submit"
              disabled={
                loading ||
                !validPhone
              }
            >
              {loading
                ? 'Sending OTP...'
                : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={
              handleVerify
            }
          >
            <label>
              Enter 6-digit OTP
            </label>

            <div
              className="otp-input-row"
              onPaste={
                handlePaste
              }
            >
              {otp.map(
                (
                  digit,
                  index
                ) => (
                  <input
                    key={
                      index
                    }
                    ref={(
                      element
                    ) => {
                      otpRefs.current[
                        index
                      ] =
                        element
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={
                      digit
                    }
                    autoComplete={
                      index === 0
                        ? 'one-time-code'
                        : 'off'
                    }
                    onChange={(
                      event
                    ) =>
                      handleOtpChange(
                        index,
                        event.target
                          .value
                      )
                    }
                    onKeyDown={(
                      event
                    ) =>
                      handleOtpKeyDown(
                        index,
                        event
                      )
                    }
                  />
                )
              )}
            </div>

            <button
              type="submit"
              className="customer-login-submit"
              disabled={
                loading ||
                otp.join('')
                  .length !==
                  6
              }
            >
              {loading
                ? 'Verifying...'
                : 'Verify & Continue'}
            </button>

            <div className="otp-actions">
              <button
                type="button"
                onClick={
                  changeNumber
                }
              >
                Change Number
              </button>

              {resendSeconds >
              0 ? (
                <span>
                  Resend in{' '}
                  {
                    resendSeconds
                  }
                  s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={
                    sendOtp
                  }
                  disabled={
                    loading
                  }
                >
                  <RotateCcw
                    size={14}
                  />

                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        <div className="phone-login-terms">
          By continuing, you agree to
          Cordial Express terms and
          privacy policy.
        </div>
      </section>
    </main>
  )
}