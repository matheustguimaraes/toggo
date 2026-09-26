import { Grid, Typography } from '@mui/material'
import { Container } from '@mui/system'

export default function Dashboard() {
  return (
    <>
      <Container maxWidth="lg" sx={{ pt: 2, pb: 2 }}>
        <Grid container maxWidth="lg" sx={{ alignItems: 'center', pt: 4, pb: '12px' }}>
          <Typography component="h2" variant="h3" color="#051759" fontSize={38} fontWeight={600} gutterBottom>
            Dashboard
          </Typography>
        </Grid>
      </Container>
    </>
  )
}
