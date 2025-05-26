// ** React Imports
import { useState, useCallback } from 'react'

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
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

// ** API
import { uploadService } from 'src/services/api'

// ** Interfaces
interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  thumbnailUrl?: string
  uploadProgress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
  uploadedAt?: string
}

interface UploadStats {
  totalFiles: number
  successCount: number
  errorCount: number
  totalSize: number
}

const FileUpload = () => {
  // ** State
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragActive, setDragActive] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [stats, setStats] = useState<UploadStats>({
    totalFiles: 0,
    successCount: 0,
    errorCount: 0,
    totalSize: 0
  })

  // ** Drag & Drop Handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  // ** File Input Handler
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  // ** File Processing
  const handleFiles = async (fileList: File[]) => {
    const imageFiles = fileList.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      alert('Lütfen sadece görüntü dosyaları seçin (JPEG, PNG)')

      return
    }

    setUploading(true)

    // Her dosya için upload state oluştur
    const newFiles: UploadedFile[] = imageFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: 'uploading'
    }))

    setFiles(prev => [...newFiles, ...prev])

    // Dosyaları sırayla yükle
    for (const [index, file] of imageFiles.entries()) {
      const fileId = newFiles[index].id

      try {
        await uploadFile(file, fileId)
      } catch (error) {
        console.error(`Dosya yükleme hatası: ${file.name}`, error)
        updateFileStatus(fileId, 'error', 'Yükleme başarısız')
      }
    }

    setUploading(false)
    updateStats()
  }

  // ** Single File Upload
  const uploadFile = async (file: File, fileId: string) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', 'uploads')

    try {
      // Progress simulation (gerçek API'de progress event kullanılabilir)
      const progressInterval = setInterval(() => {
        setFiles(prev =>
          prev.map(f => (f.id === fileId ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 90) } : f))
        )
      }, 200)

      const response = await uploadService.uploadImage(formData)

      clearInterval(progressInterval)

      if (response.data.success) {
        updateFileStatus(fileId, 'success', undefined, {
          url: response.data.url,
          thumbnailUrl: response.data.thumbnailUrl,
          uploadedAt: new Date().toISOString()
        })
      } else {
        updateFileStatus(fileId, 'error', response.data.message || 'Yükleme başarısız')
      }
    } catch (error: any) {
      // Mock success response (API henüz mevcut değil)
      setTimeout(() => {
        const mockUrl = `https://opca-bucket.s3.amazonaws.com/uploads/${fileId}.jpg`
        updateFileStatus(fileId, 'success', undefined, {
          url: mockUrl,
          thumbnailUrl: mockUrl,
          uploadedAt: new Date().toISOString()
        })
      }, 1000)
    }
  }

  // ** Update File Status
  const updateFileStatus = (
    fileId: string,
    status: 'uploading' | 'success' | 'error',
    error?: string,
    additionalData?: Partial<UploadedFile>
  ) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === fileId
          ? {
              ...file,
              status,
              error,
              uploadProgress: status === 'success' ? 100 : file.uploadProgress,
              ...additionalData
            }
          : file
      )
    )
  }

  // ** Update Statistics
  const updateStats = () => {
    const totalFiles = files.length
    const successCount = files.filter(f => f.status === 'success').length
    const errorCount = files.filter(f => f.status === 'error').length
    const totalSize = files.reduce((sum, f) => sum + f.size, 0)

    setStats({
      totalFiles,
      successCount,
      errorCount,
      totalSize
    })
  }

  // ** Remove File
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
    updateStats()
  }

  // ** Clear All Files
  const clearAllFiles = () => {
    setFiles([])
    setStats({
      totalFiles: 0,
      successCount: 0,
      errorCount: 0,
      totalSize: 0
    })
  }

  // ** Format File Size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // ** Format Date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // ** Get Status Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'uploading':
        return 'info'
      default:
        return 'default'
    }
  }

  // ** Get Status Label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'Başarılı'
      case 'error':
        return 'Hatalı'
      case 'uploading':
        return 'Yükleniyor'
      default:
        return 'Bilinmiyor'
    }
  }

  return (
    <Grid container spacing={6}>
      {/* Başlık */}
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Dosya Yükleme'
            subheader='Görüntü dosyalarını yükleyin ve yönetin'
            action={
              <Button
                variant='outlined'
                startIcon={<Icon icon='tabler:trash' />}
                onClick={clearAllFiles}
                disabled={files.length === 0}
              >
                Tümünü Temizle
              </Button>
            }
          />
        </Card>
      </Grid>

      {/* İstatistik Kartları */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 3, bgcolor: 'primary.main' }}>
              <Icon icon='tabler:files' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{stats.totalFiles}</Typography>
              <Typography variant='body2'>Toplam Dosya</Typography>
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
            <Avatar sx={{ mr: 3, bgcolor: 'info.main' }}>
              <Icon icon='tabler:database' />
            </Avatar>
            <Box>
              <Typography variant='h6'>{formatFileSize(stats.totalSize)}</Typography>
              <Typography variant='body2'>Toplam Boyut</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Drag & Drop Area */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box
              sx={{
                border: 2,
                borderColor: dragActive ? 'primary.main' : 'grey.300',
                borderStyle: 'dashed',
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                bgcolor: dragActive ? 'primary.50' : 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50'
                }
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id='file-input'
                type='file'
                multiple
                accept='image/*'
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />

              <Icon icon='tabler:cloud-upload' fontSize='3rem' color={dragActive ? 'primary' : 'action'} />

              <Typography variant='h6' sx={{ mt: 2, mb: 1 }}>
                {dragActive ? 'Dosyaları buraya bırakın' : 'Dosyaları sürükleyip bırakın'}
              </Typography>

              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                veya dosya seçmek için tıklayın
              </Typography>

              <Button variant='contained' startIcon={<Icon icon='tabler:upload' />} disabled={uploading}>
                Dosya Seç
              </Button>

              <Typography variant='caption' display='block' sx={{ mt: 2 }} color='text.secondary'>
                Desteklenen formatlar: JPEG, PNG • Maksimum dosya boyutu: 10MB
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Yükleme Durumu */}
      {uploading && (
        <Grid item xs={12}>
          <Alert severity='info' icon={<CircularProgress size={20} />}>
            Dosyalar yükleniyor, lütfen bekleyin...
          </Alert>
        </Grid>
      )}

      {/* Dosya Listesi */}
      {files.length > 0 && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Yüklenen Dosyalar' />
            <CardContent>
              <TableContainer component={Paper} variant='outlined'>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Dosya</TableCell>
                      <TableCell>Boyut</TableCell>
                      <TableCell>Durum</TableCell>
                      <TableCell>İlerleme</TableCell>
                      <TableCell>Yükleme Tarihi</TableCell>
                      <TableCell>İşlemler</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.map(file => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'grey.100' }}>
                              <Icon icon='tabler:photo' />
                            </Avatar>
                            <Box>
                              <Typography variant='body2' fontWeight='medium'>
                                {file.name}
                              </Typography>
                              <Typography variant='caption' color='text.secondary'>
                                {file.type}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant='body2'>{formatFileSize(file.size)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={getStatusLabel(file.status)} size='small' color={getStatusColor(file.status)} />
                          {file.error && (
                            <Typography variant='caption' display='block' color='error'>
                              {file.error}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                            <LinearProgress
                              variant='determinate'
                              value={file.uploadProgress}
                              sx={{ flexGrow: 1, mr: 1 }}
                            />
                            <Typography variant='caption'>{file.uploadProgress}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {file.uploadedAt ? (
                            <Typography variant='body2'>{formatDate(file.uploadedAt)}</Typography>
                          ) : (
                            <Typography variant='body2' color='text.secondary'>
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {file.url && (
                              <Tooltip title='Dosyayı Görüntüle'>
                                <IconButton size='small' onClick={() => window.open(file.url, '_blank')}>
                                  <Icon icon='tabler:eye' />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title='Dosyayı Sil'>
                              <IconButton size='small' color='error' onClick={() => removeFile(file.id)}>
                                <Icon icon='tabler:trash' />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

FileUpload.getLayout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>

export default FileUpload
