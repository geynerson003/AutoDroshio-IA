import { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { Button, Card, Badge, Spinner } from '../../components/common'

export function ProductsPage() {
  const { products, loading, error, loadProducts, createProduct } = useData()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    image_url: '',
    source: '',
  })

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await createProduct(formData)
    if (result.success) {
      setFormData({
        name: '',
        description: '',
        price: '',
        cost: '',
        image_url: '',
        source: '',
      })
      setShowForm(false)
    }
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Cancel' : 'Add Product'}
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
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
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
                  Cost
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Source
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="">Select source</option>
                <option value="aliexpress">AliExpress</option>
                <option value="amazon">Amazon</option>
                <option value="tiktok">TikTok</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Create Product
            </Button>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No products yet. Create one to get started!</p>
          </div>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <h3 className="font-semibold text-white mb-2">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-lg font-semibold text-white">
                    ${product.price}
                  </p>
                </div>
                <Badge variant="info">{product.source || 'manual'}</Badge>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
