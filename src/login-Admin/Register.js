import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TextField, Button, Box, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const RegisterAdminTyping = () => {
  const [full_name, setFullName] = useState('');
  const [email_id, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [role, setRole] = useState('admin'); // Default role
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register-admin-typeforadmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name, password, email_id, mobile_number, role }),
      });

      if (response.ok) {
        const { message } = await response.json();
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: message,
        });
        navigate('/operator-login');
      } else {
        const { error } = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error,
        });
      }
    } catch (error) {
      console.error('Network error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Network error',
      });
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#4a4a4a' }}>Register</h2>

        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          margin="normal"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          type="email"
          value={email_id}
          onChange={(e) => setEmailId(e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="Mobile Number"
          variant="outlined"
          margin="normal"
          value={mobile_number}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="role-select-label">Select Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            label="Select Role"
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="typer">Typer</MenuItem>
            <MenuItem value="caller">Caller</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          type="submit"
          sx={{
            marginTop: 2,
            padding: 1,
            backgroundColor: '#6a11cb',
            '&:hover': {
              backgroundColor: '#2575fc',
            },
          }}
        >
          Register
        </Button>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            marginTop: 2,
            color: '#6a11cb',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/operator-login')}
        >
          Already registered? Log in
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterAdminTyping;
