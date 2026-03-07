/**
 * API Client for communicating with AutoDropship AI backend
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class ApiClient {
  constructor(baseURL = API_URL) {
    this.client = axios.create({
      baseURL: `${baseURL}/api`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired
          localStorage.removeItem('access_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // ============ Auth ============
  async register(email, username, password, fullName) {
    const response = await this.client.post('/auth/register', {
      email,
      username,
      password,
      full_name: fullName,
    })
    return response.data
  }

  async login(email, password) {
    const response = await this.client.post('/auth/login', {
      email,
      password,
    })
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user_id,
        email: response.data.email,
      }))
    }
    return response.data
  }

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me')
    return response.data
  }

  // ============ Products ============
  async createProduct(productData) {
    const response = await this.client.post('/products/', productData)
    return response.data
  }

  async getProducts() {
    const response = await this.client.get('/products/')
    return response.data
  }

  async getProduct(productId) {
    const response = await this.client.get(`/products/${productId}`)
    return response.data
  }

  // ============ Campaigns ============
  async createCampaign(campaignData) {
    const response = await this.client.post('/campaigns/', campaignData)
    return response.data
  }

  async getCampaigns() {
    const response = await this.client.get('/campaigns/')
    return response.data
  }

  // ============ Orders ============
  async createOrder(orderData) {
    const response = await this.client.post('/orders/', orderData)
    return response.data
  }

  async getOrders() {
    const response = await this.client.get('/orders/')
    return response.data
  }

  // ============ Health ============
  async healthCheck() {
    const response = await axios.get(`${API_URL}/health`)
    return response.data
  }
}

export default new ApiClient()
