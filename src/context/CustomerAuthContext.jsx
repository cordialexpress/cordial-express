import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

const CustomerAuthContext =
  createContext()

const API_URL =
  'import.meta.env.VITE_API_URL'

export function CustomerAuthProvider({
  children
}) {
  const [
    customerToken,
    setCustomerToken
  ] = useState(() =>
    localStorage.getItem(
      'cordialCustomerToken'
    )
  )

  const [
    customer,
    setCustomer
  ] = useState(() => {
    try {
      const savedCustomer =
        localStorage.getItem(
          'cordialCustomerUser'
        )

      return savedCustomer
        ? JSON.parse(
            savedCustomer
          )
        : null
    } catch {
      return null
    }
  })

  const [
    checkingCustomer,
    setCheckingCustomer
  ] = useState(
    Boolean(customerToken)
  )

  const loginCustomer = (
    token,
    customerData
  ) => {
    localStorage.setItem(
      'cordialCustomerToken',
      token
    )

    localStorage.setItem(
      'cordialCustomerUser',
      JSON.stringify(
        customerData
      )
    )

    setCustomerToken(token)

    setCustomer(
      customerData
    )
  }

  const logoutCustomer =
    () => {
      localStorage.removeItem(
        'cordialCustomerToken'
      )

      localStorage.removeItem(
        'cordialCustomerUser'
      )

      setCustomerToken(null)

      setCustomer(null)
    }

  useEffect(() => {
    if (!customerToken) {
      setCheckingCustomer(
        false
      )

      return
    }

    const verifyCustomer =
      async () => {
        try {
          const response =
            await fetch(
              `${API_URL}/api/customer/me`,
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
            !response.ok ||
            !data.success
          ) {
            logoutCustomer()

            return
          }

          setCustomer(
            data.customer
          )

          localStorage.setItem(
            'cordialCustomerUser',
            JSON.stringify(
              data.customer
            )
          )
        } catch (error) {
          console.error(
            'Customer verification error:',
            error
          )
        } finally {
          setCheckingCustomer(
            false
          )
        }
      }

    verifyCustomer()
  }, [
    customerToken
  ])

  return (
    <CustomerAuthContext.Provider
      value={{
        customerToken,

        customer,

        loginCustomer,

        logoutCustomer,

        checkingCustomer,

        isCustomerLoggedIn:
          Boolean(
            customerToken &&
            customer
          )
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  return useContext(
    CustomerAuthContext
  )
}