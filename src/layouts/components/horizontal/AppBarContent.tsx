// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown, {
  NotificationsType
} from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import ShortcutsDropdown, { ShortcutsType } from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

const notifications: NotificationsType[] = [
  {
    meta: 'Bugün',
    avatarColor: 'success',
    avatarText: 'OpCa',
    title: 'Yeni parazit analizi tamamlandı! 🔬',
    subtitle: 'Neosporosis tespit edildi - %87 güvenilirlik'
  },
  {
    meta: 'Dün',
    avatarColor: 'info',
    avatarText: 'MNIST',
    title: 'MNIST analizi başarılı 🔢',
    subtitle: 'Rakam 7 tespit edildi - %92 güvenilirlik'
  },
  {
    meta: '2 gün önce',
    avatarColor: 'warning',
    avatarText: 'Sistem',
    title: 'Model güncelleme mevcut 📊',
    subtitle: 'Parazit tanıma modeli v2.1 hazır'
  }
]

const shortcuts: ShortcutsType[] = [
  {
    title: 'OpCa Dashboard',
    url: '/opca/dashboard',
    icon: 'tabler:dashboard',
    subtitle: 'Ana Kontrol Paneli'
  },
  {
    title: 'Parazit Analizi',
    url: '/opca/analysis/parasite',
    icon: 'tabler:virus',
    subtitle: 'Parazit Tanıma'
  },
  {
    title: 'MNIST Analizi',
    icon: 'tabler:numbers',
    url: '/opca/analysis/mnist',
    subtitle: 'Rakam Tanıma'
  },
  {
    url: '/opca/analysis/list',
    icon: 'tabler:list',
    subtitle: 'Tüm Sonuçlar',
    title: 'Analiz Sonuçları'
  },
  {
    subtitle: 'Parazit Bilgileri',
    title: 'Parazit Yönetimi',
    url: '/opca/parasites',
    icon: 'tabler:microscope'
  },
  {
    title: 'Kullanıcı Yönetimi',
    icon: 'tabler:users',
    subtitle: 'Kullanıcı İşlemleri',
    url: '/opca/users'
  }
]

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings } = props

  // ** Hook
  const auth = useAuth()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
      <LanguageDropdown settings={settings} saveSettings={saveSettings} />
      <ModeToggler settings={settings} saveSettings={saveSettings} />
      {auth.user && (
        <>
          <ShortcutsDropdown settings={settings} shortcuts={shortcuts} />
          <NotificationDropdown settings={settings} notifications={notifications} />
          <UserDropdown settings={settings} />
        </>
      )}
    </Box>
  )
}

export default AppBarContent
