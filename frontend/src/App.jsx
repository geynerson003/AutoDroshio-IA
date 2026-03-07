import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { LoginPage } from './pages/auth/LoginPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { ProductsPage } from './pages/dashboard/ProductsPage'
import { CampaignsPage } from './pages/dashboard/CampaignsPage'
import { OrdersPage } from './pages/dashboard/OrdersPage'
import { AppLayout } from './components/layout/AppLayout'
import { Spinner } from './components/common'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  // Wait until AuthContext has fully resolved (checked token validity)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Only redirect after loading is complete and we know auth status
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

