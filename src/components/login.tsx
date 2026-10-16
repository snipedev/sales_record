import { useState } from 'react';
import type React from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import { supabase } from '../Services/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);
    if (error) setError(error.message);
    // On success the session is stored automatically, and onAuthStateChange
    // in useSession() makes App switch to the main screens.
  };

  return (
    <Box className="login-page">
      <Paper className="login-card" elevation={0}>
        <Box className="login-brand-panel">
          <Box className="login-brand">
            <Box className="brand-mark">
              <StorefrontRoundedIcon fontSize="small" />
            </Box>
            <Box>
              <Box className="brand-name">Sales Desk</Box>
              <Box className="brand-caption">Sales workspace</Box>
            </Box>
          </Box>
          <Box className="login-brand-copy">
            <Box className="login-pill">YOUR BUSINESS, IN FOCUS</Box>
            <Typography component="h1" className="login-hero-title">
              Keep every sale moving forward.
            </Typography>
            <Typography className="login-hero-description">
              A clearer view of sales and records starts with a simple sign in.
            </Typography>
          </Box>
          <Box className="login-art" aria-hidden="true">
            <Box className="login-art-orbit orbit-one" />
            <Box className="login-art-orbit orbit-two" />
            <Box className="login-art-center">
              <StorefrontRoundedIcon sx={{ fontSize: 38 }} />
            </Box>
            <Box className="login-art-dot dot-one" />
            <Box className="login-art-dot dot-two" />
          </Box>
          <Box className="login-panel-footer">Simple tools for everyday business.</Box>
        </Box>

        <Box className="login-form-panel">
          <Box className="login-form-wrap">
            <Box className="login-form-icon">
              <LockOutlinedIcon fontSize="small" />
            </Box>
            <Typography component="h2" className="login-form-title">
              Welcome back
            </Typography>
            <Typography className="login-form-description">
              Sign in to continue to your workspace.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                label="Email address"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                className="primary-action"
                sx={{ mt: 2 }}
                disabled={loading || !email || !password}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </Box>
            <Typography className="login-secure-note">
              Your workspace is protected with secure sign in.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;