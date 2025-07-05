import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginAdmin.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Button, TextField, Box, InputAdornment, IconButton } from '@mui/material';

const LoginAdminTyping = () => {
  const [email_id, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [mobile_number, setMobileNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['myadmin', 'email_id_admin']);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login-admin-typeforadmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_id, password, mobile_number }),
      });

      if (response.ok) {
        const { tokenAdmin } = await response.json();

        if (tokenAdmin) {
          setCookie("myadmin", tokenAdmin, { path: "/", maxAge: 24 * 60 * 60 });
          setCookie("email_id_admin", email_id, { path: "/", maxAge: 24 * 60 * 60 });
          toast.success('Login successful!');
          navigate('/operator');
        } else {
          toast.error('Token not found in the response');
        }
      } else {
        const { message } = await response.json();
        toast.error(`Login Failed: ${message}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const toSignup = () => {
    navigate("/operator-register");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <ToastContainer />
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#4a4a4a' }}>Log In Operator</h2>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email_id}
          onChange={(e) => setEmailId(e.target.value)}
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

        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />

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
          Log In
        </Button>

        <Box
          textAlign="center"
          marginTop={2}
          fontSize="0.9rem"
          color="#6a11cb"
        >
          Need an account?{" "}
          <span className ="for-signup"
            onClick={toSignup}
            style={{ cursor: 'pointer', color: '#2575fc', fontWeight: 'bold' }}
          >
            Sign Up
          </span>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginAdminTyping;
