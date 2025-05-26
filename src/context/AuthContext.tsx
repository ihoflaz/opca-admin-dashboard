// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** API Services
import { authService } from 'src/services/api'

// import { mockAuthService } from 'src/services/mockApi'

// ** JWT Util
import {
  saveToken,
  saveRefreshToken,
  saveUserData,
  getToken,
  getUserData,
  clearAuthData,
  isTokenValid,
  clearMockTokens
} from 'src/utils/jwt'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      // Önce mock token'ları temizle
      clearMockTokens()

      const storedToken = getToken()
      const userData = getUserData()

      if (storedToken && userData && isTokenValid()) {
        console.log('🔔 Geçerli token bulundu, kullanıcı giriş yapmış')
        setUser(userData)
      } else if (storedToken && !isTokenValid()) {
        console.log('🔔 Token süresi dolmuş, temizleniyor')
        clearAuthData()
      }

      setLoading(false)
    }

    initAuth()
  }, [])

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    setLoading(true)

    // Gerçek API servisini kullanıyoruz
    authService
      .login(params.email, params.password)
      .then(async response => {
        console.log('🔔 API Login yanıtı:', response.data)

        // API dokümanına göre yanıt formatı: { success: true, data: { user, token, refreshToken } }
        if (response.data.success && response.data.data) {
          const { token, refreshToken, user } = response.data.data

          // JWT ve kullanıcı bilgilerini kaydet
          saveToken(token)
          saveRefreshToken(refreshToken)
          saveUserData(user)
          setUser(user)

          // Yönlendirme
          const returnUrl = router.query.returnUrl

          // Kullanıcı rolüne göre dashboard yönlendirmesi
          let redirectURL = returnUrl as string

          if (!returnUrl || returnUrl === '/') {
            // Admin kullanıcıları için CRM dashboard
            if (user.role === 'admin') {
              redirectURL = '/opca/dashboard'
            } else {
              // Diğer kullanıcılar için Analytics dashboard
              redirectURL = '/opca/dashboard'
            }
          }

          console.log('🔔 Login başarılı! Yönlendiriliyor:', redirectURL)

          // Kısa bir gecikme ile yönlendirme yap (state güncellemesinin işlenmesi için)
          setTimeout(() => {
            router.replace(redirectURL)
          }, 500)
        } else {
          throw new Error('API yanıt formatı hatalı')
        }

        setLoading(false)
      })
      .catch(err => {
        console.error('🔔 Login hatası:', err)
        setLoading(false)
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    clearAuthData()
    setUser(null)
    router.push('/auth/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
