import { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { Button, Card, Badge, Spinner } from '../../components/common'

export function CampaignsPage() {
  const { campaigns, products, loading, error, loadCampaigns, createCampaign } = useData()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    product_id: '',
    name: '',
    budget: '',
    objective: 'CONVERSIONS',
    audience_targeting: '',
  })

  useEffect(() => {
    loadCampaigns()
  }, [loadCampaigns])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await createCampaign({
      product_id: parseInt(formData.product_id),
      name: formData.name,
      budget: parseFloat(formData.budget),
      objective: formData.objective,
      audience_targeting: formData.audience_targeting,
    })
    if (result.success) {
      setFormData({
        product_id: '',
        name: '',
        budget: '',
        objective: 'CONVERSIONS',
        audience_targeting: '',
      })
      setShowForm(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'PAUSED':
        return 'warning'
      case 'COMPLETED':
        return 'info'
      default:
        return 'default'
    }
  }

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Campaigns</h1>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Cancel' : 'Create Campaign'}
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
                Product
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Summer Sale 2024"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Budget
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Objective
                </label>
                <select
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="AWARENESS">Awareness</option>
                  <option value="CONSIDERATION">Consideration</option>
                  <option value="CONVERSIONS">Conversions</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Audience Targeting
              </label>
              <textarea
                name="audience_targeting"
                value={formData.audience_targeting}
                onChange={handleChange}
                placeholder="e.g., 18-35, interested in fashion, USA and Canada"
                rows="3"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Create Campaign
            </Button>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {campaigns.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No campaigns yet. Create one to get started!</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign.id} className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">{campaign.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Budget: ${campaign.budget}</span>
                  <span>Spent: ${campaign.spent || 0}</span>
                  <span>Revenue: ${campaign.revenue || 0}</span>
                </div>
              </div>
              <Badge variant={getStatusColor(campaign.status)}>
                {campaign.status || 'DRAFT'}
              </Badge>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
