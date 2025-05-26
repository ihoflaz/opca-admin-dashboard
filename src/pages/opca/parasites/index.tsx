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
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import PageHeader from 'src/@core/components/page-header'

// ** API Servisi
import { parasiteService } from 'src/services/api'

// Styled komponent
const StyledCardMedia = styled(CardMedia)({
  height: 200,
  objectFit: 'cover',
  borderRadius: '4px 4px 0 0'
})

interface ParasiteType {
  type: string
  name: string
  description: string
  treatment?: string
  preventionMeasures?: string[]
  imageUrls?: string[]
  examples?: Array<{
    imageUrl: string
    description: string
  }>
}

const ParasiteManagement = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [parasites, setParasites] = useState<ParasiteType[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedParasite, setSelectedParasite] = useState<ParasiteType | null>(null)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [newParasite, setNewParasite] = useState<Partial<ParasiteType>>({
    type: '',
    name: '',
    description: ''
  })

  // Menü açma/kapama
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, parasite: ParasiteType) => {
    setAnchorEl(event.currentTarget)
    setSelectedParasite(parasite)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Arama işlevi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // Dialog işlevleri
  const handleOpenNewDialog = () => {
    setNewParasite({
      type: '',
      name: '',
      description: ''
    })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewParasite(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitNewParasite = () => {
    // Form doğrulama
    if (!newParasite.type || !newParasite.name || !newParasite.description) {
      return
    }

    // Yeni parazit ekle - mock servisle gerçekleşmeyecek
    console.log('Yeni parazit:', newParasite)

    // Dialog'u kapat
    setOpenDialog(false)

    // Gerçek API'de başarılı olursa listeyi güncelle
    // Burada gerçek API çağrısı olacak
  }

  // Veri çekme
  useEffect(() => {
    const fetchParasites = async () => {
      setLoading(true)
      try {
        const response = await parasiteService.getAllParasites()
        console.log('Parazitler API Yanıtı:', response.data)

        // API dokümanına göre yanıt formatı: { success: true, parasites: [...] }
        setParasites(response.data.parasites || [])
      } catch (error) {
        console.error('Parazitler yüklenirken hata oluştu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchParasites()
  }, [])

  // Filtreleme
  const filteredParasites = parasites.filter(parasite => {
    if (!searchText) return true

    return (
      parasite.type.toLowerCase().includes(searchText.toLowerCase()) ||
      parasite.name.toLowerCase().includes(searchText.toLowerCase()) ||
      parasite.description.toLowerCase().includes(searchText.toLowerCase())
    )
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title={<Typography variant='h5'>Parazit Yönetimi</Typography>}
          subtitle={<Typography variant='body2'>Parazit türlerini görüntüleyin ve yönetin</Typography>}
        />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Parazit Türleri'
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
                  onClick={handleOpenNewDialog}
                >
                  Yeni Parazit Ekle
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
                {filteredParasites.map(parasite => (
                  <Grid key={parasite.type} item xs={12} sm={6} md={4}>
                    <Card>
                      <StyledCardMedia
                        image={
                          parasite.imageUrls?.[0] ||
                          'https://via.placeholder.com/400x200/145DA0/FFFFFF?text=Parazit+G%C3%B6rseli'
                        }
                        title={parasite.name}
                      />
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant='h6' component='div'>
                            {parasite.name}
                          </Typography>
                          <IconButton size='small' onClick={e => handleMenuClick(e, parasite)}>
                            <Icon icon='tabler:dots-vertical' />
                          </IconButton>
                        </Box>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            mb: 2
                          }}
                        >
                          {parasite.description}
                        </Typography>
                        <Typography variant='caption' color='text.disabled'>
                          Tür: {parasite.type}
                        </Typography>
                      </CardContent>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Button
                          variant='outlined'
                          size='small'
                          component={Link}
                          href={`/opca/parasites/${parasite.type}`}
                          fullWidth
                          startIcon={<Icon icon='tabler:eye' />}
                        >
                          Detayları Gör
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}

                {filteredParasites.length === 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                      <Typography>Parazit bulunamadı</Typography>
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
        <MenuItem component={Link} href={`/opca/parasites/${selectedParasite?.type}`} onClick={handleMenuClose}>
          <Icon icon='tabler:eye' style={{ marginRight: 8 }} />
          Görüntüle
        </MenuItem>
        <MenuItem component={Link} href={`/opca/parasites/edit/${selectedParasite?.type}`} onClick={handleMenuClose}>
          <Icon icon='tabler:edit' style={{ marginRight: 8 }} />
          Düzenle
        </MenuItem>
      </Menu>

      {/* Yeni Parazit Ekleme Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='sm' fullWidth>
        <DialogTitle>Yeni Parazit Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel htmlFor='parasite-type'>Tür Kodu</InputLabel>
              <OutlinedInput
                id='parasite-type'
                name='type'
                label='Tür Kodu'
                value={newParasite.type}
                onChange={handleInputChange}
                placeholder='Örn: Neosporosis'
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='parasite-name'>Parazit Adı</InputLabel>
              <OutlinedInput
                id='parasite-name'
                name='name'
                label='Parazit Adı'
                value={newParasite.name}
                onChange={handleInputChange}
                placeholder='Örn: Neospora caninum'
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor='parasite-description'>Açıklama</InputLabel>
              <OutlinedInput
                id='parasite-description'
                name='description'
                label='Açıklama'
                value={newParasite.description}
                onChange={handleInputChange}
                placeholder='Parazit hakkında genel bilgi...'
                multiline
                rows={4}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            İptal
          </Button>
          <Button onClick={handleSubmitNewParasite} variant='contained'>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

// ACL yapılandırması - Admin ve kullanıcıların erişmesine izin ver
ParasiteManagement.acl = {
  action: 'read',
  subject: 'opca-parasites'
}

export default ParasiteManagement
