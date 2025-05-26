// ** API için tip tanımlamaları

// ** Auth türleri
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  role: string
}

// ** Kullanıcı türleri
export interface User {
  id: string
  fullName: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

// ** Parazit türleri
export interface Parasite {
  type: string
  name: string
  description: string
  treatment: string
  preventionMeasures: string[]
  imageUrls: string[]
  examples: ParasiteExample[]
}

export interface ParasiteExample {
  imageUrl: string
  description: string
}

// ** Rakam türleri
export interface Digit {
  value: number
  description: string
  examples: DigitExample[]
}

export interface DigitExample {
  imageUrl: string
  description: string
}

// ** Analiz sonuçları türleri
export interface AnalysisResult {
  id: string
  analysisType: 'Parasite' | 'MNIST'
  type: 'Parasite' | 'MNIST' // DataGrid için ek alan
  imageUrl: string
  thumbnailUrl?: string
  results: ParasiteResult[] | DigitResult[]
  parasiteResults?: ParasiteResult[]
  digitResults?: DigitResult[]
  dominantResult?: ParasiteResult | DigitResult
  processingTimeMs?: number
  processedOnMobile?: boolean
  location?: string
  notes?: string
  modelName?: string
  modelVersion?: string
  deviceInfo?: string
  createdAt: string
  timestamp?: string
  isUploaded?: boolean
  userId?: string
}

export interface ParasiteResult {
  type: string
  confidence: number
}

export interface DigitResult {
  value: number
  confidence: number
}

// ** Analiz yükleme türleri
export interface AnalysisUploadRequest {
  image: File
  results: ParasiteResult[] | DigitResult[]
  processingTimeMs: number
  location?: string
  notes?: string
  modelName: string
  modelVersion: string
  deviceInfo: string
}

// ** Toplu analiz yükleme türleri
export interface BatchAnalysisUploadRequest {
  analyses: BatchAnalysisItem[]
}

export interface BatchAnalysisItem {
  localId: string
  type: 'Parasite' | 'MNIST'
  imageBase64: string
  results: ParasiteResult[] | DigitResult[]
  processingTimeMs: number
  location?: string
  notes?: string
  modelName: string
  modelVersion: string
  deviceInfo: string
  createdAt: string
}

export interface BatchAnalysisUploadResponse {
  success: boolean
  results: BatchAnalysisItemResult[]
  successCount: number
  errorCount: number
  totalCount: number
}

export interface BatchAnalysisItemResult {
  localId: string
  serverId?: string
  status: 'success' | 'error'
  message?: string
}

// ** Sayfalama türleri
export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

export interface Pagination {
  total: number
  currentPage: number
  totalPages: number
  limit: number
}

// ** Model versiyonları
export interface ModelVersion {
  id: string
  type: 'Parasite' | 'MNIST'
  name: string
  version: string
  description: string
  releaseDate: string
  downloadUrl: string
  fileSize: number
  requiredMinAppVersion: string
  changeLog: string[]
}

export interface ModelUpdateCheckResponse {
  hasUpdate: boolean
  currentVersion: string
  latestVersion: string
  updateUrl?: string
  fileSize?: number
  requiredMinAppVersion?: string
  changeLog?: string[]
  isUpdateRequired?: boolean
}
