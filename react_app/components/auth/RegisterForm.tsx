import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import React, { SyntheticEvent, useContext, useState } from 'react'
import { LoginLink } from './LoginForm'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const isInvalid = password1 !== password2 || password1 === '' || email === '' || username === ''

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
        Register
      </Typography>
      <Box component="form" onSubmit={() => {}} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
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
        />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Register
        </Button>
        <Grid container>
          <Grid item xs>
            {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
          </Grid>
          <Grid item>
            {/* <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link> */}
          </Grid>
        </Grid>
      </Box>

      <LoginLink />

      {error && <div className="ui red message">{error}</div>}
    </Box>
  )
}

export const RegisterLink = () => (
  <p>
    Don&apos;t have an account? <Link href={'/register'}>Register</Link>
  </p>
)
