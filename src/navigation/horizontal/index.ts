// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {
  return [
    {
      title: 'OpCa Dashboard',
      path: '/opca/dashboard',
      icon: 'tabler:dashboard'
    },
    {
      title: 'Analiz Sonuçları',
      icon: 'tabler:microscope',
      children: [
        {
          title: 'Tüm Analizler',
          path: '/opca/analysis/list'
        },
        {
          title: 'Parazit Analizleri',
          path: '/opca/analysis/parasite'
        },
        {
          title: 'MNIST Analizleri',
          path: '/opca/analysis/mnist'
        },
        {
          title: 'Toplu Yükleme',
          path: '/opca/analysis/batch-upload'
        },
        {
          title: 'Admin - Tüm Analizler',
          path: '/opca/analysis/admin'
        }
      ]
    },
    {
      title: 'Dosya Yönetimi',
      icon: 'tabler:upload',
      children: [
        {
          title: 'Dosya Yükleme',
          path: '/opca/upload'
        }
      ]
    },
    {
      title: 'Model Yönetimi',
      path: '/opca/models',
      icon: 'tabler:cpu'
    },
    {
      title: 'Parazit Yönetimi',
      icon: 'tabler:virus',
      path: '/opca/parasites'
    },
    {
      title: 'Rakam Yönetimi',
      icon: 'tabler:numbers',
      path: '/opca/digits'
    },
    {
      title: 'Kullanıcı Yönetimi',
      path: '/opca/users',
      icon: 'tabler:users'
    }
  ]
}

export default navigation
