// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import PageHeader from 'src/@core/components/page-header'

// ** API Servisi
import { digitService } from 'src/services/api'

// Styled komponent
const DigitBox = styled(Paper)(({ theme }) => ({
  width: 150,
  height: 150,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.paper,
  fontSize: '4rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  margin: 'auto',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6]
  }
}))

const ExampleBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(2)
}))

const StyledCardMedia = styled(CardMedia)({
  height: 100,
  width: 100,
  objectFit: 'contain',
  borderRadius: 4,
  margin: '8px auto'
})

interface DigitData {
  value: number
  description: string
  examples?: Array<{
    imageUrl: string
    description: string
  }>
}

const DigitManagement = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [digits, setDigits] = useState<DigitData[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedDigit, setSelectedDigit] = useState<DigitData | null>(null)
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false)
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false)

  const [newDigit, setNewDigit] = useState<Partial<DigitData>>({
    value: 0,
    description: ''
  })

  // Menü açma/kapama
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, digit: DigitData) => {
    setAnchorEl(event.currentTarget)
    setSelectedDigit(digit)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Arama işlevi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // Dialog işlevleri
  const handleOpenAddDialog = () => {
    setNewDigit({
      value: 0,
      description: ''
    })
    setOpenAddDialog(true)
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)
  }

  const handleOpenDetailDialog = (digit: DigitData) => {
    setSelectedDigit(digit)
    setOpenDetailDialog(true)
  }

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDigit(prev => ({
      ...prev,
      [name]: name === 'value' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmitNewDigit = () => {
    // Form doğrulama
    if (newDigit.value === undefined || !newDigit.description) {
      return
    }

    // Yeni rakam ekle - mock servisle gerçekleşmeyecek
    console.log('Yeni rakam:', newDigit)

    // Dialog'u kapat
    setOpenAddDialog(false)

    // Gerçek API'de başarılı olursa listeyi güncelle
    // Burada gerçek API çağrısı olacak
  }

  // Veri çekme
  useEffect(() => {
    const fetchDigits = async () => {
      setLoading(true)
      try {
        const response = await digitService.getAllDigits()
        console.log('Rakamlar API Yanıtı:', response.data)

        // API dokümanına göre yanıt formatı: { success: true, digits: [...] }
        setDigits(response.data.digits || [])
      } catch (error) {
        console.error('Rakamlar yüklenirken hata oluştu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDigits()
  }, [])

  // Filtreleme
  const filteredDigits = digits.filter(digit => {
    if (!searchText) return true

    return (
      digit.value.toString().includes(searchText) || digit.description.toLowerCase().includes(searchText.toLowerCase())
    )
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title={<Typography variant='h5'>Rakam Yönetimi</Typography>}
          subtitle={<Typography variant='body2'>MNIST rakam türlerini görüntüleyin ve yönetin</Typography>}
        />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Rakam Türleri'
            action={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  size='small'
                  placeholder='Ara...'
                  value={searchText}
                  onChange={handleSearch}
                  sx={{ mr: 4, width: 200 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Icon icon='tabler:search' />
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<Icon icon='tabler:plus' />}
                  onClick={handleOpenAddDialog}
                >
                  Yeni Rakam Ekle
                </Button>
              </Box>
            }
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
              <Typography>Yükleniyor...</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 5 }}>
              <Grid container spacing={5}>
                {filteredDigits.map(digit => (
                  <Grid key={digit.value} item xs={12} sm={6} md={4} lg={3}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
                        <IconButton
                          size='small'
                          onClick={e => handleMenuClick(e, digit)}
                          sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                          <Icon icon='tabler:dots-vertical' />
                        </IconButton>

                        <DigitBox onClick={() => handleOpenDetailDialog(digit)}>{digit.value}</DigitBox>

                        <Typography variant='h6' sx={{ mt: 2 }}>
                          Rakam {digit.value}
                        </Typography>

                        <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                          {digit.description}
                        </Typography>

                        {digit.examples && digit.examples.length > 0 && (
                          <Typography variant='caption' color='text.disabled' sx={{ mt: 2, display: 'block' }}>
                            {digit.examples.length} örnek görüntü
                          </Typography>
                        )}
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant='outlined'
                          size='small'
                          fullWidth
                          onClick={() => handleOpenDetailDialog(digit)}
                          startIcon={<Icon icon='tabler:eye' />}
                        >
                          Detayları Gör
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}

                {filteredDigits.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                      <Typography>Rakam bulunamadı</Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Card>
      </Grid>

      {/* İşlem Menüsü */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleOpenDetailDialog(selectedDigit!)
            handleMenuClose()
          }}
        >
          <Icon icon='tabler:eye' fontSize={20} style={{ marginRight: 8 }} />
          Görüntüle
        </MenuItem>
        <MenuItem component={Link} href={`/opca/digits/edit/${selectedDigit?.value}`} onClick={handleMenuClose}>
          <Icon icon='tabler:edit' fontSize={20} style={{ marginRight: 8 }} />
          Düzenle
        </MenuItem>
      </Menu>

      {/* Rakam Detay Dialog */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth='sm' fullWidth>
        <DialogTitle>
          Rakam {selectedDigit?.value} Detayları
          <IconButton
            aria-label='close'
            onClick={handleCloseDetailDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedDigit && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <DigitBox sx={{ width: 200, height: 200, fontSize: '6rem' }}>{selectedDigit.value}</DigitBox>
              </Box>

              <Typography variant='h6'>Açıklama</Typography>
              <Typography variant='body2' paragraph>
                {selectedDigit.description}
              </Typography>

              {selectedDigit.examples && selectedDigit.examples.length > 0 && (
                <>
                  <Typography variant='h6' sx={{ mt: 3, mb: 2 }}>
                    Örnek Görüntüler
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedDigit.examples.map((example, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <ExampleBox>
                          <StyledCardMedia
                            image={
                              example.imageUrl ||
                              `https://via.placeholder.com/100x100/145DA0/FFFFFF?text=${selectedDigit.value}`
                            }
                          />
                          <Typography variant='caption' align='center'>
                            {example.description}
                          </Typography>
                        </ExampleBox>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color='primary'>
            Kapat
          </Button>
          <Button
            variant='contained'
            component={Link}
            href={`/opca/digits/edit/${selectedDigit?.value}`}
            onClick={handleCloseDetailDialog}
          >
            Düzenle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Yeni Rakam Ekleme Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth='sm' fullWidth>
        <DialogTitle>Yeni Rakam Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor='digit-value'>Rakam Değeri</InputLabel>
              <OutlinedInput
                id='digit-value'
                name='value'
                label='Rakam Değeri'
                type='number'
                value={newDigit.value}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 9 }}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='digit-description'>Açıklama</InputLabel>
              <OutlinedInput
                id='digit-description'
                name='description'
                label='Açıklama'
                value={newDigit.description}
                onChange={handleInputChange}
                placeholder='Rakam hakkında açıklama...'
                multiline
                rows={4}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color='secondary'>
            İptal
          </Button>
          <Button onClick={handleSubmitNewDigit} variant='contained'>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

// ACL yapılandırması - Admin ve kullanıcıların erişmesine izin ver
DigitManagement.acl = {
  action: 'read',
  subject: 'opca-digits'
}

export default DigitManagement
