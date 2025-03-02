import React from "react";
import useAuth from "../hooks/useAuth";
import { Container, Button, Typography, Box, Alert, Paper } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const Login = () => {
  const { signInWithGoogle, error } = useAuth();

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "100vh" // Fullscreen center
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            textAlign: "center", 
            width: "100%",
            maxWidth: 400 
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
            Sign In
          </Typography>
          
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Access your account quickly and securely
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2, 
              py: 1.5, 
              fontSize: "1rem", 
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "none", // Remove uppercase style
            }}
            onClick={signInWithGoogle}
            startIcon={<GoogleIcon />}
          >
            Continue with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
