// ** Mock API servisi
// ** Bu servis gerçek API çalışmadığında kullanılır

// ** JWT için gerekli bağımlılıklar
import { saveToken, saveRefreshToken, saveUserData } from 'src/utils/jwt'

// ** Mock kullanıcı verisi
const mockUsers = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'Admin123!',
    fullName: 'Admin Kullanıcı',
    role: 'admin',
    username: 'admin'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'User123!',
    fullName: 'Test Kullanıcı',
    role: 'user',
    username: 'user'
  }
]

// ** Mock parazit verisi
const mockParasites = [
  {
    type: 'Neosporosis',
    name: 'Neospora caninum',
    description: 'Neospora caninum, tek hücreli bir parazittir ve sığırlarda yavru atmaya sebep olur.',
    treatment: 'Spesifik bir tedavi bulunmamaktadır, ancak bazı ilaçlar kullanılabilir.',
    preventionMeasures: [
      'Köpeklerle teması sınırlandırma',
      'Yem ve su kaynaklarını koruma',
      'Ölü doğan buzağıları uygun şekilde imha etme'
    ],
    imageUrls: ['https://via.placeholder.com/400x200/176bb0/FFFFFF?text=Neospora+caninum'],
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/200x200/176bb0/FFFFFF?text=Neospora+Example',
        description: 'Mikroskop altında Neospora caninum kisti'
      }
    ]
  },
  {
    type: 'Echinococcosis',
    name: 'Echinococcus granulosus',
    description: 'Echinococcus granulosus, kist hidatik hastalığına neden olan bir tenya türüdür.',
    treatment: 'Cerrahi müdahale ve ilaç tedavisi gereklidir.',
    preventionMeasures: ['Köpeklere çiğ et vermekten kaçınma', 'El yıkama', 'Sebze ve meyveleri iyice yıkama'],
    imageUrls: ['https://via.placeholder.com/400x200/1ea896/FFFFFF?text=Echinococcus'],
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/200x200/1ea896/FFFFFF?text=Echinococcus+Example',
        description: 'Echinococcus granulosus yumurtaları'
      }
    ]
  },
  {
    type: 'Toxoplasmosis',
    name: 'Toxoplasma gondii',
    description: 'Toxoplasma gondii, dünya çapında yaygın olan bir parazittir ve birçok hayvan türünü etkileyebilir.',
    treatment: 'Antibiyotik tedavisi uygulanabilir.',
    preventionMeasures: [
      'Çiğ et tüketiminden kaçınma',
      'Kedi dışkısı ile temastan kaçınma',
      'Gıda hijyenine dikkat etme'
    ],
    imageUrls: ['https://via.placeholder.com/400x200/bf1363/FFFFFF?text=Toxoplasma'],
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/200x200/bf1363/FFFFFF?text=Toxoplasma+Example',
        description: 'Toxoplasma gondii takizoitleri'
      }
    ]
  }
]

// ** Mock rakam verisi
const mockDigits = [
  {
    value: 0,
    description: 'Sıfır rakamı, bir daire şeklinde yazılır ve matematik sisteminde yokluğu temsil eder.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/0D3B66/FFFFFF?text=0',
        description: 'Klasik el yazısı sıfır'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/0D3B66/FFFFFF?text=0',
        description: 'Dijital göstergede sıfır'
      }
    ]
  },
  {
    value: 1,
    description:
      'Bir rakamı, genellikle dikey bir çizgi olarak yazılır ve matematikteki temel birim değeri temsil eder.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/FAF0CA/000000?text=1',
        description: 'Klasik el yazısı bir'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/FAF0CA/000000?text=1',
        description: 'Dijital göstergede bir'
      }
    ]
  },
  {
    value: 2,
    description: 'İki rakamı, bir eğri ve bir çizgiden oluşur ve ikili sayı sisteminde kullanılan en yüksek değerdir.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/F4D35E/000000?text=2',
        description: 'Klasik el yazısı iki'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/F4D35E/000000?text=2',
        description: 'Dijital göstergede iki'
      }
    ]
  },
  {
    value: 3,
    description: 'Üç rakamı, iki yarım daireden oluşur ve matematikteki üçlü grupları temsil eder.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/EE964B/FFFFFF?text=3',
        description: 'Klasik el yazısı üç'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/EE964B/FFFFFF?text=3',
        description: 'Dijital göstergede üç'
      }
    ]
  },
  {
    value: 4,
    description: 'Dört rakamı, iki çizginin kesişmesiyle oluşur ve matematikteki kare sayıları temsil eder.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/F95738/FFFFFF?text=4',
        description: 'Klasik el yazısı dört'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/F95738/FFFFFF?text=4',
        description: 'Dijital göstergede dört'
      }
    ]
  },
  {
    value: 5,
    description: 'Beş rakamı, bir eğri ve bir köşeden oluşur ve ondalık sayı sisteminin yarısını temsil eder.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/0D3B66/FFFFFF?text=5',
        description: 'Klasik el yazısı beş'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/0D3B66/FFFFFF?text=5',
        description: 'Dijital göstergede beş'
      }
    ]
  },
  {
    value: 6,
    description: 'Altı rakamı, bir daire ve bir eğriden oluşur ve matematikteki mükemmel sayıların ilkidir.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/FAF0CA/000000?text=6',
        description: 'Klasik el yazısı altı'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/FAF0CA/000000?text=6',
        description: 'Dijital göstergede altı'
      }
    ]
  },
  {
    value: 7,
    description:
      'Yedi rakamı, genellikle iki çizgiden oluşur ve birçok kültürde şans getiren sayı olarak kabul edilir.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/F4D35E/000000?text=7',
        description: 'Klasik el yazısı yedi'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/F4D35E/000000?text=7',
        description: 'Dijital göstergede yedi'
      }
    ]
  },
  {
    value: 8,
    description: 'Sekiz rakamı, iki dairenin birleşmesiyle oluşur ve yatay döndürüldüğünde sonsuzluk sembolüne benzer.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/EE964B/FFFFFF?text=8',
        description: 'Klasik el yazısı sekiz'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/EE964B/FFFFFF?text=8',
        description: 'Dijital göstergede sekiz'
      }
    ]
  },
  {
    value: 9,
    description: 'Dokuz rakamı, bir daire ve bir çizgiden oluşur ve ondalık sayı sistemindeki son rakamdır.',
    examples: [
      {
        imageUrl: 'https://via.placeholder.com/100x100/F95738/FFFFFF?text=9',
        description: 'Klasik el yazısı dokuz'
      },
      {
        imageUrl: 'https://via.placeholder.com/100x100/F95738/FFFFFF?text=9',
        description: 'Dijital göstergede dokuz'
      }
    ]
  }
]

// ** Mock analiz verisi
const mockAnalyses = [
  // Parazit analizleri
  {
    id: 'pa001',
    type: 'Parasite',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 gün önce
    results: [
      { type: 'Neosporosis', confidence: 0.82 },
      { type: 'Echinococcosis', confidence: 0.12 },
      { type: 'Toxoplasmosis', confidence: 0.06 }
    ],
    imageUrl: 'https://via.placeholder.com/300x300/176bb0/FFFFFF?text=Parazit+Analizi+1',
    processingTimeMs: 320,
    location: 'Ankara, Türkiye',
    notes: 'Sığır örneği analizi',
    modelName: 'parasite-mobilenet',
    modelVersion: '1.0.0',
    deviceInfo: 'Android 13 / Samsung Galaxy S22'
  },
  {
    id: 'pa002',
    type: 'Parasite',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 gün önce
    results: [
      { type: 'Toxoplasmosis', confidence: 0.75 },
      { type: 'Neosporosis', confidence: 0.2 },
      { type: 'Echinococcosis', confidence: 0.05 }
    ],
    imageUrl: 'https://via.placeholder.com/300x300/bf1363/FFFFFF?text=Parazit+Analizi+2',
    processingTimeMs: 280,
    location: 'İzmir, Türkiye',
    notes: 'Kedi örneği analizi',
    modelName: 'parasite-mobilenet',
    modelVersion: '1.0.0',
    deviceInfo: 'iOS 16.5 / iPhone 14 Pro'
  },
  {
    id: 'pa003',
    type: 'Parasite',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 saat önce
    results: [
      { type: 'Echinococcosis', confidence: 0.68 },
      { type: 'Neosporosis', confidence: 0.22 },
      { type: 'Toxoplasmosis', confidence: 0.1 }
    ],
    imageUrl: 'https://via.placeholder.com/300x300/1ea896/FFFFFF?text=Parazit+Analizi+3',
    processingTimeMs: 310,
    location: 'Antalya, Türkiye',
    notes: 'Köpek örneği analizi',
    modelName: 'parasite-mobilenet',
    modelVersion: '1.0.0',
    deviceInfo: 'Android 12 / Xiaomi Mi 11'
  },

  // MNIST analizleri
  {
    id: 'mn001',
    type: 'MNIST',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 gün önce
    results: [
      { value: 5, confidence: 0.92 },
      { value: 3, confidence: 0.05 },
      { value: 8, confidence: 0.03 }
    ],
    imageUrl: 'https://via.placeholder.com/300x300/0D3B66/FFFFFF?text=MNIST+Analizi+1',
    processingTimeMs: 150,
    notes: 'El yazısı rakam testi',
    modelName: 'mnist-convnet',
    modelVersion: '1.0.0',
    deviceInfo: 'Android 13 / Samsung Galaxy S22'
  },
  {
    id: 'mn002',
    type: 'MNIST',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 gün önce
    results: [
      { value: 7, confidence: 0.85 },
      { value: 1, confidence: 0.1 },
      { value: 4, confidence: 0.05 }
    ],
    imageUrl: 'https://via.placeholder.com/300x300/F4D35E/000000?text=MNIST+Analizi+2',
    processingTimeMs: 130,
    notes: 'Basılı rakam testi',
    modelName: 'mnist-convnet',
    modelVersion: '1.0.0',
    deviceInfo: 'iOS 16.5 / iPhone 14 Pro'
  },
  {
    id: 'mn003',
    type: 'MNIST',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 saat önce
    results: [
      { value: 2, confidence: 0.78 },
      { value: 7, confidence: 0.12 },
      { value: 9, confidence: 0.1 }
    ],
    imageUrl: 'https://via.placeholder.com/300x300/F95738/FFFFFF?text=MNIST+Analizi+3',
    processingTimeMs: 145,
    notes: 'Kamera görüntüsünden rakam testi',
    modelName: 'mnist-convnet',
    modelVersion: '1.0.0',
    deviceInfo: 'Android 12 / Xiaomi Mi 11'
  }
]

// ** Mock token oluşturucu
const generateToken = (user: any) => {
  // Gerçek bir JWT token üretimi yapmıyoruz, sadece mock
  return `mock_token_${user.id}_${Date.now()}`
}

// ** Mock refresh token oluşturucu
const generateRefreshToken = (user: any) => {
  return `mock_refresh_token_${user.id}_${Date.now()}`
}

// ** Auth servisi
export const mockAuthService = {
  login: async (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      // Kullanıcıyı bul
      const user = mockUsers.find(u => u.email === email && u.password === password)

      if (user) {
        // Token oluştur
        const accessToken = generateToken(user)
        const refreshToken = generateRefreshToken(user)

        // Token ve kullanıcı bilgilerini kaydet
        saveToken(accessToken)
        saveRefreshToken(refreshToken)

        // Kullanıcı parolasını çıkar
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userData } = user

        saveUserData(userData)

        // Başarılı yanıt
        setTimeout(() => {
          resolve({
            data: {
              accessToken,
              refreshToken,
              userData
            }
          })
        }, 1000)
      } else {
        // Hatalı giriş
        setTimeout(() => {
          reject(new Error('Email veya şifre hatalı'))
        }, 1000)
      }
    })
  },

  refreshToken: async (token: string) => {
    return new Promise((resolve, reject) => {
      // Gerçek bir yenileme yapmıyoruz, sadece mock
      if (token && token.startsWith('mock_refresh_token_')) {
        const userId = parseInt(token.split('_')[2])
        const user = mockUsers.find(u => u.id === userId)

        if (user) {
          const accessToken = generateToken(user)

          // Yeni token oluştur
          setTimeout(() => {
            resolve({
              data: {
                accessToken
              }
            })
          }, 1000)
        } else {
          setTimeout(() => {
            reject(new Error('Geçersiz token'))
          }, 1000)
        }
      } else {
        setTimeout(() => {
          reject(new Error('Geçersiz token'))
        }, 1000)
      }
    })
  }
}

// ** Parazit servisi
export const mockParasiteService = {
  getAllParasites: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: mockParasites
        })
      }, 800)
    })
  },

  getParasiteByType: async (type: string) => {
    return new Promise((resolve, reject) => {
      const parasite = mockParasites.find(p => p.type === type)

      if (parasite) {
        setTimeout(() => {
          resolve({
            data: parasite
          })
        }, 500)
      } else {
        setTimeout(() => {
          reject(new Error('Parazit bulunamadı'))
        }, 500)
      }
    })
  }
}

// ** Rakam servisi
export const mockDigitsService = {
  getAllDigits: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: mockDigits
        })
      }, 800)
    })
  },

  getDigitByValue: async (value: number) => {
    return new Promise((resolve, reject) => {
      const digit = mockDigits.find(d => d.value === value)

      if (digit) {
        setTimeout(() => {
          resolve({
            data: digit
          })
        }, 500)
      } else {
        setTimeout(() => {
          reject(new Error('Rakam bulunamadı'))
        }, 500)
      }
    })
  }
}

// ** Analiz servisi
export const mockAnalysisService = {
  getAnalyses: async (page = 1, limit = 10, type?: string) => {
    return new Promise(resolve => {
      let filteredAnalyses = [...mockAnalyses]

      // Türe göre filtrele
      if (type && type !== 'all') {
        filteredAnalyses = filteredAnalyses.filter(a => a.type === type)
      }

      // Tarihe göre sırala (yeniden eskiye)
      filteredAnalyses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      // Sayfalama
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const paginatedAnalyses = filteredAnalyses.slice(startIndex, endIndex)

      setTimeout(() => {
        resolve({
          data: {
            items: paginatedAnalyses,
            total: filteredAnalyses.length,
            page,
            limit,
            totalPages: Math.ceil(filteredAnalyses.length / limit)
          }
        })
      }, 800)
    })
  },

  getAnalysisById: async (id: string) => {
    return new Promise((resolve, reject) => {
      const analysis = mockAnalyses.find(a => a.id === id)

      if (analysis) {
        setTimeout(() => {
          resolve({
            data: analysis
          })
        }, 500)
      } else {
        setTimeout(() => {
          reject(new Error('Analiz bulunamadı'))
        }, 500)
      }
    })
  }
}

export default {
  authService: mockAuthService,
  parasiteService: mockParasiteService,
  analysisService: mockAnalysisService
}
