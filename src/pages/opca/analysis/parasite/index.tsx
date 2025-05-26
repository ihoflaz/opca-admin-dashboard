// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import PageHeader from 'src/@core/components/page-header'
import CustomChip from 'src/@core/components/mui/chip'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** API Servisi
import { analysisService, parasiteService } from 'src/services/api'

// Styled komponent
const StyledCardMedia = styled(CardMedia)({
  height: 140,
  objectFit: 'cover',
  borderRadius: '4px 4px 0 0'
})

interface AnalysisData {
  id?: string
  analysisId?: string
  _id?: string
  type?: string
  analysisType?: string
  createdAt?: string
  timestamp?: string
  results?: Array<{
    type: string
    confidence: number
  }>
  dominantResult?: {
    type: string
    confidence: number
  }
  imageUrl: string
  processingTimeMs?: number
  location?: string
  notes?: string
  modelName?: string
  modelVersion?: string
  deviceInfo?: string
}

interface ParasiteType {
  type: string
  name: string
  description: string
}

interface CellType {
  row: AnalysisData
}

// ** Confidence skoruna göre renk belirleme
const getConfidenceColor = (confidence: number): ThemeColor => {
  if (confidence >= 0.75) return 'success'
  if (confidence >= 0.5) return 'warning'

  return 'error'
}

const ParasiteAnalysisList = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [analyses, setAnalyses] = useState<AnalysisData[]>([])
  const [parasites, setParasites] = useState<ParasiteType[]>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [searchText, setSearchText] = useState<string>('')

  // Arama işlevi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // Veri çekme
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Parazit analizlerini getir
        const analysesResponse = await analysisService.getAnalyses(1, 100, 'Parasite')
        console.log('Parazit Analizleri API Yanıtı:', analysesResponse.data)

        // API dokümanına göre yanıt formatı: { success: true, analyses: [...] }
        const analysesData = analysesResponse.data.analyses || []
        setAnalyses(analysesData)

        // Parazit türlerini getir
        const parasitesResponse = await parasiteService.getAllParasites()
        console.log('Parazitler API Yanıtı:', parasitesResponse.data)

        // API dokümanına göre yanıt formatı: { success: true, parasites: [...] }
        const parasitesData = parasitesResponse.data.parasites || []
        setParasites(parasitesData)
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtreleme
  const filteredAnalyses = analyses.filter(analysis => {
    if (!searchText) return true

    // Güvenli string kontrolü
    const analysisId = analysis.id || analysis.analysisId || analysis._id || ''
    const analysisNotes = analysis.notes || ''

    // Analiz ID'sinde veya notlarda arama
    const basicSearch =
      analysisId.toLowerCase().includes(searchText.toLowerCase()) ||
      analysisNotes.toLowerCase().includes(searchText.toLowerCase())

    // Parazit adında arama
    const parasiteSearch =
      analysis.results?.some(result => result.type.toLowerCase().includes(searchText.toLowerCase())) ||
      analysis.dominantResult?.type.toLowerCase().includes(searchText.toLowerCase())

    return basicSearch || parasiteSearch
  })

  // DataGrid sütunları
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 100,
      headerName: 'ID',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.id || row.analysisId || row._id || 'N/A'}
        </Typography>
      )
    },
    {
      flex: 0.2,
      field: 'result',
      minWidth: 175,
      headerName: 'Tespit Edilen Parazit',
      renderCell: ({ row }: CellType) => {
        // API'den gelen veri formatına göre sonuç al
        const topResult = row.results && row.results.length > 0 ? row.results[0] : row.dominantResult

        if (!topResult) return <Typography variant='body2'>Sonuç Yok</Typography>

        const parasiteName = topResult.type
        const confidence = topResult.confidence

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {parasiteName}
            </Typography>
            <CustomChip
              skin='light'
              size='small'
              label={`${(confidence * 100).toFixed(1)}%`}
              color={getConfidenceColor(confidence)}
              sx={{ mt: 0.5, height: 20, fontSize: '0.75rem', fontWeight: 500 }}
            />
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'location',
      minWidth: 150,
      headerName: 'Konum',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.location || 'Belirtilmemiş'}</Typography>
    },
    {
      flex: 0.15,
      minWidth: 150,
      field: 'createdAt',
      headerName: 'Tarih',
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {new Date(row.createdAt || row.timestamp || '').toLocaleString('tr-TR')}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'actions',
      headerName: 'İşlemler',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size='small'
            component={Link}
            href={`/opca/analysis/parasite/${row.id || row.analysisId || row._id}`}
          >
            <Icon icon='tabler:eye' />
          </IconButton>
          <IconButton size='small' color='error'>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title={<Typography variant='h5'>Parazit Analizleri</Typography>}
          subtitle={<Typography variant='body2'>Parazit analiz sonuçlarını görüntüleyin ve yönetin</Typography>}
        />
      </Grid>

      {/* Parazit Türleri Kartları */}
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 2 }}>
          Parazit Türleri
        </Typography>
        <Grid container spacing={4}>
          {parasites.map(parasite => (
            <Grid key={parasite.type} item xs={12} sm={6} md={4} lg={3}>
              <Card>
                <StyledCardMedia
                  image='https://via.placeholder.com/300x140/176bb0/FFFFFF?text=Parazit+G%C3%B6rseli'
                  title={parasite.name}
                />
                <CardContent>
                  <Typography variant='h6' gutterBottom>
                    {parasite.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {parasite.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant='outlined'
                    size='small'
                    component={Link}
                    href={`/opca/parasites/${parasite.type}`}
                    fullWidth
                  >
                    Detayları Gör
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Analizler Tablosu */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Parazit Analizleri'
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
                  component={Link}
                  href='/opca/analysis/parasite/new'
                >
                  Yeni Analiz
                </Button>
              </Box>
            }
          />
          <DataGrid
            autoHeight
            rows={filteredAnalyses}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={{ page: 0, pageSize }}
            onPaginationModelChange={model => setPageSize(model.pageSize)}
            loading={loading}
            getRowId={row => row.id || row.analysisId || row._id || Math.random().toString()}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

// ACL yapılandırması - Admin ve kullanıcıların erişmesine izin ver
ParasiteAnalysisList.acl = {
  action: 'read',
  subject: 'opca-analysis'
}

export default ParasiteAnalysisList
