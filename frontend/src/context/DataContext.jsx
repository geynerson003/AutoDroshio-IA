import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const DataContext = createContext()

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export function DataProvider({ children }) {
  const [products, setProducts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getProducts()
      setProducts(data)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load products'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load campaigns
  const loadCampaigns = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getCampaigns()
      setCampaigns(data)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load campaigns'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load orders
  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.getOrders()
      setOrders(data)
      return data
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to load orders'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create product
  const createProduct = useCallback(async (productData) => {
    setLoading(true)
    setError(null)
    try {
      const newProduct = await api.createProduct(productData)
      setProducts([...products, newProduct])
      return { success: true, data: newProduct }
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create product'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [products])

  // Create campaign
  const createCampaign = useCallback(async (campaignData) => {
    setLoading(true)
    setError(null)
    try {
      const newCampaign = await api.createCampaign(campaignData)
      setCampaigns([...campaigns, newCampaign])
      return { success: true, data: newCampaign }
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create campaign'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [campaigns])

  // Create order
  const createOrder = useCallback(async (orderData) => {
    setLoading(true)
    setError(null)
    try {
      const newOrder = await api.createOrder(orderData)
      setOrders([...orders, newOrder])
      return { success: true, data: newOrder }
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to create order'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }, [orders])

  return (
    <DataContext.Provider
      value={{
        products,
        campaigns,
        orders,
        loading,
        error,
        loadProducts,
        loadCampaigns,
        loadOrders,
        createProduct,
        createCampaign,
        createOrder,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
