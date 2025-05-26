// ** Axios Import
import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

// ** Config Import
import { API_BASE_URL } from 'src/configs/api'

// ** JWT Util Import
import { getToken } from 'src/utils/jwt'

// ** API İstekleri için temel axios instance'ı
console.log('API Base URL:', API_BASE_URL)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// İstek ve yanıt durumunu loglamak için
const logApiRequest = (config: InternalAxiosRequestConfig) => {
  console.log(`API İsteği: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
  if (config.data) {
    console.log('İstek verisi:', config.data)
  }

  return config
}

// İstek öncesi işlem
api.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return logApiRequest(config)
  },
  error => {
    console.error('API istek hatası:', error)

    return Promise.reject(error)
  }
)

// Yanıt işlemi
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Yanıtı: ${response.status} ${response.statusText}`)

    return response
  },
  error => {
    if (error.response) {
      console.error(`API Hata Yanıtı: ${error.response.status}`, error.response.data)
    } else {
      console.error('API Bağlantı Hatası:', error.message)
    }

    return Promise.reject(error)
  }
)

// ** API Servisleri
export const authService = {
  login: (email: string, password: string) => {
    console.log(`Login isteği: ${email}`)

    return api.post('/api/auth/login', { email, password })
  },
  register: (userData: any) => {
    console.log('Kayıt isteği:', userData.email)

    return api.post('/api/auth/register', userData)
  },
  refreshToken: (refreshToken: string) => {
    console.log('Token yenileme isteği')

    return api.post('/api/auth/refresh-token', { refreshToken })
  }
}

export const analysisService = {
  // ** Analiz listesi getir
  getAnalyses: (page = 1, limit = 10, type?: string, startDate?: string, endDate?: string) => {
    console.log(`Analiz listesi isteği: sayfa=${page}, limit=${limit}, tür=${type || 'tümü'}`)

    return api.get('/api/analysis/history', {
      params: {
        page,
        limit,
        type,
        startDate,
        endDate
      }
    })
  },

  // ** Analiz detayı getir
  getAnalysisById: (id: string) => {
    console.log(`Analiz detayı isteği: ${id}`)

    return api.get(`/api/analysis/results/${id}`)
  },

  // ** Parazit analiz sonucu gönder
  uploadParasiteAnalysis: (formData: FormData) => {
    console.log('Parazit analiz sonucu gönderiliyor')

    return api.post('/api/analysis/mobile/parasite', formData)
  },

  // ** MNIST analiz sonucu gönder
  uploadMnistAnalysis: (formData: FormData) => {
    console.log('MNIST analiz sonucu gönderiliyor')

    return api.post('/api/analysis/mobile/mnist', formData)
  },

  // ** Toplu analiz sonuçları gönder
  uploadBatchAnalysis: (data: any) => {
    console.log(`Toplu analiz sonuçları gönderiliyor: ${data.analyses?.length || 0} adet`)

    return api.post('/api/analysis/batch-upload', data)
  }
}

export const parasiteService = {
  // ** Tüm parazitleri getir
  getAllParasites: () => {
    console.log('Tüm parazitler isteniyor')

    return api.get('/api/parasites')
  },

  // ** Parazit detayı getir
  getParasiteByType: (type: string) => {
    console.log(`Parazit detayı isteniyor: ${type}`)

    return api.get(`/api/parasites/${type}`)
  },

  // ** Parazit ekle (Admin)
  addParasite: (parasiteData: any) => {
    console.log(`Parazit ekleniyor: ${parasiteData.type}`)

    return api.post('/api/parasites', parasiteData)
  },

  // ** Parazit güncelle (Admin)
  updateParasite: (type: string, parasiteData: any) => {
    console.log(`Parazit güncelleniyor: ${type}`)

    return api.put(`/api/parasites/${type}`, parasiteData)
  }

  // ** Parazit sil - API dokümanında DELETE endpoint'i bulunmadığı için kaldırıldı
  // Sadece GET, POST ve PUT endpoint'leri mevcut
}

export const digitService = {
  // ** Tüm rakamları getir
  getAllDigits: () => {
    console.log('Tüm rakamlar isteniyor')

    return api.get('/api/digits')
  },

  // ** Rakam detayı getir
  getDigitByValue: (value: number) => {
    console.log(`Rakam detayı isteniyor: ${value}`)

    return api.get(`/api/digits/${value}`)
  },

  // ** Rakam ekle (Admin)
  addDigit: (digitData: any) => {
    console.log(`Rakam ekleniyor: ${digitData.value}`)

    return api.post('/api/digits', digitData)
  },

  // ** Rakam güncelle (Admin)
  updateDigit: (value: number, digitData: any) => {
    console.log(`Rakam güncelleniyor: ${value}`)

    return api.put(`/api/digits/${value}`, digitData)
  }

  // ** Rakam sil - API dokümanında DELETE endpoint'i bulunmadığı için kaldırıldı
  // Sadece GET, POST ve PUT endpoint'leri mevcut
}

// ** Model Servisi
export const modelService = {
  // ** Tüm model versiyonlarını getir
  getAllModels: () => {
    console.log('Tüm model versiyonları isteniyor')

    return api.get('/api/models')
  },

  // ** Model metadata getir
  getModelMetadata: (type: string, name: string, version: string) => {
    console.log(`Model metadata isteniyor: ${type}/${name}/${version}`)

    return api.get(`/api/models/${type}/${name}/${version}/metadata`)
  },

  // ** Model güncelleme kontrolü
  checkModelUpdate: (type: string, name: string, version: string) => {
    console.log(`Model güncelleme kontrolü: ${type}/${name}/${version}`)

    return api.get(`/api/models/${type}/${name}/${version}/check-update`)
  }
}

// ** Dosya Yükleme Servisi
export const uploadService = {
  // ** Görüntü yükle
  uploadImage: (formData: FormData) => {
    console.log('Görüntü yükleniyor')

    return api.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

// ** Kullanıcı Yönetimi Servisi (Admin)
export const userService = {
  // ** Tüm kullanıcıları getir
  getAllUsers: (page = 1, limit = 20, role?: string, search?: string, sortBy?: string, sortOrder?: string) => {
    console.log(`Kullanıcı listesi isteği: sayfa=${page}, limit=${limit}, rol=${role || 'tümü'}`)

    return api.get('/api/users', {
      params: {
        page,
        limit,
        role,
        search,
        sortBy,
        sortOrder
      }
    })
  },

  // ** Kullanıcı detayı getir
  getUserById: (id: string) => {
    console.log(`Kullanıcı detayı isteği: ${id}`)

    return api.get(`/api/users/${id}`)
  },

  // ** Yeni kullanıcı oluştur
  createUser: (userData: any) => {
    console.log(`Kullanıcı oluşturuluyor: ${userData.email}`)

    return api.post('/api/users', userData)
  },

  // ** Kullanıcı güncelle
  updateUser: (id: string, userData: any) => {
    console.log(`Kullanıcı güncelleniyor: ${id}`)

    return api.put(`/api/users/${id}`, userData)
  },

  // ** Kullanıcı sil
  deleteUser: (id: string) => {
    console.log(`Kullanıcı siliniyor: ${id}`)

    return api.delete(`/api/users/${id}`)
  },

  // ** Kullanıcı istatistikleri
  getUserStats: () => {
    console.log('Kullanıcı istatistikleri isteniyor')

    return api.get('/api/users/stats')
  }
}

// ** Admin Dashboard Servisi
export const adminService = {
  // ** Tüm analizleri getir (admin)
  getAllAnalyses: (
    page = 1,
    limit = 20,
    type?: string,
    userId?: string,
    processedOnMobile?: boolean,
    startDate?: string,
    endDate?: string,
    sortBy?: string,
    sortOrder?: string
  ) => {
    console.log(`Admin analiz listesi isteği: sayfa=${page}, limit=${limit}`)

    return api.get('/api/analysis/admin/all', {
      params: {
        page,
        limit,
        type,
        userId,
        processedOnMobile,
        startDate,
        endDate,
        sortBy,
        sortOrder
      }
    })
  },

  // ** Analiz istatistikleri (admin)
  getAnalysisStats: () => {
    console.log('Admin analiz istatistikleri isteniyor')

    return api.get('/api/analysis/admin/stats')
  }
}

export default api
