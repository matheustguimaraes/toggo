import { Typography } from '@mui/material'
import { Container } from '@mui/system'
import Link from 'next/link'

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Chegados
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default function Footer() {
  return (
    <Container
      maxWidth="md"
      component="footer"
      sx={{
        py: [3, 6]
      }}
    >
      <Copyright sx={{ mt: 0 }} />
    </Container>
  )
}
