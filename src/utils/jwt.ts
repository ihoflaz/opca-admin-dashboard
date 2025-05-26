// ** JWT Yardımcı Fonksiyonları

// ** Token localStorage key'leri
const TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const USER_DATA_KEY = 'userData'

// ** Token kaydetme
export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(TOKEN_KEY, token)
  }
}

// ** Refresh token kaydetme
export const saveRefreshToken = (refreshToken: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

// ** Token getirme
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(TOKEN_KEY)
  }

  return null
}

// ** Refresh token getirme
export const getRefreshToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  return null
}

// ** Kullanıcı verisi kaydetme
export const saveUserData = (userData: any) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
  }
}

// ** Kullanıcı verisi getirme
export const getUserData = () => {
  if (typeof window !== 'undefined') {
    const userData = window.localStorage.getItem(USER_DATA_KEY)

    return userData ? JSON.parse(userData) : null
  }

  return null
}

// ** Tüm auth verilerini temizleme
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_KEY)
    window.localStorage.removeItem(USER_DATA_KEY)
  }
}

// ** Token geçerliliğini kontrol etme
export const isTokenValid = (): boolean => {
  const token = getToken()

  if (!token) return false

  // Mock token kontrolü - mock token'ları geçersiz say
  if (token.startsWith('mock_token_')) {
    console.log('🔔 Mock token tespit edildi, temizleniyor...')
    clearAuthData()

    return false
  }

  try {
    // Token'ı decode et (JWT'nin ortasındaki kısmı alıp JSON parse et)
    const base64Url = token.split('.')[1]

    if (!base64Url) {
      console.log('🔔 Geçersiz token formatı')

      return false
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const { exp } = JSON.parse(jsonPayload)

    // Token'ın süresinin dolup dolmadığını kontrol et
    const isValid = Date.now() < exp * 1000

    if (!isValid) {
      console.log('🔔 Token süresi dolmuş')
    }

    return isValid
  } catch (error) {
    console.log('🔔 Token decode hatası:', error)

    return false
  }
}

// ** Mock token'ları temizleme fonksiyonu
export const clearMockTokens = () => {
  const token = getToken()
  const refreshToken = getRefreshToken()

  if (token?.startsWith('mock_token_') || refreshToken?.startsWith('mock_refresh_token_')) {
    console.log('🔔 Mock tokenlar temizleniyor...')
    clearAuthData()

    return true
  }

  return false
}
