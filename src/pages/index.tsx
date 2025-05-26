// ** Next Import
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'

const Home = () => {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    // Kullanıcı giriş yapmış mı kontrolü
    if (!auth.user) {
      // Giriş yapmamışsa login sayfasına yönlendir
      router.replace('/auth/login')

      return
    }

    // Tüm kullanıcıları OpCa Dashboard'a yönlendir
    router.replace('/opca/dashboard')
  }, [router, auth.user])

  return <>Ana Sayfaya Hoşgeldiniz - Yönlendiriliyor...</>
}

export default Home
