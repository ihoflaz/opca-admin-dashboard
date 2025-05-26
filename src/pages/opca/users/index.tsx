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
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Pagination from '@mui/material/Pagination'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import UserLayout from 'src/layouts/UserLayout'

// ** API
import { userService } from 'src/services/api'

// ** Interfaces
interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'veterinarian' | 'admin'
  createdAt: string
  updatedAt: string
}

interface UserStats {
  totalUsers: number
  recentUsers: number
  roleDistribution: {
    user: number
    veterinarian: number
    admin: number
  }
  monthlyRegistrations: Array<{
    _id: { year: number; month: number }
    count: number
  }>
}

interface UserFormData {
  name: string
  email: string
  password?: string
  role: 'user' | 'veterinarian' | 'admin'
}

const UserManagement = () => {
  // ** State
  const [loading, setLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ** Pagination & Filters
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [limit] = useState<number>(20)
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // ** Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false)
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })
  const [formLoading, setFormLoading] = useState<boolean>(false)

  // ** Kullanıcıları getir
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userService.getAllUsers(
        page,
        limit,
        roleFilter || undefined,
        searchTerm || undefined,
        'createdAt',
        'desc'
      )

      if (response.data.success) {
        setUsers(response.data.users)
        setTotalPages(response.data.pagination.totalPages)
        setTotalCount(response.data.pagination.totalCount)
      } else {
        // Mock data for testing
        const mockUsers: User[] = [
          {
            _id: '64f8a1b2c3d4e5f6a7b8c9d0',
            name: 'Admin Kullanıcı',
            email: 'admin@opca.com',
            role: 'admin',
            createdAt: '2023-09-01T10:00:00Z',
            updatedAt: '2023-09-01T10:00:00Z'
          },
          {
            _id: '64f8a1b2c3d4e5f6a7b8c9d1',
            name: 'Dr. Veteriner Hekim',
            email: 'vet@opca.com',
            role: 'veterinarian',
            createdAt: '2023-09-02T11:00:00Z',
            updatedAt: '2023-09-02T11:00:00Z'
          },
          {
            _id: '64f8a1b2c3d4e5f6a7b8c9d2',
            name: 'Test Kullanıcı',
            email: 'user@opca.com',
            role: 'user',
            createdAt: '2023-09-03T12:00:00Z',
            updatedAt: '2023-09-03T12:00:00Z'
          }
        ]
        setUsers(mockUsers)
        setTotalPages(1)
        setTotalCount(mockUsers.length)
      }
    } catch (error) {
      console.error('Kullanıcılar getirilirken hata oluştu:', error)
      setError('Kullanıcı listesi yüklenirken bir hata oluştu.')

      // Mock data on error
      const mockUsers: User[] = [
        {
          _id: '64f8a1b2c3d4e5f6a7b8c9d0',
          name: 'Admin Kullanıcı',
          email: 'admin@opca.com',
          role: 'admin',
          createdAt: '2023-09-01T10:00:00Z',
          updatedAt: '2023-09-01T10:00:00Z'
        },
        {
          _id: '64f8a1b2c3d4e5f6a7b8c9d1',
          name: 'Dr. Veteriner Hekim',
          email: 'vet@opca.com',
          role: 'veterinarian',
          createdAt: '2023-09-02T11:00:00Z',
          updatedAt: '2023-09-02T11:00:00Z'
        }
      ]
      setUsers(mockUsers)
      setTotalPages(1)
      setTotalCount(mockUsers.length)
    } finally {
      setLoading(false)
    }
  }

  // ** İstatistikleri getir
  const fetchStats = async () => {
    try {
      const response = await userService.getUserStats()

      if (response.data.success) {
        setStats(response.data.stats)
      } else {
        // Mock stats
        setStats({
          totalUsers: 150,
          recentUsers: 12,
          roleDistribution: {
            user: 120,
            veterinarian: 25,
            admin: 5
          },
          monthlyRegistrations: [
            { _id: { year: 2023, month: 9 }, count: 15 },
            { _id: { year: 2023, month: 10 }, count: 22 }
          ]
        })
      }
    } catch (error) {
      console.error('İstatistikler getirilirken hata oluştu:', error)

      // Mock stats on error
      setStats({
        totalUsers: 150,
        recentUsers: 12,
        roleDistribution: {
          user: 120,
          veterinarian: 25,
          admin: 5
        },
        monthlyRegistrations: []
      })
    }
  }

  // ** Kullanıcı oluştur
  const handleCreateUser = async () => {
    setFormLoading(true)
    try {
      const response = await userService.createUser(formData)

      if (response.data.success) {
        setCreateDialogOpen(false)
        setFormData({ name: '', email: '', password: '', role: 'user' })
        fetchUsers()
        fetchStats()
      }
    } catch (error) {
      console.error('Kullanıcı oluşturulurken hata oluştu:', error)
      setError('Kullanıcı oluşturulurken bir hata oluştu.')
    } finally {
      setFormLoading(false)
    }
  }

  // ** Kullanıcı güncelle
  const handleUpdateUser = async () => {
    if (!selectedUser) return

    setFormLoading(true)
    try {
      const updateData = { ...formData }
      if (!updateData.password) {
        delete updateData.password
      }

      const response = await userService.updateUser(selectedUser._id, updateData)

      if (response.data.success) {
        setEditDialogOpen(false)
        setSelectedUser(null)
        setFormData({ name: '', email: '', password: '', role: 'user' })
        fetchUsers()
        fetchStats()
      }
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata oluştu:', error)
      setError('Kullanıcı güncellenirken bir hata oluştu.')
    } finally {
      setFormLoading(false)
    }
  }

  // ** Kullanıcı sil
  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setFormLoading(true)
    try {
      const response = await userService.deleteUser(selectedUser._id)

      if (response.data.success) {
        setDeleteDialogOpen(false)
        setSelectedUser(null)
        fetchUsers()
        fetchStats()
      }
    } catch (error) {
      console.error('Kullanıcı silinirken hata oluştu:', error)
      setError('Kullanıcı silinirken bir hata oluştu.')
    } finally {
      setFormLoading(false)
    }
  }

  // ** Dialog açma fonksiyonları
  const openCreateDialog = () => {
    setFormData({ name: '', email: '', password: '', role: 'user' })
    setCreateDialogOpen(true)
  }

  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [page, roleFilter, searchTerm])

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin'
      case 'veterinarian':
        return 'Veteriner'
      case 'user':
        return 'Kullanıcı'
      default:
        return role
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
            title='Kullanıcı Yönetimi'
            subheader='Sistem kullanıcılarını yönetin ve izleyin'
            action={
              <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={openCreateDialog}>
                Yeni Kullanıcı
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
                  <Icon icon='tabler:users' />
                </Avatar>
                <Box>
                  <Typography variant='h6'>{stats.totalUsers}</Typography>
                  <Typography variant='body2'>Toplam Kullanıcı</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 3, bgcolor: 'success.main' }}>
                  <Icon icon='tabler:user-plus' />
                </Avatar>
                <Box>
                  <Typography variant='h6'>{stats.recentUsers}</Typography>
                  <Typography variant='body2'>Yeni Kullanıcı (30 gün)</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 3, bgcolor: 'warning.main' }}>
                  <Icon icon='tabler:stethoscope' />
                </Avatar>
                <Box>
                  <Typography variant='h6'>{stats.roleDistribution.veterinarian}</Typography>
                  <Typography variant='body2'>Veteriner</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ mr: 3, bgcolor: 'error.main' }}>
                  <Icon icon='tabler:shield' />
                </Avatar>
                <Box>
                  <Typography variant='h6'>{stats.roleDistribution.admin}</Typography>
                  <Typography variant='body2'>Admin</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </>
      )}

      {/* Filtreler */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={4} alignItems='center'>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label='Kullanıcı Ara'
                  placeholder='İsim veya e-posta'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Icon icon='tabler:search' />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Rol Filtresi</InputLabel>
                  <Select value={roleFilter} label='Rol Filtresi' onChange={e => setRoleFilter(e.target.value)}>
                    <MenuItem value=''>Tümü</MenuItem>
                    <MenuItem value='user'>Kullanıcı</MenuItem>
                    <MenuItem value='veterinarian'>Veteriner</MenuItem>
                    <MenuItem value='admin'>Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  variant='outlined'
                  startIcon={<Icon icon='tabler:refresh' />}
                  onClick={() => {
                    setSearchTerm('')
                    setRoleFilter('')
                    setPage(1)
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Kullanıcı Listesi */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Kullanıcılar' subheader={`Toplam ${totalCount} kullanıcı`} />
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
                        <TableCell>E-posta</TableCell>
                        <TableCell>Rol</TableCell>
                        <TableCell>Kayıt Tarihi</TableCell>
                        <TableCell>İşlemler</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map(user => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ mr: 2, bgcolor: `${getRoleColor(user.role)}.main` }}>
                                <Icon
                                  icon={
                                    user.role === 'admin'
                                      ? 'tabler:shield'
                                      : user.role === 'veterinarian'
                                      ? 'tabler:stethoscope'
                                      : 'tabler:user'
                                  }
                                />
                              </Avatar>
                              <Typography variant='body2' fontWeight='medium'>
                                {user.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>{user.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={getRoleLabel(user.role)} size='small' color={getRoleColor(user.role)} />
                          </TableCell>
                          <TableCell>
                            <Typography variant='body2'>{formatDate(user.createdAt)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title='Düzenle'>
                                <IconButton size='small' onClick={() => openEditDialog(user)}>
                                  <Icon icon='tabler:edit' />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title='Sil'>
                                <IconButton
                                  size='small'
                                  color='error'
                                  onClick={() => openDeleteDialog(user)}
                                  disabled={user.role === 'admin'}
                                >
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

      {/* Kullanıcı Oluştur Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Yeni Kullanıcı Oluştur</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Ad Soyad'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='E-posta'
                type='email'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Şifre'
                type='password'
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.role}
                  label='Rol'
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                >
                  <MenuItem value='user'>Kullanıcı</MenuItem>
                  <MenuItem value='veterinarian'>Veteriner</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>İptal</Button>
          <Button
            variant='contained'
            onClick={handleCreateUser}
            disabled={formLoading || !formData.name || !formData.email || !formData.password}
            startIcon={formLoading ? <CircularProgress size={16} /> : undefined}
          >
            Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kullanıcı Düzenle Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Kullanıcı Düzenle</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Ad Soyad'
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='E-posta'
                type='email'
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Yeni Şifre (opsiyonel)'
                type='password'
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                helperText='Şifreyi değiştirmek istemiyorsanız boş bırakın'
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={formData.role}
                  label='Rol'
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                >
                  <MenuItem value='user'>Kullanıcı</MenuItem>
                  <MenuItem value='veterinarian'>Veteriner</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>İptal</Button>
          <Button
            variant='contained'
            onClick={handleUpdateUser}
            disabled={formLoading || !formData.name || !formData.email}
            startIcon={formLoading ? <CircularProgress size={16} /> : undefined}
          >
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Kullanıcı Sil Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Kullanıcı Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedUser?.name}</strong> kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteUser}
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={16} /> : undefined}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

UserManagement.getLayout = (page: React.ReactNode) => <UserLayout>{page}</UserLayout>

export default UserManagement
