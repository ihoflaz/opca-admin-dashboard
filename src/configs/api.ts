// ** API Yapılandırma Dosyası

// ** Ortam değişkenlerinden API URL'ini al, yoksa varsayılan olarak localhost:5002 kullan
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'

// ** API Rate Limit Ayarları
export const API_RATE_LIMITS = {
  AUTH_REQUESTS: '15 dakikada maksimum 10 istek',
  FILE_UPLOAD: 'Dakikada maksimum 10 istek',
  GENERAL_REQUESTS: 'Dakikada maksimum 60 istek'
}

// ** API Önbellekleme Süreleri (milisaniye)
export const API_CACHE_DURATIONS = {
  ANALYSIS_RESULTS: 5 * 60 * 1000, // 5 dakika
  ANALYSIS_HISTORY: 2 * 60 * 1000 // 2 dakika
}

// ** Dosya Yükleme Limitleri
export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png']
}

// ** API Endpoint'leri
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REFRESH_TOKEN: '/api/auth/refresh-token',

  // Analyses
  ANALYSIS_HISTORY: '/api/analysis/history',
  ANALYSIS_RESULTS: '/api/analysis/results',
  ANALYSIS_PARASITE: '/api/analysis/mobile/parasite',
  ANALYSIS_MNIST: '/api/analysis/mobile/mnist',
  ANALYSIS_BATCH: '/api/analysis/batch-upload',

  // Parasites
  PARASITES: '/api/parasites',

  // Digits
  DIGITS: '/api/digits',

  // Users
  USERS: '/api/users'
}
