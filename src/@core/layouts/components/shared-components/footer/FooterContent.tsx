// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const StyledCompanyName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  color: `${theme.palette.primary.main} !important`
}))

const FooterContent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2, display: 'flex', color: 'text.secondary' }}>
        {`© ${new Date().getFullYear()}, OpCa Veteriner Tanı Sistemi - Geliştirildi `}
        <Box component='span' sx={{ mx: 1, color: 'error.main' }}>
          ❤️
        </Box>
        {`ile`}
        <Typography sx={{ ml: 1 }} component={StyledCompanyName}>
          Hulusi Oflaz
        </Typography>
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography sx={{ color: 'text.secondary' }}>Veteriner Tanı ve Analiz Yönetim Sistemi</Typography>
      </Box>
    </Box>
  )
}

export default FooterContent
