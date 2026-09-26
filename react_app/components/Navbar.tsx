import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MouseEvent, useState } from 'react'

const PAGES = [
  {
    name: 'Feed',
    link: '/'
  }
]

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

export default function Navbar() {
  const { status } = useSession()
  const router = useRouter()

  const [pages, setPages] = useState(PAGES)

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const NavbarButton = (props: any) => (
    <Button
      sx={{
        mr: 3,
        display: 'block',
        textTransform: 'capitalize',
        fontWeight: router.pathname === props.href ? 600 : 500
      }}
      style={{
        color: router.pathname === props.href ? '#293155' : '#63697A'
      }}
      {...props}
    >
      {props.children}
    </Button>
  )

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 0 }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            textAlign: 'center'
          }}
        >
          <Box sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}>
            <Link href="/">
              <Image src="/images/logo.svg" width={65} height={65} alt="Logo" />
            </Link>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map(page => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link
                    href={page.link}
                    target={page.link.startsWith('https') ? '_blank' : ''}
                    rel={page.link.startsWith('https') ? 'noopener noreferrer' : ''}
                  >
                    <Typography textAlign="center" color="black" textTransform="lowercase">
                      {page.name}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Image src="/images/logo-white.svg" width={45} height={45} alt="Logo" />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: 'none',
                md: 'flex'
              },
              justifyContent: 'center'
            }}
          >
            {pages.map(page => (
              <NavbarButton
                key={page.name}
                href={page.link}
                target={page.link.startsWith('https') ? '_blank' : ''}
                rel={page.link.startsWith('https') ? 'noopener noreferrer' : ''}
                onClick={handleCloseNavMenu}
              >
                {page.name}
              </NavbarButton>
            ))}

            {status === 'unauthenticated' && <NavbarButton href="/login">Login</NavbarButton>}

            {status === 'authenticated' && <NavbarButton onClick={() => signOut()}>Sign out</NavbarButton>}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map(setting => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
