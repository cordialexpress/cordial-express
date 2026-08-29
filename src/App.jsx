import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import AdminProtectedRoute from './components/AdminProtectedRoute'

import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Login from './pages/Login'
import TrackOrder from './pages/TrackOrder'

import AdminLogin from './pages/AdminLogin'
import AdminOrders from './pages/AdminOrders'
import AdminProducts from './pages/AdminProducts'
import AdminEnquiries from './pages/AdminEnquiries'

import './App.css'

function StoreLayout({
  children
}) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>

      {/* =========================
          CUSTOMER ROUTES
      ========================= */}

      <Route
        path="/"
        element={
          <StoreLayout>
            <Home />
          </StoreLayout>
        }
      />

      <Route
        path="/products"
        element={
          <StoreLayout>
            <Products />
          </StoreLayout>
        }
      />

      <Route
        path="/about"
        element={
          <StoreLayout>
            <About />
          </StoreLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <StoreLayout>
            <Contact />
          </StoreLayout>
        }
      />

      <Route
        path="/cart"
        element={
          <StoreLayout>
            <Cart />
          </StoreLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <StoreLayout>
            <Checkout />
          </StoreLayout>
        }
      />

      <Route
        path="/checkout-success"
        element={
          <StoreLayout>
            <CheckoutSuccess />
          </StoreLayout>
        }
      />

      <Route
        path="/login"
        element={
          <StoreLayout>
            <Login />
          </StoreLayout>
        }
      />

      <Route
        path="/track-order"
        element={
          <StoreLayout>
            <TrackOrder />
          </StoreLayout>
        }
      />

      {/* =========================
          ADMIN ROUTES
      ========================= */}

      <Route
        path="/admin"
        element={
          <Navigate
            to="/admin/login"
            replace
          />
        }
      />

      <Route
        path="/admin/login"
        element={
          <AdminLogin />
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminProtectedRoute>
            <AdminOrders />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminProtectedRoute>
            <AdminProducts />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/admin/enquiries"
        element={
          <AdminProtectedRoute>
            <AdminEnquiries />
          </AdminProtectedRoute>
        }
      />

      {/* =========================
          FALLBACK
      ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  )
}