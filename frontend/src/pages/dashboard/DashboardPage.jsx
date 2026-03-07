import { useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { Card, Spinner } from '../../components/common'

export function DashboardPage() {
  const { products, campaigns, orders, loading, loadProducts, loadCampaigns, loadOrders } = useData()

  useEffect(() => {
    // Small delay to ensure token is available in localStorage
    const timer = setTimeout(() => {
      loadProducts()
      loadCampaigns()
      loadOrders()
    }, 100)
    return () => clearTimeout(timer)
  }, [loadProducts, loadCampaigns, loadOrders])

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: '📦',
      color: 'bg-blue-600',
    },
    {
      label: 'Active Campaigns',
      value: campaigns.filter((c) => c.status === 'ACTIVE').length,
      icon: '📊',
      color: 'bg-green-600',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: '🛒',
      color: 'bg-purple-600',
    },
    {
      label: 'Revenue',
      value: `$${(orders.reduce((sum, o) => sum + (o.price || 0), 0)).toFixed(2)}`,
      icon: '💰',
      color: 'bg-yellow-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to AutoDropship AI</h1>
        <p className="text-gray-400">Manage your dropshipping business with ease</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Products</h2>
          <div className="space-y-3">
            {products.slice(0, 5).length === 0 ? (
              <p className="text-gray-400 text-sm">No products yet</p>
            ) : (
              products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm">${product.price}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{product.source || 'manual'}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).length === 0 ? (
              <p className="text-gray-400 text-sm">No orders yet</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div>
                    <p className="text-white font-medium">{order.order_number}</p>
                    <p className="text-gray-400 text-sm">{order.customer_email}</p>
                  </div>
                  <span className="text-white font-medium">${order.price}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Getting Started */}
      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Getting Started</h2>
        <div className="space-y-3 text-gray-400">
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Create products from trending sources (AliExpress, TikTok, Amazon)
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Set up Meta Ads campaigns with AI-generated content
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Track orders and manage fulfillment automatically
          </p>
          <p className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Monitor campaign performance and optimize ROI
          </p>
        </div>
      </Card>
    </div>
  )
}
