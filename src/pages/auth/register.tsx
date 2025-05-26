// ** React Imports
import { useState, ChangeEvent, ReactNode, MouseEvent } from 'react'
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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Service Imports
import { authService } from 'src/services/api'

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
  fullName: string
  email: string
  password: string
  confirmPassword: string
  role: string
  showPassword: boolean
  showConfirmPassword: boolean
}

const RegisterPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    showPassword: false,
    showConfirmPassword: false
  })
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  // ** Router
  const router = useRouter()

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleClickShowConfirmPassword = () => {
    setValues({ ...values, showConfirmPassword: !values.showConfirmPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleTermsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(event.target.checked)
  }

  const validateForm = () => {
    // Basit doğrulama kontrolleri
    if (!values.fullName.trim()) {
      setError('Lütfen ad soyad giriniz')

      return false
    }

    if (!values.email.trim() || !/\S+@\S+\.\S+/.test(values.email)) {
      setError('Lütfen geçerli bir e-posta adresi giriniz')

      return false
    }

    if (!values.password.trim() || values.password.length < 6) {
      setError('Şifre en az 6 karakter uzunluğunda olmalıdır')

      return false
    }

    if (values.password !== values.confirmPassword) {
      setError('Şifreler eşleşmiyor')

      return false
    }

    if (!termsAccepted) {
      setError('Kullanım koşullarını kabul etmelisiniz')

      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log('API kayıt isteği gönderiliyor:', `${API_BASE_URL}/api/auth/register`)

      const userData = {
        name: values.fullName, // API dokümanına göre 'name' alanı kullanılıyor
        email: values.email,
        password: values.password,
        role: values.role
      }

      const response = await authService.register(userData)
      console.log('API kayıt yanıtı:', response.status)

      setSuccess(true)

      // 2 saniye sonra giriş sayfasına yönlendir
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err: any) {
      console.error('Kayıt hatası:', err)

      if (err.response) {
        // Sunucu yanıtı ile gelen hata
        console.error('API hata yanıtı:', err.response.status, err.response.data)

        if (err.response.status === 409) {
          setError('Bu e-posta adresi zaten kullanılıyor')
        } else {
          setError(err.response.data?.message || `Hata kodu: ${err.response.status}. Kayıt yapılamadı.`)
        }
      } else if (err.request) {
        // İstek yapıldı ama yanıt alınamadı
        console.error('API yanıt vermedi')
        setError(`API bağlantısı kurulamadı. Lütfen API servisinin çalıştığından emin olun. (${API_BASE_URL})`)
      } else {
        // İstek yapılamadı
        console.error('İstek yapılamadı:', err.message)
        setError(`İstek oluşturulamadı: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
                Kayıt Başarılı! 🎉
              </Typography>
              <Typography variant='body2'>
                Hesabınız başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...
              </Typography>
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
              OpCa Veteriner Tanı
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Yeni Hesap Oluştur 🚀
            </Typography>
            <Typography variant='body2'>Kayıt olmak kolay, sadece birkaç adım</Typography>
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
              id='fullName'
              label='Ad Soyad'
              value={values.fullName}
              onChange={handleChange('fullName')}
              sx={{ marginBottom: 4 }}
            />
            <TextField
              fullWidth
              id='email'
              label='E-posta'
              type='email'
              value={values.email}
              onChange={handleChange('email')}
              sx={{ marginBottom: 4 }}
            />
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel htmlFor='auth-register-password'>Şifre</InputLabel>
              <OutlinedInput
                label='Şifre'
                id='auth-register-password'
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
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel htmlFor='auth-register-confirm-password'>Şifre Tekrar</InputLabel>
              <OutlinedInput
                label='Şifre Tekrar'
                id='auth-register-confirm-password'
                type={values.showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='şifreyi göster/gizle'
                    >
                      <Icon icon={values.showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 4 }}>
              <InputLabel id='role-select-label'>Rol</InputLabel>
              <Select
                labelId='role-select-label'
                id='role-select'
                value={values.role}
                label='Rol'
                onChange={e => setValues({ ...values, role: e.target.value as string })}
              >
                <MenuItem value='user'>Kullanıcı</MenuItem>
                <MenuItem value='editor'>Editör</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox checked={termsAccepted} onChange={handleTermsChange} />}
              label={
                <Typography variant='body2'>
                  <span>Kabul ediyorum </span>
                  <Link href='/pages/terms-of-service'>
                    <Typography component='span' variant='body2' sx={{ color: 'primary.main', cursor: 'pointer' }}>
                      kullanım koşulları
                    </Typography>
                  </Link>
                  <span> ve </span>
                  <Link href='/pages/privacy-policy'>
                    <Typography component='span' variant='body2' sx={{ color: 'primary.main', cursor: 'pointer' }}>
                      gizlilik politikası
                    </Typography>
                  </Link>
                </Typography>
              }
            />
            <Button
              fullWidth
              size='large'
              variant='contained'
              sx={{ marginBottom: 7, mt: 4 }}
              type='submit'
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Kayıt Ol'}
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
                Zaten hesabınız var mı?
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/auth/login'>
                  <Typography component='span' variant='body2' sx={{ color: 'primary.main', cursor: 'pointer' }}>
                    Giriş yapın
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

RegisterPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
