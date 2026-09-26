import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const loginToAws = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = { username, password }
    const sign = await signIn('credentials', { ...payload })
  }

  const isInvalid = password === '' || username === ''

  return (
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
        Login
      </Typography>
      <Box component="form" onSubmit={loginToAws} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          onChange={event => setUsername(event.target.value)}
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
          onChange={event => setPassword(event.target.value)}
        />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Login
        </Button>
        {/* <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
                Forgot password?
              </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
          </Grid>
        </Grid> */}
      </Box>

      {error && <div className="ui red message">{error}</div>}
    </Box>
  )
}

export const LoginLink = () => (
  <p>
    Already has an account? <Link href={'/login'}>Login</Link>
  </p>
)
