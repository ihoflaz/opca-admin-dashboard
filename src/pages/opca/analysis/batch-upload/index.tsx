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
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

// ** API
// import { analysisService } from 'src/services/api' // Henüz batch upload endpoint'i yok

// ** Interfaces
interface BatchUploadResult {
  localId: string
  serverId?: string
  status: 'success' | 'error' | 'pending'
  message?: string
  analysisType: string
  timestamp: string
  confidence?: number
  deviceInfo?: string
}

interface BatchUploadStats {
  totalUploads: number
  successCount: number
  errorCount: number
  pendingCount: number
  lastUpload?: string
}

const BatchUploadManagement = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [uploadResults, setUploadResults] = useState<BatchUploadResult[]>([])
  const [stats, setStats] = useState<BatchUploadStats>({
    totalUploads: 0,
    successCount: 0,
    errorCount: 0,
    pendingCount: 0
  })
  const [simulateDialogOpen, setSimulateDialogOpen] = useState<boolean>(false)
  const [simulateCount, setSimulateCount] = useState<number>(5)
  const [simulateLoading, setSimulateLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // ** Mock batch upload sonuçlarını getir
  const fetchBatchUploadResults = async () => {
    setLoading(true)
    setError(null)
    try {
      // API'de henüz batch upload history endpoint'i olmadığı için mock data kullanıyoruz
      const mockResults: BatchUploadResult[] = [
        {
          localId: 'local-uuid-001',
          serverId: '64f8a1b2c3d4e5f6a7b8c9f1',
          status: 'success',
          analysisType: 'Parasite',
          timestamp: '2023-09-07T14:30:00Z',
          confidence: 0.85,
          deviceInfo: 'Android 13 / Samsung Galaxy S22'
        },
        {
          localId: 'local-uuid-002',
          serverId: '64f8a1b2c3d4e5f6a7b8c9f2',
          status: 'success',
          analysisType: 'MNIST',
          timestamp: '2023-09-07T14:25:00Z',
          confidence: 0.92,
          deviceInfo: 'iOS 16.5 / iPhone 14 Pro'
        },
        {
          localId: 'local-uuid-003',
          status: 'error',
          message: 'Görüntü formatı desteklenmiyor',
          analysisType: 'Parasite',
          timestamp: '2023-09-07T14:20:00Z',
          deviceInfo: 'Android 12 / Xiaomi Mi 11'
        },
        {
          localId: 'local-uuid-004',
          status: 'pending',
          analysisType: 'MNIST',
          timestamp: '2023-09-07T14:15:00Z',
          deviceInfo: 'iOS 15.7 / iPhone 12'
        },
        {
          localId: 'local-uuid-005',
          serverId: '64f8a1b2c3d4e5f6a7b8c9f3',
          status: 'success',
          analysisType: 'Parasite',
          timestamp: '2023-09-07T14:10:00Z',
          confidence: 0.78,
          deviceInfo: 'Android 13 / Google Pixel 7'
        }
      ]

      setUploadResults(mockResults)

      // İstatistikleri hesapla
      const totalUploads = mockResults.length
      const successCount = mockResults.filter(r => r.status === 'success').length
      const errorCount = mockResults.filter(r => r.status === 'error').length
      const pendingCount = mockResults.filter(r => r.status === 'pending').length
      const lastUpload = mockResults.length > 0 ? mockResults[0].timestamp : undefined

      setStats({
        totalUploads,
        successCount,
        errorCount,
        pendingCount,
        lastUpload
      })
    } catch (error) {
      console.error('Batch upload sonuçları getirilirken hata oluştu:', error)
      setError('Batch upload geçmişi yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  // ** Toplu analiz simülasyonu
  const simulateBatchUpload = async () => {
    setSimulateLoading(true)
    try {
      // Mock batch upload data oluştur
      const mockBatchData = {
        analyses: Array.from({ length: simulateCount }, (_, index) => ({
          localId: `sim-${Date.now()}-${index}`,
          type: Math.random() > 0.5 ? 'Parasite' : 'MNIST',
          imageBase64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...',
          results:
            Math.random() > 0.5
              ? [{ type: 'Neosporosis', confidence: Math.random() * 0.3 + 0.7 }]
              : [{ value: Math.floor(Math.random() * 10), confidence: Math.random() * 0.3 + 0.7 }],
          processingTimeMs: Math.floor(Math.random() * 500) + 100,
          notes: 'Simülasyon verisi',
          modelName: Math.random() > 0.5 ? 'parasite-mobilenet' : 'mnist-convnet',
          modelVersion: '1.0.0',
          deviceInfo: 'Simulation Device',
          createdAt: new Date().toISOString()
        }))
      }

      // API'ye gönder (gerçek implementasyon)
      // const response = await analysisService.batchUpload(mockBatchData)

      // Mock response
      const mockResponse = {
        data: {
          success: true,
          results: mockBatchData.analyses.map(analysis => ({
            localId: analysis.localId,
            serverId: `server-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: Math.random() > 0.1 ? 'success' : 'error',
            message: Math.random() > 0.1 ? undefined : 'Validation failed'
          })),
          successCount: Math.floor(simulateCount * 0.9),
          errorCount: Math.ceil(simulateCount * 0.1),
          totalCount: simulateCount
        }
      }

      // Sonuçları listeye ekle
      const newResults: BatchUploadResult[] = mockResponse.data.results.map(result => ({
        localId: result.localId,
        serverId: result.serverId,
        status: result.status as 'success' | 'error',
        message: result.message,
        analysisType: Math.random() > 0.5 ? 'Parasite' : 'MNIST',
        timestamp: new Date().toISOString(),
        confidence: result.status === 'success' ? Math.random() * 0.3 + 0.7 : undefined,
        deviceInfo: 'Simulation Device'
      }))

      setUploadResults(prev => [...newResults, ...prev])

      // İstatistikleri güncelle
      setStats(prev => ({
        totalUploads: prev.totalUploads + simulateCount,
        successCount: prev.successCount + mockResponse.data.successCount,
        errorCount: prev.errorCount + mockResponse.data.errorCount,
        pendingCount: prev.pendingCount,
        lastUpload: new Date().toISOString()
      }))

      setSimulateDialogOpen(false)
      setSimulateCount(5)
    } catch (error) {
      console.error('Batch upload simülasyonu sırasında hata oluştu:', error)
      setError('Batch upload simülasyonu başarısız oldu.')
    } finally {
      setSimulateLoading(false)
    }
  }

  useEffect(() => {
    fetchBatchUploadResults()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'pending':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Başarılı'
      case 'error':
        return 'Hatalı'
      case 'pending':
        return 'Beklemede'
      default:
        return 'Bilinmiyor'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
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
            title='Toplu Analiz Yükleme'
            subheader='Offline modda biriken analizlerin sunucuya yüklenmesi ve durumu'
            action={
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant='outlined'
                  startIcon={<Icon icon='tabler:play' />}
                  onClick={() => setSimulateDialogOpen(true)}
                >
                  Simülasyon
                </Button>
                <Button
                  variant='contained'
                  startIcon={<Icon icon='tabler:refresh' />}
                  onClick={fetchBatchUploadResults}
                  disabled={loading}
                >
                  Yenile
                </Button>
              </Box>
            }
          />
        </Card>
      </Grid>

      {/* Hata Mesajı */}
      {error && (
        <Grid item xs={12}>
          <Alert severity='error' onClose={() => setError(null)}>
            {error}
          </Alert>
        </Grid>
      )}

      {/* İstatistik Kartları */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 3, bgcolor: 'primary.main' }}>
              <Icon icon='tabler:upload' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{stats.totalUploads}</Typography>
              <Typography variant='body2'>Toplam Yükleme</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 3, bgcolor: 'success.main' }}>
              <Icon icon='tabler:check' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{stats.successCount}</Typography>
              <Typography variant='body2'>Başarılı</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 3, bgcolor: 'error.main' }}>
              <Icon icon='tabler:x' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{stats.errorCount}</Typography>
              <Typography variant='body2'>Hatalı</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 3, bgcolor: 'warning.main' }}>
              <Icon icon='tabler:clock' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{stats.pendingCount}</Typography>
              <Typography variant='body2'>Beklemede</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Başarı Oranı */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Yükleme Başarı Oranı' />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant='h4' sx={{ mr: 2 }}>
                {stats.totalUploads > 0 ? ((stats.successCount / stats.totalUploads) * 100).toFixed(1) : 0}%
              </Typography>
              <Chip
                label={
                  stats.totalUploads > 0 && stats.successCount / stats.totalUploads >= 0.9
                    ? 'Mükemmel'
                    : stats.totalUploads > 0 && stats.successCount / stats.totalUploads >= 0.7
                    ? 'İyi'
                    : 'Geliştirilmeli'
                }
                color={
                  stats.totalUploads > 0 && stats.successCount / stats.totalUploads >= 0.9
                    ? 'success'
                    : stats.totalUploads > 0 && stats.successCount / stats.totalUploads >= 0.7
                    ? 'warning'
                    : 'error'
                }
                size='small'
              />
            </Box>
            <LinearProgress
              variant='determinate'
              value={stats.totalUploads > 0 ? (stats.successCount / stats.totalUploads) * 100 : 0}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
              {stats.lastUpload && `Son yükleme: ${formatDate(stats.lastUpload)}`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Yükleme Geçmişi */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Yükleme Geçmişi' />
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
                      <TableCell>Local ID</TableCell>
                      <TableCell>Server ID</TableCell>
                      <TableCell>Tür</TableCell>
                      <TableCell>Durum</TableCell>
                      <TableCell>Güven</TableCell>
                      <TableCell>Cihaz</TableCell>
                      <TableCell>Tarih</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {uploadResults.map(result => (
                      <TableRow key={result.localId}>
                        <TableCell>
                          <Typography variant='body2' fontFamily='monospace'>
                            {result.localId.substring(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {result.serverId ? (
                            <Typography variant='body2' fontFamily='monospace'>
                              {result.serverId.substring(0, 12)}...
                            </Typography>
                          ) : (
                            <Typography variant='body2' color='text.secondary'>
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={result.analysisType}
                            size='small'
                            color={result.analysisType === 'Parasite' ? 'success' : 'info'}
                            variant='outlined'
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(result.status)}
                            size='small'
                            color={getStatusColor(result.status)}
                          />
                          {result.message && (
                            <Typography variant='caption' display='block' color='error'>
                              {result.message}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {result.confidence ? (
                            <Typography variant='body2'>{(result.confidence * 100).toFixed(1)}%</Typography>
                          ) : (
                            <Typography variant='body2' color='text.secondary'>
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2' sx={{ maxWidth: 150 }} noWrap>
                            {result.deviceInfo || '-'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>{formatDate(result.timestamp)}</Typography>
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

      {/* Simülasyon Dialog */}
      <Dialog open={simulateDialogOpen} onClose={() => setSimulateDialogOpen(false)}>
        <DialogTitle>Batch Upload Simülasyonu</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='text.secondary' paragraph>
            Test amaçlı batch upload simülasyonu çalıştırın. Bu işlem mock veriler oluşturacaktır.
          </Typography>
          <TextField
            fullWidth
            label='Simüle edilecek analiz sayısı'
            type='number'
            value={simulateCount}
            onChange={e => setSimulateCount(parseInt(e.target.value) || 5)}
            inputProps={{ min: 1, max: 50 }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSimulateDialogOpen(false)}>İptal</Button>
          <Button
            variant='contained'
            onClick={simulateBatchUpload}
            disabled={simulateLoading}
            startIcon={simulateLoading ? <CircularProgress size={16} /> : <Icon icon='tabler:play' />}
          >
            Simülasyonu Başlat
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

BatchUploadManagement.getLayout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>

export default BatchUploadManagement
