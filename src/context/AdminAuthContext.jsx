import {
  createContext,
  useContext,
  useState
} from 'react'

const AdminAuthContext =
  createContext(null)

export function AdminAuthProvider({
  children
}) {
  const [
    token,
    setToken
  ] = useState(() => {
    try {
      return (
        localStorage.getItem(
          'cordialAdminToken'
        ) || null
      )
    } catch (
      error
    ) {
      console.error(
        'Unable to read admin token:',
        error
      )

      return null
    }
  })

  const [
    admin,
    setAdmin
  ] = useState(() => {
    try {
      const savedAdmin =
        localStorage.getItem(
          'cordialAdminUser'
        )

      if (!savedAdmin) {
        return null
      }

      return JSON.parse(
        savedAdmin
      )
    } catch (
      error
    ) {
      console.error(
        'Unable to read saved admin:',
        error
      )

      try {
        localStorage.removeItem(
          'cordialAdminUser'
        )
      } catch {
        // Ignore storage cleanup error
      }

      return null
    }
  })

  const login = (
    newToken,
    adminData
  ) => {
    if (!newToken) {
      throw new Error(
        'Admin token is required.'
      )
    }

    const safeAdminData =
      adminData || {}

    try {
      localStorage.setItem(
        'cordialAdminToken',
        newToken
      )

      localStorage.setItem(
        'cordialAdminUser',
        JSON.stringify(
          safeAdminData
        )
      )
    } catch (
      error
    ) {
      console.error(
        'Unable to save admin session:',
        error
      )

      throw new Error(
        'Unable to save the admin session.'
      )
    }

    setToken(
      newToken
    )

    setAdmin(
      safeAdminData
    )
  }

  const logout =
    () => {
      try {
        localStorage.removeItem(
          'cordialAdminToken'
        )

        localStorage.removeItem(
          'cordialAdminUser'
        )
      } catch (
        error
      ) {
        console.error(
          'Unable to clear admin session:',
          error
        )
      }

      setToken(
        null
      )

      setAdmin(
        null
      )
    }

  const isAdminLoggedIn =
    Boolean(token)

  const value = {
    token,
    admin,
    login,
    logout,
    isAdminLoggedIn
  }

  return (
    <AdminAuthContext.Provider
      value={value}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context =
    useContext(
      AdminAuthContext
    )

  if (!context) {
    throw new Error(
      'useAdminAuth must be used inside AdminAuthProvider.'
    )
  }

  return context
}