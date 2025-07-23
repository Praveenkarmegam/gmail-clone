import React, { useState } from 'react'
import { API_BASE } from '../services/emailService'  // ✅ import existing API_BASE

import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Link,
} from '@mui/material'
import axios from 'axios'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        email,
        password,
      })
      alert('Registered successfully')
      navigate('/login')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <Box maxWidth={400} mx="auto" mt={10}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
        <Typography variant="body2" align="center">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login">
            Back to Login
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}

export default Register
