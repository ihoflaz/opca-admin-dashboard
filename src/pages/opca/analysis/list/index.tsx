// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

import { DataGrid, GridColDef } from '@mui/x-data-grid'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import PageHeader from 'src/@core/components/page-header'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** API Servisi
import { analysisService } from 'src/services/api'

interface AnalysisData {
  id?: string
  analysisId?: string
  _id?: string
  type?: string
  analysisType?: string
  createdAt: string
  timestamp?: string
  results?: any[]
  dominantResult?: any
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

const AnalysisList = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [analyses, setAnalyses] = useState<AnalysisData[]>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [tabValue, setTabValue] = useState<string>('all')
  const [searchText, setSearchText] = useState<string>('')

  // Menü State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // Tab değişikliği
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  // Arama işlevi
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  // Veri çekme
  useEffect(() => {
    const fetchAnalyses = async () => {
      console.log('🔄 Analiz verilerini çekmeye başlıyoruz...')
      console.log('📊 Tab değeri:', tabValue)
      setLoading(true)
      try {
        console.log('🌐 API çağrısı yapılıyor...')

        // Gerçek API servisini kullanıyoruz
        const response = await analysisService.getAnalyses(1, 100, tabValue !== 'all' ? tabValue : undefined)

        // API yanıt formatını kontrol et
        console.log('✅ API Yanıtı alındı:', response.data)

        // API dokümanına göre yanıt formatı: { success: true, analyses: [...], pagination: {...} }
        const data = response.data.analyses || []
        console.log('📋 İşlenen veri:', data)
        setAnalyses(data)
      } catch (error) {
        console.error('❌ Analizler yüklenirken hata oluştu:', error)
      } finally {
        setLoading(false)
        console.log('🏁 Veri çekme işlemi tamamlandı')
      }
    }

    fetchAnalyses()
  }, [tabValue])

  // Filtreleme
  const filteredAnalyses = analyses.filter(analysis => {
    // Güvenli string kontrolü
    const analysisId = analysis.id || analysis.analysisId || analysis._id || ''
    const analysisType = analysis.type || analysis.analysisType || ''
    const analysisNotes = analysis.notes || ''

    return (
      analysisId.toLowerCase().includes(searchText.toLowerCase()) ||
      analysisType.toLowerCase().includes(searchText.toLowerCase()) ||
      analysisNotes.toLowerCase().includes(searchText.toLowerCase())
    )
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
      flex: 0.15,
      field: 'type',
      minWidth: 125,
      headerName: 'Tür',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            color={(row.type || row.analysisType) === 'Parasite' ? 'error' : 'info'}
            sx={{ mr: 3, width: 30, height: 30 }}
          >
            <Icon icon={(row.type || row.analysisType) === 'Parasite' ? 'tabler:virus' : 'tabler:numbers'} />
          </CustomAvatar>
          <Typography variant='body2' sx={{ color: 'text.primary' }}>
            {row.type || row.analysisType || 'N/A'}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      field: 'result',
      minWidth: 175,
      headerName: 'Sonuç',
      renderCell: ({ row }: CellType) => {
        // API'den gelen veri formatına göre sonuç al
        const topResult = row.results && row.results.length > 0 ? row.results[0] : row.dominantResult

        if (!topResult) return <Typography variant='body2'>Sonuç Yok</Typography>

        const analysisType = row.type || row.analysisType || ''
        const isParasite = analysisType === 'Parasite'
        const resultText = isParasite ? topResult.type : `Rakam ${topResult.value}`
        const confidence = topResult.confidence

        return (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              {resultText}
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
            component='a'
            href={`/opca/analysis/${(row.type || row.analysisType || 'unknown').toLowerCase()}/${
              row.id || row.analysisId || row._id
            }`}
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
          title={<Typography variant='h5'>Analiz Sonuçları</Typography>}
          subtitle={<Typography variant='body2'>Tüm analiz sonuçlarını görüntüleyin ve yönetin</Typography>}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <TabContext value={tabValue}>
            <CardHeader
              title='Analizler'
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
                    onClick={handleClick}
                  >
                    Yeni Analiz
                  </Button>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={handleClose}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Icon icon='tabler:virus' />
                        <Typography sx={{ ml: 2 }}>Parazit Analizi</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Icon icon='tabler:numbers' />
                        <Typography sx={{ ml: 2 }}>MNIST Analizi</Typography>
                      </Box>
                    </MenuItem>
                  </Menu>
                </Box>
              }
            />

            <TabList
              onChange={handleTabChange}
              aria-label='analiz tabları'
              sx={{
                borderBottom: theme => `1px solid ${theme.palette.divider}`,
                '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
                '& .MuiTab-root': { py: 2.5 },
                px: 5
              }}
            >
              <Tab value='all' label='Tüm Analizler' icon={<Icon icon='tabler:list' />} iconPosition='start' />
              <Tab
                value='Parasite'
                label='Parazit Analizleri'
                icon={<Icon icon='tabler:virus' />}
                iconPosition='start'
              />
              <Tab value='MNIST' label='MNIST Analizleri' icon={<Icon icon='tabler:numbers' />} iconPosition='start' />
            </TabList>

            <TabPanel value='all' sx={{ p: 0 }}>
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
            </TabPanel>
            <TabPanel value='Parasite' sx={{ p: 0 }}>
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
            </TabPanel>
            <TabPanel value='MNIST' sx={{ p: 0 }}>
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
            </TabPanel>
          </TabContext>
        </Card>
      </Grid>
    </Grid>
  )
}

// ACL yapılandırması - Admin ve kullanıcıların erişmesine izin ver
AnalysisList.acl = {
  action: 'read',
  subject: 'opca-analysis'
}

export default AnalysisList
