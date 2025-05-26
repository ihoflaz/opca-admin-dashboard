// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

// ** API
import { modelService } from 'src/services/api'

// ** Interfaces
interface ModelInfo {
  type: string
  name: string
  version: string
  description?: string
  accuracy?: number
  size?: string
  lastUpdated?: string
  isLatest?: boolean
  hasUpdate?: boolean
}

interface ModelMetadata {
  type: string
  name: string
  version: string
  description: string
  accuracy: number
  size: string
  trainingDate: string
  parameters: number
  framework: string
  inputShape: string
  outputClasses: string[]
  performance: {
    precision: number
    recall: number
    f1Score: number
  }
}

const ModelManagement = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [models, setModels] = useState<ModelInfo[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelMetadata | null>(null)
  const [loadingMetadata, setLoadingMetadata] = useState<boolean>(false)
  const [checkingUpdates, setCheckingUpdates] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ** Model listesini getir
  const fetchModels = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await modelService.getAllModels()

      if (response.data.success && response.data.models) {
        setModels(response.data.models)
      } else {
        // API'de model endpoint'i henüz implement edilmemiş olabilir
        // Mock data ile test edelim
        const mockModels: ModelInfo[] = [
          {
            type: 'parasite',
            name: 'parasite-mobilenet',
            version: '1.0.0',
            description: 'Parazit tanı modeli - MobileNet tabanlı',
            accuracy: 92.5,
            size: '15.2 MB',
            lastUpdated: '2023-09-01T10:00:00Z',
            isLatest: true,
            hasUpdate: false
          },
          {
            type: 'mnist',
            name: 'mnist-convnet',
            version: '1.0.0',
            description: 'El yazısı rakam tanıma modeli - CNN tabanlı',
            accuracy: 98.7,
            size: '8.5 MB',
            lastUpdated: '2023-08-15T14:30:00Z',
            isLatest: true,
            hasUpdate: true
          },
          {
            type: 'parasite',
            name: 'parasite-resnet',
            version: '0.9.0',
            description: 'Parazit tanı modeli - ResNet tabanlı (eski versiyon)',
            accuracy: 89.2,
            size: '45.8 MB',
            lastUpdated: '2023-07-20T09:15:00Z',
            isLatest: false,
            hasUpdate: false
          }
        ]
        setModels(mockModels)
      }
    } catch (error) {
      console.error('Model listesi getirilirken hata oluştu:', error)
      setError("Model listesi yüklenirken bir hata oluştu. API endpoint'i henüz mevcut olmayabilir.")

      // Hata durumunda mock data göster
      const mockModels: ModelInfo[] = [
        {
          type: 'parasite',
          name: 'parasite-mobilenet',
          version: '1.0.0',
          description: 'Parazit tanı modeli - MobileNet tabanlı',
          accuracy: 92.5,
          size: '15.2 MB',
          lastUpdated: '2023-09-01T10:00:00Z',
          isLatest: true,
          hasUpdate: false
        },
        {
          type: 'mnist',
          name: 'mnist-convnet',
          version: '1.0.0',
          description: 'El yazısı rakam tanıma modeli - CNN tabanlı',
          accuracy: 98.7,
          size: '8.5 MB',
          lastUpdated: '2023-08-15T14:30:00Z',
          isLatest: true,
          hasUpdate: true
        }
      ]
      setModels(mockModels)
    } finally {
      setLoading(false)
    }
  }

  // ** Model metadata getir
  const fetchModelMetadata = async (type: string, name: string, version: string) => {
    setLoadingMetadata(true)
    try {
      const response = await modelService.getModelMetadata(type, name, version)

      if (response.data.success && response.data.metadata) {
        setSelectedModel(response.data.metadata)
      } else {
        // Mock metadata
        const mockMetadata: ModelMetadata = {
          type,
          name,
          version,
          description: `${type === 'parasite' ? 'Parazit tanı' : 'MNIST rakam tanıma'} modeli detayları`,
          accuracy: type === 'parasite' ? 92.5 : 98.7,
          size: type === 'parasite' ? '15.2 MB' : '8.5 MB',
          trainingDate: '2023-09-01T10:00:00Z',
          parameters: type === 'parasite' ? 3200000 : 1800000,
          framework: 'TensorFlow Lite',
          inputShape: type === 'parasite' ? '224x224x3' : '28x28x1',
          outputClasses:
            type === 'parasite'
              ? ['Neosporosis', 'Echinococcosis', 'Coenurosis']
              : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
          performance: {
            precision: type === 'parasite' ? 0.925 : 0.987,
            recall: type === 'parasite' ? 0.918 : 0.985,
            f1Score: type === 'parasite' ? 0.921 : 0.986
          }
        }
        setSelectedModel(mockMetadata)
      }
    } catch (error) {
      console.error('Model metadata getirilirken hata oluştu:', error)
    } finally {
      setLoadingMetadata(false)
    }
  }

  // ** Model güncelleme kontrolü
  const checkModelUpdate = async (type: string, name: string, version: string) => {
    setCheckingUpdates(`${type}-${name}-${version}`)
    try {
      const response = await modelService.checkModelUpdate(type, name, version)

      if (response.data.success) {
        // Model listesini güncelle
        setModels(prev =>
          prev.map(model =>
            model.type === type && model.name === name && model.version === version
              ? { ...model, hasUpdate: response.data.hasUpdate }
              : model
          )
        )
      }
    } catch (error) {
      console.error('Model güncelleme kontrolü yapılırken hata oluştu:', error)
    } finally {
      setCheckingUpdates(null)
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'parasite':
        return 'tabler:bug'
      case 'mnist':
        return 'tabler:numbers'
      default:
        return 'tabler:cpu'
    }
  }

  const getModelColor = (type: string) => {
    switch (type) {
      case 'parasite':
        return 'success'
      case 'mnist':
        return 'info'
      default:
        return 'primary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Grid container spacing={6}>
      {/* Başlık */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Model Yönetimi'
            subheader='OpCa uygulamasında kullanılan AI modellerinin yönetimi ve versiyon kontrolü'
            action={
              <Button
                variant='contained'
                startIcon={<Icon icon='tabler:refresh' />}
                onClick={fetchModels}
                disabled={loading}
              >
                Yenile
              </Button>
            }
          />
        </Card>
      </Grid>

      {/* Hata Mesajı */}
      {error && (
        <Grid item xs={12}>
          <Alert severity='warning' onClose={() => setError(null)}>
            {error}
          </Alert>
        </Grid>
      )}

      {/* Model Listesi */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title='Mevcut Modeller' />
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Model</TableCell>
                      <TableCell>Versiyon</TableCell>
                      <TableCell>Doğruluk</TableCell>
                      <TableCell>Boyut</TableCell>
                      <TableCell>Durum</TableCell>
                      <TableCell>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {models.map(model => (
                      <TableRow key={`${model.type}-${model.name}-${model.version}`}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: `${getModelColor(model.type)}.main` }}>
                              <Icon icon={getModelIcon(model.type)} />
                            </Avatar>
                            <Box>
                              <Typography variant='body2' fontWeight='medium'>
                                {model.name}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {model.description}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={model.version}
                            size='small'
                            color={model.isLatest ? 'primary' : 'default'}
                            variant={model.isLatest ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>{model.accuracy ? `${model.accuracy}%` : 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>{model.size || 'N/A'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {model.isLatest && <Chip label='Güncel' size='small' color='success' />}
                            {model.hasUpdate && <Chip label='Güncelleme Var' size='small' color='warning' />}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size='small'
                              variant='outlined'
                              onClick={() => fetchModelMetadata(model.type, model.name, model.version)}
                            >
                              Detay
                            </Button>
                            <Button
                              size='small'
                              variant='outlined'
                              onClick={() => checkModelUpdate(model.type, model.name, model.version)}
                              disabled={checkingUpdates === `${model.type}-${model.name}-${model.version}`}
                              startIcon={
                                checkingUpdates === `${model.type}-${model.name}-${model.version}` ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <Icon icon='tabler:refresh' />
                                )
                              }
                            >
                              Kontrol Et
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Model Detayları */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title='Model Detayları' />
          <CardContent>
            {loadingMetadata ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : selectedModel ? (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant='h6' gutterBottom>
                    {selectedModel.name} v{selectedModel.version}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' paragraph>
                    {selectedModel.description}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='subtitle2' gutterBottom>
                    Performans Metrikleri
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant='body2'>Doğruluk:</Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {selectedModel.accuracy}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant='body2'>Precision:</Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {(selectedModel.performance.precision * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant='body2'>Recall:</Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {(selectedModel.performance.recall * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant='body2'>F1-Score:</Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {(selectedModel.performance.f1Score * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='subtitle2' gutterBottom>
                    Teknik Bilgiler
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant='body2'>Framework:</Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {selectedModel.framework}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant='body2'>Boyut:</Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {selectedModel.size}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant='body2'>Parametre Sayısı:</Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {selectedModel.parameters.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant='body2'>Giriş Boyutu:</Typography>
                    <Typography variant='body2' fontWeight='medium'>
                      {selectedModel.inputShape}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant='subtitle2' gutterBottom>
                    Çıkış Sınıfları
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedModel.outputClasses.map(className => (
                      <Chip key={className} label={className} size='small' variant='outlined' />
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Eğitim Tarihi: {formatDate(selectedModel.trainingDate)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center', py: 4 }}>
                Model detaylarını görmek için listeden bir model seçin
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

ModelManagement.getLayout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>

export default ModelManagement
