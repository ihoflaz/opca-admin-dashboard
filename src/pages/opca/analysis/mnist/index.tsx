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

import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import PageHeader from 'src/@core/components/page-header'
import CustomChip from 'src/@core/components/mui/chip'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** API Servisi
import { analysisService } from 'src/services/api'

// Styled komponent - DigitPreview için

const DigitPreview = styled(Paper)(({ theme }) => ({
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  fontSize: '2rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius
}))

interface AnalysisData {
  id?: string
  analysisId?: string
  _id?: string
  type?: string
  analysisType?: string
  createdAt?: string
  timestamp?: string
  results?: Array<{
    value: number
    confidence: number
  }>
  dominantResult?: {
    value: number
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

interface CellType {
  row: AnalysisData
}

// ** Confidence skoruna göre renk belirleme
const getConfidenceColor = (confidence: number): ThemeColor => {
  if (confidence >= 0.75) return 'success'
  if (confidence >= 0.5) return 'warning'

  return 'error'
}

const MnistAnalysisList = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [analyses, setAnalyses] = useState<AnalysisData[]>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [searchText, setSearchText] = useState<string>('')
  const [recentDigits, setRecentDigits] = useState<number[]>([])

  // Arama işlevi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // Veri çekme
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // MNIST analizlerini getir
        const analysesResponse = await analysisService.getAnalyses(1, 100, 'MNIST')
        console.log('MNIST Analizleri API Yanıtı:', analysesResponse.data)

        // API dokümanına göre yanıt formatı: { success: true, analyses: [...] }
        const analysesData = analysesResponse.data.analyses || []
        setAnalyses(analysesData)

        // Son 10 analiz sonucundan rakamları çıkart
        const recentResults = analysesData
          .slice(0, 10)
          .map((analysis: AnalysisData) => {
            const topResult = analysis.results?.[0]

            return topResult ? topResult.value : null
          })
          .filter((digit: number | null): digit is number => digit !== null)

        setRecentDigits(recentResults)
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

    // Rakam değerinde arama
    const digitSearch =
      analysis.results?.some(result => result.value.toString().includes(searchText)) ||
      analysis.dominantResult?.value.toString().includes(searchText)

    return basicSearch || digitSearch
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
      minWidth: 150,
      headerName: 'Tespit Edilen Rakam',
      renderCell: ({ row }: CellType) => {
        // API'den gelen veri formatına göre sonuç al
        const topResult = row.results && row.results.length > 0 ? row.results[0] : row.dominantResult

        if (!topResult) return <Typography variant='body2'>Sonuç Yok</Typography>

        const digitValue = topResult.value
        const confidence = topResult.confidence

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DigitPreview sx={{ mr: 3 }}>{digitValue}</DigitPreview>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                Rakam {digitValue}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={`${(confidence * 100).toFixed(1)}%`}
                color={getConfidenceColor(confidence)}
                sx={{ mt: 0.5, height: 20, fontSize: '0.75rem', fontWeight: 500 }}
              />
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      field: 'device',
      minWidth: 150,
      headerName: 'Cihaz',
      renderCell: ({ row }: CellType) => <Typography variant='body2'>{row.deviceInfo || 'Belirtilmemiş'}</Typography>
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
            href={`/opca/analysis/mnist/${row.id || row.analysisId || row._id}`}
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
          title={<Typography variant='h5'>MNIST Analizleri</Typography>}
          subtitle={<Typography variant='body2'>MNIST rakam analiz sonuçlarını görüntüleyin ve yönetin</Typography>}
        />
      </Grid>

      {/* Son Tanınan Rakamlar */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Son Tanınan Rakamlar' />
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {recentDigits.map((digit, index) => (
                <DigitPreview key={index}>{digit}</DigitPreview>
              ))}
              {recentDigits.length === 0 && <Typography>Henüz analiz sonucu bulunamadı</Typography>}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Analiz İstatistikleri */}
      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon='tabler:list-numbers' fontSize='2.5rem' />
              </Box>
              <Box>
                <Typography variant='h6'>Toplam Analiz</Typography>
                <Typography variant='caption'>Tüm zamanlar</Typography>
              </Box>
            </Box>
            <Typography variant='h4'>{analyses.length}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon='tabler:device-mobile' fontSize='2.5rem' />
              </Box>
              <Box>
                <Typography variant='h6'>Farklı Cihaz</Typography>
                <Typography variant='caption'>Benzersiz cihaz sayısı</Typography>
              </Box>
            </Box>
            <Typography variant='h4'>{new Set(analyses.map(a => a.deviceInfo).filter(Boolean)).size}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon='tabler:chart-pie' fontSize='2.5rem' />
              </Box>
              <Box>
                <Typography variant='h6'>Ortalama Doğruluk</Typography>
                <Typography variant='caption'>Sonuçların güvenilirliği</Typography>
              </Box>
            </Box>
            <Typography variant='h4'>
              {analyses.length > 0
                ? `${(
                    (analyses.reduce((sum, analysis) => sum + (analysis.results?.[0]?.confidence || 0), 0) /
                      analyses.length) *
                    100
                  ).toFixed(1)}%`
                : '0%'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon='tabler:clock' fontSize='2.5rem' />
              </Box>
              <Box>
                <Typography variant='h6'>Son Analiz</Typography>
                <Typography variant='caption'>En son işlem zamanı</Typography>
              </Box>
            </Box>
            <Typography variant='h6'>
              {analyses.length > 0
                ? new Date(analyses[0].createdAt || analyses[0].timestamp || '').toLocaleString('tr-TR')
                : 'Hiç analiz yok'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Analizler Tablosu */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='MNIST Analizleri'
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
                  href='/opca/analysis/mnist/new'
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
MnistAnalysisList.acl = {
  action: 'read',
  subject: 'opca-analysis'
}

export default MnistAnalysisList
