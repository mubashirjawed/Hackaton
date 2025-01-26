import React, { useState } from "react"
import { Container, Typography, TextField, Button, Box, Paper, Alert, Grid } from "@mui/material"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import axios from "axios"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("https://hackaton-kappa-self.vercel.app/api/users/login", { email, password })
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      if (response.data.user.role === "admin") {
        navigate("/admin-dashboard")
      } else {
        navigate("/user-dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Invalid email or password")
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#1565C0", fontWeight: "bold" }}>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#2E7D32",
              "&:hover": { backgroundColor: "#1B5E20" },
            }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <RouterLink to="/register" style={{ color: "#1565C0", textDecoration: "none" }}>
                Don't have an account? Sign Up
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default LoginPage

