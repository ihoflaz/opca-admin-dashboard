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
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Pagination from '@mui/material/Pagination'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

// ** API
import { adminService } from 'src/services/api'

// ** Interfaces
interface AdminAnalysis {
  _id: string
  analysisType: 'Parasite' | 'MNIST'
  imageUrl: string
  thumbnailUrl?: string
  location?: string
  notes?: string
  parasiteResults: Array<{ type: string; confidence: number }>
  digitResults: Array<{ value: number; confidence: number }>
  processingTimeMs: number
  processedOnMobile: boolean
  modelName: string
  modelVersion: string
  deviceInfo?: string
  user: {
    _id: string
    name: string
    email: string
    role: string
  }
  createdAt: string
  updatedAt: string
}

interface AdminAnalysisStats {
  totalAnalyses: number
  recentAnalyses: number
  typeDistribution: {
    Parasite: number
    MNIST: number
  }
  processingDistribution: {
    mobile: number
    server: number
  }
  topUsers: Array<{
    _id: string
    analysisCount: number
    userName: string
    userEmail: string
    userRole: string
  }>
  avgProcessingTimes: {
    Parasite: { average: number; minimum: number; maximum: number }
    MNIST: { average: number; minimum: number; maximum: number }
  }
}

const AdminAnalysisList = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [analyses, setAnalyses] = useState<AdminAnalysis[]>([])
  const [stats, setStats] = useState<AdminAnalysisStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ** Pagination & Filters
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [limit] = useState<number>(20)

  // ** Filters
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [userIdFilter, setUserIdFilter] = useState<string>('')
  const [processedOnMobile, setProcessedOnMobile] = useState<boolean | null>(null)
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<string>('desc')

  // ** Analizleri getir
  const fetchAnalyses = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminService.getAllAnalyses(
        page,
        limit,
        typeFilter || undefined,
        userIdFilter.trim() || undefined,
        processedOnMobile || undefined,
        undefined, // startDate
        undefined, // endDate
        sortBy,
        sortOrder
      )

      if (response.data.success) {
        setAnalyses(response.data.analyses)
        setTotalPages(response.data.pagination.totalPages)
        setTotalCount(response.data.pagination.totalCount)
      } else {
        // Mock data for testing
        const mockAnalyses: AdminAnalysis[] = [
          {
            _id: '64f8a1b2c3d4e5f6a7b8c9f1',
            analysisType: 'Parasite',
            imageUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/original_1694096400123_parasite.jpg',
            thumbnailUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/thumb_1694096400123_parasite.jpg',
            location: 'Ankara, Türkiye',
            notes: 'Cihazda işlenmiş parazit analizi',
            parasiteResults: [{ type: 'Neosporosis', confidence: 0.75 }],
            digitResults: [],
            processingTimeMs: 350,
            processedOnMobile: true,
            modelName: 'parasite-mobilenet',
            modelVersion: '1.0.0',
            deviceInfo: 'Android 13 / Samsung Galaxy S22',
            user: {
              _id: '64f8a1b2c3d4e5f6a7b8c9d0',
              name: 'Test Kullanıcı',
              email: 'test@example.com',
              role: 'user'
            },
            createdAt: '2023-09-07T12:00:00.123Z',
            updatedAt: '2023-09-07T12:00:00.123Z'
          },
          {
            _id: '64f8a1b2c3d4e5f6a7b8c9f2',
            analysisType: 'MNIST',
            imageUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/original_1694096400456_digit.jpg',
            thumbnailUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/thumb_1694096400456_digit.jpg',
            location: undefined,
            notes: 'Cihazda işlenmiş MNIST analizi',
            parasiteResults: [],
            digitResults: [{ value: 5, confidence: 0.85 }],
            processingTimeMs: 180,
            processedOnMobile: true,
            modelName: 'mnist-convnet',
            modelVersion: '1.0.0',
            deviceInfo: 'iOS 16.5 / iPhone 14 Pro',
            user: {
              _id: '64f8a1b2c3d4e5f6a7b8c9d1',
              name: 'Dr. Veteriner',
              email: 'vet@example.com',
              role: 'veterinarian'
            },
            createdAt: '2023-09-07T12:05:00.456Z',
            updatedAt: '2023-09-07T12:05:00.456Z'
          }
        ]
        setAnalyses(mockAnalyses)
        setTotalPages(1)
        setTotalCount(mockAnalyses.length)
      }
    } catch (error) {
      console.error('Admin analizleri getirilirken hata oluştu:', error)
      setError('Analiz listesi yüklenirken bir hata oluştu.')

      // Mock data on error
      const mockAnalyses: AdminAnalysis[] = [
        {
          _id: '64f8a1b2c3d4e5f6a7b8c9f1',
          analysisType: 'Parasite',
          imageUrl: 'https://opca-bucket.s3.amazonaws.com/analyses/original_1694096400123_parasite.jpg',
          location: 'Ankara, Türkiye',
          notes: 'Test analizi',
          parasiteResults: [{ type: 'Neosporosis', confidence: 0.75 }],
          digitResults: [],
          processingTimeMs: 350,
          processedOnMobile: true,
          modelName: 'parasite-mobilenet',
          modelVersion: '1.0.0',
          deviceInfo: 'Android 13',
          user: {
            _id: '64f8a1b2c3d4e5f6a7b8c9d0',
            name: 'Test Kullanıcı',
            email: 'test@example.com',
            role: 'user'
          },
          createdAt: '2023-09-07T12:00:00Z',
          updatedAt: '2023-09-07T12:00:00Z'
        }
      ]
      setAnalyses(mockAnalyses)
      setTotalPages(1)
      setTotalCount(mockAnalyses.length)
    } finally {
      setLoading(false)
    }
  }

  // ** İstatistikleri getir
  const fetchStats = async () => {
    try {
      const response = await adminService.getAnalysisStats()

      if (response.data.success) {
        setStats(response.data.stats)
      } else {
        // Mock stats
        setStats({
          totalAnalyses: 1250,
          recentAnalyses: 85,
          typeDistribution: { Parasite: 750, MNIST: 500 },
          processingDistribution: { mobile: 800, server: 450 },
          topUsers: [
            {
              _id: '64f8a1b2c3d4e5f6a7b8c9d0',
              analysisCount: 45,
              userName: 'Test Kullanıcı',
              userEmail: 'test@example.com',
              userRole: 'user'
            }
          ],
          avgProcessingTimes: {
            Parasite: { average: 320, minimum: 150, maximum: 800 },
            MNIST: { average: 180, minimum: 80, maximum: 350 }
          }
        })
      }
    } catch (error) {
      console.error('Admin istatistikleri getirilirken hata oluştu:', error)

      // Mock stats on error
      setStats({
        totalAnalyses: 1250,
        recentAnalyses: 85,
        typeDistribution: { Parasite: 750, MNIST: 500 },
        processingDistribution: { mobile: 800, server: 450 },
        topUsers: [],
        avgProcessingTimes: {
          Parasite: { average: 320, minimum: 150, maximum: 800 },
          MNIST: { average: 180, minimum: 80, maximum: 350 }
        }
      })
    }
  }

  useEffect(() => {
    fetchAnalyses()
    fetchStats()
  }, [page, typeFilter, userIdFilter, processedOnMobile, sortBy, sortOrder])

  const clearFilters = () => {
    setTypeFilter('')
    setUserIdFilter('')
    setProcessedOnMobile(null)
    setSortBy('createdAt')
    setSortOrder('desc')
    setPage(1)
  }

  const getTypeColor = (type: string) => {
    return type === 'Parasite' ? 'success' : 'info'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'veterinarian':
        return 'warning'
      case 'user':
        return 'primary'
      default:
        return 'default'
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

  const getDominantResult = (analysis: AdminAnalysis) => {
    if (analysis.analysisType === 'Parasite' && analysis.parasiteResults.length > 0) {
      const dominant = analysis.parasiteResults[0]

      return `${dominant.type} (${(dominant.confidence * 100).toFixed(1)}%)`
    }
    if (analysis.analysisType === 'MNIST' && analysis.digitResults.length > 0) {
      const dominant = analysis.digitResults[0]

      return `Rakam ${dominant.value} (${(dominant.confidence * 100).toFixed(1)}%)`
    }

    return 'Sonuç yok'
  }

  return (
    <Grid container spacing={6}>
      {/* Başlık */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Admin - Tüm Analizler'
            subheader='Sistemdeki tüm kullanıcıların analiz sonuçları'
            action={
              <Button
                variant='contained'
                startIcon={<Icon icon='tabler:refresh' />}
                onClick={() => {
                  fetchAnalyses()
                  fetchStats()
                }}
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
          <Alert severity='error' onClose={() => setError(null)}>
            {error}
          </Alert>
        </Grid>
      )}

      {/* İstatistik Kartları */}
      {stats && (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 3, bgcolor: 'primary.main' }}>
                  <Icon icon='tabler:chart-line' />
                </Avatar>
                <Box>
                  <Typography variant='h6'>{stats.totalAnalyses}</Typography>
                  <Typography variant='body2'>Toplam Analiz</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 3, bgcolor: 'success.main' }}>
                  <Icon icon='tabler:trending-up' />
                </Avatar>
                <Box>
                  <Typography variant='h6'>{stats.recentAnalyses}</Typography>
                  <Typography variant='body2'>Son 30 Gün</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 3, bgcolor: 'info.main' }}>
                  <Icon icon='tabler:device-mobile' />
                </Avatar>
                <Box>
                  <Typography variant='h6'>{stats.processingDistribution.mobile}</Typography>
                  <Typography variant='body2'>Mobil İşleme</Typography>
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
                  <Typography variant='h6'>
                    {Math.round(
                      (stats.avgProcessingTimes.Parasite.average + stats.avgProcessingTimes.MNIST.average) / 2
                    )}
                    ms
                  </Typography>
                  <Typography variant='body2'>Ort. İşleme Süresi</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Filtreler */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Filtreler' />
          <CardContent>
            <Grid container spacing={4} alignItems='center'>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Analiz Türü</InputLabel>
                  <Select value={typeFilter} label='Analiz Türü' onChange={e => setTypeFilter(e.target.value)}>
                    <MenuItem value=''>Tümü</MenuItem>
                    <MenuItem value='Parasite'>Parazit</MenuItem>
                    <MenuItem value='MNIST'>MNIST</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label='Kullanıcı ID'
                  value={userIdFilter}
                  onChange={e => setUserIdFilter(e.target.value)}
                  placeholder='Kullanıcı ID giriniz'
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sıralama</InputLabel>
                  <Select
                    value={`${sortBy}-${sortOrder}`}
                    label='Sıralama'
                    onChange={e => {
                      const [field, order] = e.target.value.split('-')
                      setSortBy(field)
                      setSortOrder(order)
                    }}
                  >
                    <MenuItem value='createdAt-desc'>Tarih (Yeni → Eski)</MenuItem>
                    <MenuItem value='createdAt-asc'>Tarih (Eski → Yeni)</MenuItem>
                    <MenuItem value='processingTimeMs-desc'>İşleme Süresi (Yüksek → Düşük)</MenuItem>
                    <MenuItem value='processingTimeMs-asc'>İşleme Süresi (Düşük → Yüksek)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={processedOnMobile === true}
                      onChange={e => setProcessedOnMobile(e.target.checked ? true : null)}
                    />
                  }
                  label='Sadece Mobil İşleme'
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant='outlined'
                  startIcon={<Icon icon='tabler:filter-off' />}
                  onClick={clearFilters}
                  fullWidth
                >
                  Filtreleri Temizle
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Analiz Listesi */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Analizler' subheader={`Toplam ${totalCount} analiz`} />
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} variant='outlined'>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Kullanıcı</TableCell>
                        <TableCell>Analiz Türü</TableCell>
                        <TableCell>Sonuç</TableCell>
                        <TableCell>İşleme</TableCell>
                        <TableCell>Süre</TableCell>
                        <TableCell>Tarih</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analyses.map(analysis => (
                        <TableRow key={analysis._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: `${getRoleColor(analysis.user.role)}.main` }}>
                                <Icon
                                  icon={
                                    analysis.user.role === 'admin'
                                      ? 'tabler:shield'
                                      : analysis.user.role === 'veterinarian'
                                      ? 'tabler:stethoscope'
                                      : 'tabler:user'
                                  }
                                />
                              </Avatar>
                              <Box>
                                <Typography variant='body2' fontWeight='medium'>
                                  {analysis.user.name}
                                </Typography>
                                <Typography variant='caption' color='text.secondary'>
                                  {analysis.user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={analysis.analysisType}
                              size='small'
                              color={getTypeColor(analysis.analysisType)}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>{getDominantResult(analysis)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Icon
                                icon={analysis.processedOnMobile ? 'tabler:device-mobile' : 'tabler:server'}
                                fontSize='small'
                              />
                              <Typography variant='body2'>{analysis.processedOnMobile ? 'Mobil' : 'Sunucu'}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>{analysis.processingTimeMs}ms</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>{formatDate(analysis.createdAt)}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, newPage) => setPage(newPage)}
                      color='primary'
                    />
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* En Aktif Kullanıcılar */}
      {stats && stats.topUsers.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='En Aktif Kullanıcılar (Son 30 Gün)' />
            <CardContent>
              <Grid container spacing={2}>
                {stats.topUsers.slice(0, 5).map((user, index) => (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    >
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{index + 1}</Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant='body2' fontWeight='medium'>
                          {user.userName}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {user.userEmail}
                        </Typography>
                      </Box>
                      <Chip label={`${user.analysisCount} analiz`} size='small' color='primary' />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

AdminAnalysisList.getLayout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>

export default AdminAnalysisList
