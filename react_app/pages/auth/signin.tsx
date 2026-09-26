import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Avatar, Button, CircularProgress, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { SignInResponse, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FormEventHandler, useEffect, useState } from 'react'
import AppHead from '../../components/AppHead'
import Layout from '../../components/Layout'

export default function SignIn(): JSX.Element {
  const router = useRouter()
  const { status } = useSession()
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
  }, [router, status])

  const handlerSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    try {
      const response: SignInResponse | undefined = await signIn('credentials', {
        username: userInfo.username,
        password: userInfo.password,
        redirect: false,
        callbackUrl: '/'
      })
      if (response?.status !== 200) {
        setError('Login failed, please try again')
      } else {
        setError(null)
        setLoading(true)
        router.push('/')
      }
    } catch (err: any) {
      setLoading(false)
      setError(err.error)
    }
  }

  return (
    <>
      <AppHead title="Login with email" />

      <Layout>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login with email
          </Typography>
          <Box component="form" onSubmit={handlerSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={userInfo.username}
              onChange={({ target }) => {
                setUserInfo({ ...userInfo, username: target.value })
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={userInfo.password}
              onChange={({ target }) => {
                setUserInfo({ ...userInfo, password: target.value })
              }}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              Login
            </Button>
          </Box>

          {error && (
            <Typography component="p" color="red">
              {error}
            </Typography>
          )}

          {loading && <CircularProgress />}
        </Box>
      </Layout>
    </>
  )
}
