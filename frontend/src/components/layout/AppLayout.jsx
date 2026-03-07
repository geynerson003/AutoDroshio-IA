import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navLinkClasses = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-indigo-600 text-white shadow-sm'
      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
  }`

function getPageTitle(pathname) {
  if (pathname.startsWith('/products')) return 'Products'
  if (pathname.startsWith('/campaigns')) return 'Campaigns'
  if (pathname.startsWith('/orders')) return 'Orders'
  return 'Dashboard'
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-gray-950 flex flex-col">
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">
              AD
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                AutoDropship <span className="text-indigo-400">AI</span>
              </p>
              <p className="text-xs text-gray-500">Smart dropshipping OS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/dashboard" className={navLinkClasses}>
            <span className="text-lg">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/products" className={navLinkClasses}>
            <span className="text-lg">📦</span>
            <span>Products</span>
          </NavLink>
          <NavLink to="/campaigns" className={navLinkClasses}>
            <span className="text-lg">📣</span>
            <span>Campaigns</span>
          </NavLink>
          <NavLink to="/orders" className={navLinkClasses}>
            <span className="text-lg">🧾</span>
            <span>Orders</span>
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t border-gray-800 text-sm flex items-center justify-between">
          <div>
            <p className="font-medium text-white text-xs truncate max-w-[140px]">
              {user?.email}
            </p>
            <p className="text-[11px] text-gray-500">Logged in</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="text-xs text-gray-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-950/80 backdrop-blur">
          <div>
            <h1 className="text-sm font-semibold text-white">{title}</h1>
            <p className="text-xs text-gray-500">
              Manage your products, campaigns and orders in one place.
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout

