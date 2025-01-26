import React, { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material"
import axios from "axios"

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0)
  const [users, setUsers] = useState([])
  const [loans, setLoans] = useState([])

  useEffect(() => {
    fetchUsers()
    fetchLoans()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/loans/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setLoans(response.data)
    } catch (error) {
      console.error("Error fetching loans:", error)
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleUpdateLoanStatus = async (loanId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/loans/${loanId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )
      fetchLoans()
    } catch (error) {
      console.error("Error updating loan status:", error)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#1565C0", fontWeight: "bold" }}>
        Admin Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin dashboard tabs">
          <Tab label="Users" />
          <Tab label="Loan Applications" />
        </Tabs>
      </Box>
      <Card sx={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <CardContent>
          {tabValue === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>CNIC</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.cnic}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {tabValue === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan._id}>
                      <TableCell>{loan.user.fullName}</TableCell>
                      <TableCell>{loan.category}</TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>{loan.status}</TableCell>
                      <TableCell>{new Date(loan.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleUpdateLoanStatus(loan._id, "Approved")}
                          disabled={loan.status === "Approved"}
                          sx={{
                            mr: 1,
                            backgroundColor: "#2E7D32",
                            color: "white",
                            "&:hover": { backgroundColor: "#1B5E20" },
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleUpdateLoanStatus(loan._id, "Rejected")}
                          disabled={loan.status === "Rejected"}
                          sx={{ backgroundColor: "#C62828", color: "white", "&:hover": { backgroundColor: "#B71C1C" } }}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default AdminDashboard

