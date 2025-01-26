import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material"
import axios from "axios"

const loanCategories = ["Wedding Loans", "Home Construction Loans", "Business Startup Loans", "Education Loans"]

const UserDashboard = () => {
  const [loans, setLoans] = useState([])
  const [loanRequest, setLoanRequest] = useState({
    category: "",
    amount: "",
  })

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const response = await axios.get(`http://localhost:5000/api/loans/user/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setLoans(response.data)
    } catch (error) {
      console.error("Error fetching loans:", error)
    }
  }

  const handleLoanRequestChange = (e) => {
    setLoanRequest({ ...loanRequest, [e.target.name]: e.target.value })
  }

  const handleLoanRequestSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      await axios.post(
        "http://localhost:5000/api/loans/submit",
        { ...loanRequest, user: user.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      fetchLoans()
      setLoanRequest({ category: "", amount: "" })
    } catch (error) {
      console.error("Error submitting loan request:", error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#1565C0", fontWeight: "bold" }}>
        User Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#2E7D32", fontWeight: "bold" }}>
                Submit Loan Request
              </Typography>
              <Box component="form" onSubmit={handleLoanRequestSubmit}>
                <TextField
                  fullWidth
                  select
                  label="Loan Category"
                  name="category"
                  value={loanRequest.category}
                  onChange={handleLoanRequestChange}
                  required
                  sx={{ mb: 2 }}
                >
                  {loanCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  label="Loan Amount"
                  name="amount"
                  type="number"
                  value={loanRequest.amount}
                  onChange={handleLoanRequestChange}
                  required
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#2E7D32",
                    "&:hover": { backgroundColor: "#1B5E20" },
                  }}
                >
                  Submit Loan Request
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: "#2E7D32", fontWeight: "bold" }}>
                Your Loan Applications
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loans.map((loan) => (
                      <TableRow key={loan._id}>
                        <TableCell>{loan.category}</TableCell>
                        <TableCell>{loan.amount}</TableCell>
                        <TableCell>{loan.status}</TableCell>
                        <TableCell>{new Date(loan.createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default UserDashboard

