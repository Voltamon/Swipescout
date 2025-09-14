import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Helmet } from "react-helmet";

const VITE_API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const LAUNCH_DATE = new Date("2025-10-01T00:00:00Z");

function getTimeLeft() {
  const now = new Date();
  const diff = LAUNCH_DATE - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSubmitted(false);
    try {
      const res = await fetch(`${VITE_API_URL}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to join waitlist");
      }
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    } 
  };

  return (
    <>
      <Helmet>
        <title>SwipeScout | Coming Soon</title>
        <meta name="description" content="SwipeScout is coming soon. Join our waitlist to get notified!" />
      </Helmet>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h3" fontWeight={700} mb={2}>
              🚀 SwipeScout is Coming Soon!
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={3}>
              The next-generation video recruitment platform is almost here.<br />
              Enter your email to join our waitlist and be the first to know when we launch!
            </Typography>
            {/* Countdown Timer */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                Launching In:
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{timeLeft.days}</Typography>
                  <Typography variant="caption" color="text.secondary">Days</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{timeLeft.hours}</Typography>
                  <Typography variant="caption" color="text.secondary">Hours</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{timeLeft.minutes}</Typography>
                  <Typography variant="caption" color="text.secondary">Minutes</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>{timeLeft.seconds}</Typography>
                  <Typography variant="caption" color="text.secondary">Seconds</Typography>
                </Box>
              </Box>
            </Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                label="Your Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                fullWidth
                disabled={submitting || submitted}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || submitted || !email}
                fullWidth
                sx={{ py: 1.5, fontWeight: 600 }}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : "Join Waitlist"}
              </Button>
            </Box>
            {submitted && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Thank you! You'll be notified when we launch.
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;