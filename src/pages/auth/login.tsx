// ** React Imports
import { useState, ChangeEvent, ReactNode, MouseEvent, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hook Import
import { useAuth } from 'src/hooks/useAuth'

// ** Config Import
import { API_BASE_URL } from 'src/configs/api'

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

interface State {
  email: string
  password: string
  showPassword: boolean
}

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    email: '',
    password: '',
    showPassword: false
  })
  const [rememberMe, setRememberMe] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  // ** Başarılı login sonrası otomatik yönlendirme
  useEffect(() => {
    // Kullanıcı login olmuş ve sayfa yeniden yüklenmiş olabilir
    if (auth.user && !auth.loading) {
      console.log('🔔 Kullanıcı zaten giriş yapmış, ana sayfaya yönlendiriliyor')
      router.replace('/opca/dashboard')
    }
  }, [auth.user, auth.loading, router])

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!values.email || !values.password) {
      setError('E-posta ve şifre alanları boş bırakılamaz')

      return
    }

    try {
      console.log('API isteği gönderiliyor:', `${API_BASE_URL}/api/auth/login`)

      // Auth context ile login işlemi
      auth.login(
        {
          email: values.email,
          password: values.password,
          rememberMe: rememberMe
        },
        err => {
          console.error('Login hatası:', err)

          if (err.response) {
            // Sunucu yanıtı ile gelen hata
            console.error('API hata yanıtı:', err.response.status, err.response.data)

            // TypeScript hatasını düzeltme - data nesnesinin yapısını güvenli şekilde kontrol ediyoruz
            const responseData = err.response.data as any
            setError(responseData?.message || `Hata kodu: ${err.response.status}. Giriş yapılamadı.`)
          } else if (err.request) {
            // İstek yapıldı ama yanıt alınamadı
            console.error('API yanıt vermedi')
            setError(`API bağlantısı kurulamadı. Lütfen API servisinin çalıştığından emin olun. (${API_BASE_URL})`)
          } else {
            // İstek yapılamadı
            console.error('İstek yapılamadı:', err.message)
            setError(`İstek oluşturulamadı: ${err.message}`)
          }
        }
      )

      // Login başarılı olup 1 saniye sonra yönlendirme kontrolü
      setTimeout(() => {
        if (auth.user && !error) {
          console.log('🔔 Login başarılı, ana sayfaya manuel yönlendirme yapılıyor')
          setLoginSuccess(true) // Başarılı login durumunu işaretle

          // Kullanıcı rolüne göre yönlendirme
          if (auth.user.role === 'admin') {
            router.replace('/opca/dashboard')
          } else {
            router.replace('/opca/dashboard')
          }
        }
      }, 1000)
    } catch (err: any) {
      console.error('Beklenmeyen hata:', err)
      setError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyiniz.')
    }
  }

  // Başarılı login sonrası yükleniyor ekranı
  if (loginSuccess) {
    return (
      <Box className='content-center'>
        <Card sx={{ zIndex: 1 }}>
          <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography
                variant='h6'
                sx={{
                  ml: 3,
                  lineHeight: 1,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '1.5rem !important'
                }}
              >
                OpCa Veteriner Tanı Sistemi
              </Typography>
            </Box>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5, color: 'success.main' }}>
                Giriş Başarılı! 🎉
              </Typography>
              <Typography variant='body2'>Ana sayfaya yönlendiriliyorsunuz...</Typography>
              <CircularProgress sx={{ mt: 4 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              OpCa Veteriner Tanı Sistemi
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Hoşgeldiniz! 👋
            </Typography>
            <Typography variant='body2'>Lütfen hesabınıza giriş yapın</Typography>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
            <TextField
              autoFocus
              fullWidth
              id='email'
              label='E-posta'
              value={values.email}
              onChange={handleChange('email')}
              sx={{ marginBottom: 4 }}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Şifre</InputLabel>
              <OutlinedInput
                label='Şifre'
                id='auth-login-password'
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='şifreyi göster/gizle'
                    >
                      <Icon icon={values.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Box
              sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
            >
              <FormControlLabel
                control={<Checkbox checked={rememberMe} onChange={handleRememberMeChange} />}
                label='Beni hatırla'
              />
              <Link passHref href='/auth/forgot-password'>
                <Typography component='span' variant='body2' sx={{ color: 'primary.main', cursor: 'pointer' }}>
                  Şifremi unuttum
                </Typography>
              </Link>
            </Box>
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7 }}
              type='submit'
              disabled={auth.loading}
            >
              {auth.loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Hesabınız yok mu?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/auth/register'>
                  <Typography component='span' variant='body2' sx={{ color: 'primary.main', cursor: 'pointer' }}>
                    Hemen kaydolun
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

// GuestGuard sayfasını belirt
LoginPage.guestGuard = true

export default LoginPage
