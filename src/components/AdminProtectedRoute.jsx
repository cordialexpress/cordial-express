import {
  Navigate
} from 'react-router-dom'

import {
  useAdminAuth
} from '../context/AdminAuthContext'

export default function AdminProtectedRoute({
  children
}) {
  const {
    isAdminLoggedIn
  } = useAdminAuth()

  if (
    !isAdminLoggedIn
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }

  return children
}