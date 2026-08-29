import {
  Navigate
} from 'react-router-dom'

import {
  useCustomerAuth
} from '../context/CustomerAuthContext'

export default function CustomerProtectedRoute({
  children
}) {
  const {
    isCustomerLoggedIn,
    checkingCustomer
  } = useCustomerAuth()

  if (checkingCustomer) {
    return (
      <main
        style={{
          minHeight: '70vh',

          display: 'grid',

          placeItems:
            'center',

          color:
            '#173f2c'
        }}
      >
        Checking account...
      </main>
    )
  }

  if (
    !isCustomerLoggedIn
  ) {
    return (
      <Navigate
        to="/customer/login"
        replace
      />
    )
  }

  return children
}