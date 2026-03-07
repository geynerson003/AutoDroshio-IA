import { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { Button, Card, Badge, Spinner } from '../../components/common'

export function OrdersPage() {
  const { orders, loading, error, loadOrders, createOrder } = useData()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    order_number: '',
    customer_email: '',
    price: '',
    supplier: 'CJ',
    supplier_order_id: '',
    tracking_number: '',
  })

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await createOrder({
      order_number: formData.order_number,
      customer_email: formData.customer_email,
      price: parseFloat(formData.price),
      supplier: formData.supplier,
      supplier_order_id: formData.supplier_order_id,
      tracking_number: formData.tracking_number,
    })
    if (result.success) {
      setFormData({
        order_number: '',
        customer_email: '',
        price: '',
        supplier: 'CJ',
        supplier_order_id: '',
        tracking_number: '',
      })
      setShowForm(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning'
      case 'PROCESSING':
        return 'info'
      case 'SHIPPED':
        return 'success'
      case 'DELIVERED':
        return 'success'
      case 'CANCELLED':
        return 'error'
      default:
        return 'default'
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Orders</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Cancel' : 'New Order'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-900 border border-red-700 rounded text-red-200">
          {error}
        </div>
      )}

      {showForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Order Number
              </label>
              <input
                type="text"
                name="order_number"
                value={formData.order_number}
                onChange={handleChange}
                placeholder="ORD-001"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Customer Email
              </label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Supplier
                </label>
                <select
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="CJ">CJ Dropshipping</option>
                  <option value="Printful">Printful</option>
                  <option value="AliExpress">AliExpress</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Supplier Order ID
              </label>
              <input
                type="text"
                name="supplier_order_id"
                value={formData.supplier_order_id}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                name="tracking_number"
                value={formData.tracking_number}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Create Order
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No orders yet. Create one to get started!</p>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">{order.order_number}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="text-white">{order.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="text-white">${order.price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Supplier</p>
                    <p className="text-white">{order.supplier}</p>
                  </div>
                </div>
                {order.tracking_number && (
                  <p className="text-xs text-gray-500 mt-2">
                    Tracking: {order.tracking_number}
                  </p>
                )}
              </div>
              <Badge variant={getStatusColor(order.status)}>
                {order.status || 'PENDING'}
              </Badge>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
