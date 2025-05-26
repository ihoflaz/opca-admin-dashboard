import { API_BASE_URL } from './api'

export default {
  meEndpoint: `${API_BASE_URL}/api/auth/me`,
  loginEndpoint: `${API_BASE_URL}/api/auth/login`,
  registerEndpoint: `${API_BASE_URL}/api/auth/register`,
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
