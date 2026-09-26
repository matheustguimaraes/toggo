import { CircularProgress } from '@mui/material'
import { Box, Container } from '@mui/system'

export default function LoadingCircularProgress() {
  return (
    <Container maxWidth="xl" sx={{ pt: 2, pb: 2 }}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    </Container>
  )
}
