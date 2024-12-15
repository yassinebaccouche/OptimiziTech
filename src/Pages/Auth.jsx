import React, { useState } from "react";
import { TextField, Button, Typography, Box, Grid, Snackbar } from '@mui/material';
import '@fontsource/roboto'; // Professional font
import '@fontsource/bebas-neue'; // For bold headers
import AuthController from "../Controllers/AuthController"; // Import the AuthController
import { useNavigate } from 'react-router-dom';
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const [role, setRole] = useState("Admin"); // New state for role
  const [nom, setNom] = useState(""); 
  const [prenom, setPrenom] = useState(""); 
  const [num, setnum] = useState(""); 
  const [isVerified , setisVerified] = useState("false"); 
  const [payment , setisPayment] = useState("Gratuit"); 
  const [profilePic, setProfilePic] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to manage forgot password flow
  const [resetEmail, setResetEmail] = useState(""); // Email for password reset
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state for feedback
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Snackbar message
  const [errorMessage, setErrorMessage] = useState(""); // Snackbar error message
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isForgotPassword) {
        await AuthController.handleForgotPassword(resetEmail); // Call forgot password method
        setFeedbackMessage("Password reset link sent to your email.");
        setOpenSnackbar(true);
      } else if (isLogin) {
        await AuthController.handleLogin(email, password);
        setFeedbackMessage("Login successful");
        setOpenSnackbar(true);
        navigate('/AddResto');
      } else {
        await AuthController.handleSignup(email, password, num,  nom,prenom,role, isVerified, payment,profilePic);
        setFeedbackMessage("Signup successful");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setErrorMessage("Error: " + error.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <Grid container sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Image Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: 'relative',
          background: `url('./assets/images/lg_image.png') no-repeat center center`,
          backgroundSize: 'cover',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8))',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            textAlign: 'center',
            px: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { xs: '36px', md: '48px' },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
           Bienvenue chez Optimizi Tech
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '80%',
              mx: 'auto',
            }}
          >
          Connectez-vous à votre compte et gérez votre entreprise en toute transparence.
          </Typography>
        </Box>
      </Grid>

      {/* Right Form Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <img
            src={"/assets/images/Logo.png"}
            alt="Optimizi Tech Logo"
            style={{
              height: '50px',
              marginRight: '10px',
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '36px', md: '48px' },
              fontWeight: 'bold',
              fontFamily: '"Bebas Neue", sans-serif',
              color: '#344054',
            }}
          >
            OPTIMIZI TECH
          </Typography>
        </Box>

        {/* Sign-In/Signup/Forgot Password Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            padding: 3,
            background: '#f8f9fa',
            borderRadius: '15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: '24px',
              fontWeight: 500,
              color: '#344054',
              marginBottom: 3,
            }}
          >
            {isForgotPassword ? "Reset Your Password" : isLogin ? "Sign In" : "Sign Up"}
          </Typography>

          {/* Email & Password Fields */}
          {!isForgotPassword && (
            <>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  marginBottom: 3,
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  marginBottom: 3,
                }}
              />
            </>
          )}

          {/* Forgot Password Email Field */}
          {isForgotPassword && (
            <TextField
              fullWidth
              label="Enter your email"
              type="email"
              variant="outlined"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              sx={{
                marginBottom: 3,
              }}
            />
          )}

          {/* Signup Fields */}
          {!isLogin && !isForgotPassword && (
            <>
            
              <TextField
                fullWidth
                label="num"
                type="text"
                variant="outlined"
                value={num}
                onChange={(e) => setnum(e.target.value)}
                sx={{
                  marginBottom: 3,
                }}
              />
                <TextField
                fullWidth
                label="nom"
                type="text"
                variant="outlined"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                sx={{
                  marginBottom: 3,
                }}
              />
                <TextField
                fullWidth
                label="prenom"
                type="text"
                variant="outlined"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                sx={{
                  marginBottom: 3,
                }}
              />
            </>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #6a11cb, #2575fc)',
              color: '#fff',
              fontSize: '16px',
              padding: 2,
              textTransform: 'uppercase',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                background: 'linear-gradient(to right, #2575fc, #6a11cb)',
              },
            }}
          >
            {isForgotPassword ? "Send Reset Link" : isLogin ? "Login" : "Signup"}
          </Button>
        </Box>

        {/* Switch between Login, Signup, and Forgot Password */}
        <Box sx={{ marginTop: 3 }}>
          {!isForgotPassword && (
            <>
              <Button onClick={() => setIsLogin(!isLogin)} variant="text">
                {isLogin ? "Switch to Signup" : "Switch to Login"}
              </Button>
              <Button onClick={() => setIsForgotPassword(true)} variant="text">
                Forgot Password?
              </Button>
            </>
          )}

          {isForgotPassword && (
            <Button onClick={() => setIsForgotPassword(false)} variant="text">
              Back to Login
            </Button>
          )}
        </Box>
      </Grid>

      {/* Snackbar for Feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={feedbackMessage || errorMessage}
        sx={{
          backgroundColor: errorMessage ? 'red' : 'green',
        }}
      />
    </Grid>
  );
};

export default Auth;
