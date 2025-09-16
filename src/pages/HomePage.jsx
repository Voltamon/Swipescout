import React, { useState, useEffect, useMemo } from "react";
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

  // Generate a stable set of decorative shapes (30) once
  const shapes = useMemo(() => {
    const palette = ["#42B1BF", "#64b5f6", "#2196f3", "#a2eaf0", "#d0f4f2"];
    return Array.from({ length: 30 }).map((_, i) => {
      const size = Math.round(30 + Math.random() * 160); // px
      return {
        id: `shape-${i}`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        w: size,
        h: size,
        color: palette[Math.floor(Math.random() * palette.length)],
        delay: (Math.random() * 6).toFixed(2) + "s",
        duration: (6 + Math.random() * 8).toFixed(2) + "s",
        opacity: (0.06 + Math.random() * 0.16).toFixed(2),
      };
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update background color and add more shapes
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      #swipescout-bg-animated {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        z-index: 0;
        pointer-events: none;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(circle at center, #42B1BF 0%, #2196f3 100%);
        animation: gradientPulse 8s ease infinite;
      }

      @keyframes gradientPulse {
        0% {
          background-size: 100% 100%;
          filter: brightness(1) blur(8px);
        }
        50% {
          background-size: 120% 120%;
          filter: brightness(1.2) blur(12px);
        }
        100% {
          background-size: 100% 100%;
          filter: brightness(1) blur(8px);
        }
      }

      .swipescout-shape {
        position: absolute;
        border-radius: 50%;
        opacity: 0.15;
        backdrop-filter: blur(4px);
        animation: shapeFloat 6s ease-in-out infinite;
      }

      @keyframes shapeFloat {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        50% { transform: translate(10px, -15px) rotate(5deg); }
      }

      .countdown-box {
        animation: countdownPulse 2s ease-in-out infinite;
        transform-origin: center;
      }

      @keyframes countdownPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
    `;
    document.head.appendChild(style);

    let bgDiv = document.getElementById("swipescout-bg-animated");
    if (!bgDiv) {
      bgDiv = document.createElement("div");
      bgDiv.id = "swipescout-bg-animated";
      document.body.appendChild(bgDiv);
    }

    return () => {
      document.head.removeChild(style);
      if (bgDiv) bgDiv.remove();
    };
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* Many decorative shapes (stable positions) */}
        {shapes.map((s, i) => (
          <Box
            key={s.id}
            className="swipescout-shape"
            sx={{
              position: "absolute",
              left: s.left,
              top: s.top,
              width: s.w,
              height: s.h,
              backgroundColor: s.color,
              opacity: Number(s.opacity),
              borderRadius: "50%",
              zIndex: 0,
              // vary animation timing per-shape
              animationDelay: s.delay,
              animationDuration: s.duration,
              // hardware-accelerate
              transform: "translate3d(0,0,0)",
              willChange: "transform, opacity",
            }}
          />
        ))}

        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(66, 177, 191, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)",
                zIndex: 0,
              },
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
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={600} color="primary" gutterBottom>
                Launching In:
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
                {["days", "hours", "minutes", "seconds"].map((unit, i) => (
                  <Box
                    key={unit}
                    className="countdown-box"
                    sx={{
                      px: 3,
                      py: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    <Typography variant="h3" fontWeight={700} color="primary">
                      {timeLeft[unit]}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {unit.charAt(0).toUpperCase() + unit.slice(1)}
                    </Typography>
                  </Box>
                ))}
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
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submitting || submitted || !email}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 600,
                  background: "linear-gradient(45deg, #42B1BF 30%, #2196f3 90%)",
                  boxShadow: "0 3px 5px 2px rgba(33, 150, 243, .3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 10px 4px rgba(33, 150, 243, .3)",
                  }
                }}
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