import { Box } from '@mui/system'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export default function Layout({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        background: '#F7F8FA'
      }}
    >
      <Box>
        <Navbar />
        {children}
      </Box>
      <Footer />
    </Box>
  )
}
