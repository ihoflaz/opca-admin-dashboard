// ** React Imports
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { ApexOptions } from 'apexcharts'
import format from 'date-fns/format'
import { tr } from 'date-fns/locale'

// ** Dynamic Import for ApexCharts (SSR safe)
const ReactApexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

// ** API
import { analysisService, adminService } from 'src/services/api'

// ** Interfaces
interface DashboardStats {
  totalAnalyses: number
  parasiteAnalyses: number
  mnistAnalyses: number
  todayAnalyses: number
  avgConfidence: number
  topParasites: { type: string; count: number; percentage: number }[]
  topDigits: { value: number; count: number; percentage: number }[]
  deviceStats: { device: string; count: number; percentage: number }[]
  weeklyData: { day: string; parasite: number; mnist: number }[]
}

const OpCaDashboard = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    parasiteAnalyses: 0,
    mnistAnalyses: 0,
    todayAnalyses: 0,
    avgConfidence: 0,
    topParasites: [],
    topDigits: [],
    deviceStats: [],
    weeklyData: []
  })

  // ** Chart Options
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: stats.weeklyData.map(item => item.day)
    },
    yaxis: {
      title: {
        text: 'Analiz Sayısı'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' analiz'
        }
      }
    },
    colors: ['#28a745', '#007bff']
  }

  const chartSeries = [
    {
      name: 'Parazit',
      data: stats.weeklyData.map(item => item.parasite)
    },
    {
      name: 'MNIST',
      data: stats.weeklyData.map(item => item.mnist)
    }
  ]

  // ** Pie Chart Options
  const pieOptions: ApexOptions = {
    chart: {
      type: 'pie',
      height: 300
    },
    labels: ['Parazit Analizleri', 'MNIST Analizleri'],
    colors: ['#28a745', '#007bff'],
    legend: {
      position: 'bottom'
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' analiz'
        }
      }
    }
  }

  const pieSeries = [stats.parasiteAnalyses, stats.mnistAnalyses]

  // ** Dashboard verilerini getir
  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Admin endpoint'ini kullanarak tüm analizleri getir
      let response
      try {
        response = await adminService.getAllAnalyses(1, 1000)
      } catch (adminError) {
        // Admin endpoint başarısız olursa normal endpoint'i kullan
        console.log('Admin endpoint kullanılamıyor, normal endpoint deneniyor...')
        response = await analysisService.getAnalyses(1, 1000)
      }

      if (response.data.success && response.data.analyses) {
        const analyses = response.data.analyses

        // İstatistikleri hesapla
        const totalAnalyses = analyses.length
        const parasiteAnalyses = analyses.filter((a: any) => a.analysisType === 'Parasite').length
        const mnistAnalyses = analyses.filter((a: any) => a.analysisType === 'MNIST').length

        // Bugünkü analizler
        const today = new Date().toISOString().split('T')[0]
        const todayAnalyses = analyses.filter((a: any) => {
          const analysisDate = new Date(a.timestamp || a.createdAt).toISOString().split('T')[0]

          return analysisDate === today
        }).length

        // Ortalama güven skoru
        let totalConfidence = 0
        let confidenceCount = 0
        analyses.forEach((a: any) => {
          if (a.dominantResult && a.dominantResult.confidence) {
            totalConfidence += a.dominantResult.confidence
            confidenceCount++
          }
        })
        const avgConfidence = confidenceCount > 0 ? (totalConfidence / confidenceCount) * 100 : 0

        // En çok tespit edilen parazitler
        const parasiteTypes: { [key: string]: number } = {}
        analyses
          .filter((a: any) => a.analysisType === 'Parasite')
          .forEach((a: any) => {
            if (a.dominantResult && a.dominantResult.type) {
              parasiteTypes[a.dominantResult.type] = (parasiteTypes[a.dominantResult.type] || 0) + 1
            }
          })
        const topParasites = Object.entries(parasiteTypes)
          .map(([type, count]) => ({
            type,
            count,
            percentage: (count / parasiteAnalyses) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        // En çok tespit edilen rakamlar
        const digitValues: { [key: number]: number } = {}
        analyses
          .filter((a: any) => a.analysisType === 'MNIST')
          .forEach((a: any) => {
            if (a.dominantResult && typeof a.dominantResult.value === 'number') {
              digitValues[a.dominantResult.value] = (digitValues[a.dominantResult.value] || 0) + 1
            }
          })
        const topDigits = Object.entries(digitValues)
          .map(([value, count]) => ({
            value: parseInt(value),
            count,
            percentage: (count / mnistAnalyses) * 100
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        // Cihaz istatistikleri (mock data - API'de deviceInfo eksik)
        const deviceStats = [
          { device: 'Android', count: Math.floor(totalAnalyses * 0.6), percentage: 60 },
          { device: 'iOS', count: Math.floor(totalAnalyses * 0.3), percentage: 30 },
          { device: 'Web', count: Math.floor(totalAnalyses * 0.1), percentage: 10 }
        ]

        // Haftalık veri (son 7 gün)
        const weeklyData = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dayStr = date.toISOString().split('T')[0]
          const dayName = format(date, 'EEE', { locale: tr })

          const dayParasite = analyses.filter((a: any) => {
            const analysisDate = new Date(a.timestamp || a.createdAt).toISOString().split('T')[0]

            return analysisDate === dayStr && a.analysisType === 'Parasite'
          }).length

          const dayMnist = analyses.filter((a: any) => {
            const analysisDate = new Date(a.timestamp || a.createdAt).toISOString().split('T')[0]

            return analysisDate === dayStr && a.analysisType === 'MNIST'
          }).length

          weeklyData.push({
            day: dayName,
            parasite: dayParasite,
            mnist: dayMnist
          })
        }

        setStats({
          totalAnalyses,
          parasiteAnalyses,
          mnistAnalyses,
          todayAnalyses,
          avgConfidence,
          topParasites,
          topDigits,
          deviceStats,
          weeklyData
        })
      }
    } catch (error) {
      console.error('Dashboard verileri getirilirken hata oluştu:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <Grid container spacing={6}>
      {/* İstatistik Kartları */}
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
              <Icon icon='tabler:bug' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{stats.parasiteAnalyses}</Typography>
              <Typography variant='body2'>Parazit Analizi</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 3, bgcolor: 'info.main' }}>
              <Icon icon='tabler:numbers' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{stats.mnistAnalyses}</Typography>
              <Typography variant='body2'>MNIST Analizi</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 3, bgcolor: 'warning.main' }}>
              <Icon icon='tabler:calendar-today' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{stats.todayAnalyses}</Typography>
              <Typography variant='body2'>Bugünkü Analiz</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Haftalık Analiz Grafiği */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title='Son 7 Günlük Analiz Dağılımı' />
          <CardContent>
            {!loading && <ReactApexcharts type='bar' height={350} options={chartOptions} series={chartSeries} />}
          </CardContent>
        </Card>
      </Grid>

      {/* Analiz Türü Dağılımı */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title='Analiz Türü Dağılımı' />
          <CardContent>
            {!loading && <ReactApexcharts type='pie' height={300} options={pieOptions} series={pieSeries} />}
          </CardContent>
        </Card>
      </Grid>

      {/* Ortalama Güven Skoru */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='Ortalama Güven Skoru' />
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant='h4' sx={{ mr: 2 }}>
                {stats.avgConfidence.toFixed(1)}%
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={stats.avgConfidence >= 80 ? 'Yüksek' : stats.avgConfidence >= 60 ? 'Orta' : 'Düşük'}
                color={stats.avgConfidence >= 80 ? 'success' : stats.avgConfidence >= 60 ? 'warning' : 'error'}
              />
            </Box>
            <LinearProgress variant='determinate' value={stats.avgConfidence} sx={{ height: 8, borderRadius: 4 }} />
            <Typography variant='body2' sx={{ mt: 1, color: 'text.secondary' }}>
              Tüm analizlerin ortalama güven skoru
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* En Çok Tespit Edilen Parazitler */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='En Çok Tespit Edilen Parazitler' />
          <CardContent>
            {stats.topParasites.map(parasite => (
              <Box key={parasite.type} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant='body2' sx={{ minWidth: 120 }}>
                  {parasite.type}
                </Typography>
                <Box sx={{ flexGrow: 1, mx: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={parasite.percentage}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Typography variant='body2' sx={{ minWidth: 40 }}>
                  {parasite.count}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* En Çok Tespit Edilen Rakamlar */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='En Çok Tespit Edilen Rakamlar' />
          <CardContent>
            {stats.topDigits.map(digit => (
              <Box key={digit.value} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant='body2' sx={{ minWidth: 60 }}>
                  Rakam {digit.value}
                </Typography>
                <Box sx={{ flexGrow: 1, mx: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={digit.percentage}
                    sx={{ height: 6, borderRadius: 3 }}
                    color='info'
                  />
                </Box>
                <Typography variant='body2' sx={{ minWidth: 40 }}>
                  {digit.count}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>

      {/* Cihaz İstatistikleri */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title='Cihaz Kullanım İstatistikleri' />
          <CardContent>
            {stats.deviceStats.map(device => (
              <Box key={device.device} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                  <Icon
                    icon={
                      device.device === 'Android'
                        ? 'tabler:brand-android'
                        : device.device === 'iOS'
                        ? 'tabler:brand-apple'
                        : 'tabler:world-www'
                    }
                  />
                </Avatar>
                <Typography variant='body2' sx={{ minWidth: 80 }}>
                  {device.device}
                </Typography>
                <Box sx={{ flexGrow: 1, mx: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={device.percentage}
                    sx={{ height: 6, borderRadius: 3 }}
                    color={device.device === 'Android' ? 'success' : device.device === 'iOS' ? 'info' : 'warning'}
                  />
                </Box>
                <Typography variant='body2' sx={{ minWidth: 40 }}>
                  {device.count}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

OpCaDashboard.getLayout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>

export default OpCaDashboard
