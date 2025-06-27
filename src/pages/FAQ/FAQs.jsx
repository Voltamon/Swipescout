import React, { useState } from "react";
import Header3 from "../../components/Header3/Header3";
import Footer2 from "../../components/Footer2/Footer2";
import { Helmet } from "react-helmet";


import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Box,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Help as HelpIcon
} from "@mui/icons-material";

const FAQPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const faqData = [
    {
      category: "general",
      question: "What is SwipeScout?",
      answer:
        "SwipeScout is a modern recruitment platform that connects job seekers with employers through video profiles and AI-powered matching. We make hiring more personal and efficient."
    },
    {
      category: "job-seekers",
      question: "How do I create a video resume?",
      answer:
        'Navigate to your profile and click "Create Video Resume". You can record directly or upload a 45-second video showcasing your skills and personality.'
    },
    {
      category: "job-seekers",
      question: "Is my video resume publicly visible?",
      answer:
        "You control visibility in Settings. Choose between public, only to employers you apply to, or private until you activate it."
    },
    {
      category: "employers",
      question: "How much does it cost to post jobs?",
      answer:
        "We offer free basic listings. Premium plans with advanced features start at $99/month. Volume discounts available for enterprise clients."
    },
    {
      category: "technical",
      question: "What video formats are supported?",
      answer:
        "We support MP4, MOV, and WebM formats up to 100MB. Recommended resolution is 1080p (1920x1080) for optimal quality."
    },
    {
      category: "technical",
      question: "Why is my video upload failing?",
      answer:
        "Check file size (<100MB), format, and internet connection. If issues persist, try compressing your video or contact support."
    },
    {
      category: "general",
      question: "How does matching work?",
      answer:
        "Our AI analyzes job requirements and candidate profiles to suggest the best matches. Employers and candidates can then connect directly."
    },
    {
      category: "employers",
      question: "Can I search candidates by skills?",
      answer:
        "Yes! Use our advanced search filters to find candidates by skills, experience level, location, and more."
    }
  ];

  const categories = [
    { id: "all", label: "All FAQs" },
    { id: "general", label: "General" },
    { id: "job-seekers", label: "Job Seekers" },
    { id: "employers", label: "Employers" },
    { id: "technical", label: "Technical" }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container
      maxWidth="false"
      sx={{
        background: "linear-gradient(135deg, rgb(185, 229, 255) 0%, rgb(162, 194, 241) 100%)", // Main background as requested
        px: 0 ,width:'100%'
      }}
    >
      <Helmet>
        <title>SwipeScout FAQs | Answers to Common Questions</title>
        <meta name="description" content="Find answers to frequently asked questions about SwipeScout's video resume platform, job matching, and employer solutions." />
        <meta name="keywords" content="SwipeScout FAQ, video resume questions, job matching help, employer solutions, recruitment platform support" />
        <meta property="og:title" content="SwipeScout FAQs | Get Help With Our Platform" />
        <meta property="og:description" content="Answers to common questions about using SwipeScout for job seekers and employers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.swipescout.xyz/faq" />
        <link rel="canonical" href="https://www.swipescout.xyz/faq" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                ${faqData.map(faq => `
                {
                  "@type": "Question",
                  "name": "${faq.question}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${faq.answer.replace(/"/g, '\\"')}"
                  }
                }`).join(',')}
              ]
            }
          `}
        </script>
      </Helmet>
      <Header3 />
      <Container
        maxWidth="md"
        sx={{
          py: 6,
          bgcolor: "#E3F2FD", // Very light blue for inner container background
          color: "#212121", // Very dark gray for general text inside this container
          borderRadius: 2,
          boxShadow: 3,
          mt:2
        }}
      >
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#0D47A1" }}> {/* Darker, strong blue for heading */}
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ color: "#424242" }}> {/* Dark gray for body text */}
            Find answers to common questions about SwipeScout
          </Typography>
        </Box>
        <Box mb={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "#0D47A1" }} /> // Dark blue for search icon
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                boxShadow: theme.shadows[1],
                backgroundColor: "#ffffff", // Keep white for input background
                color: "#212121" // Dark gray for input text
              }
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4, justifyContent: isMobile ? "center" : "flex-start" }}>
          {categories.map(category =>
            <Chip
              key={category.id}
              label={category.label}
              onClick={() => setActiveCategory(category.id)}
              color={activeCategory === category.id ? "primary" : "default"}
              variant={activeCategory === category.id ? "filled" : "outlined"}
              icon={category.id === "all" ? <HelpIcon /> : <CategoryIcon />}
              sx={{
                px: 1,
                // Active Chip
                bgcolor:
                  activeCategory === category.id ? "#0D47A1" : "transparent", // Dark blue for active chip background
                color: activeCategory === category.id ? "#ffffff" : "#424242", // White text for active, dark gray for default
                // Default Chip
                borderColor: "#0D47A1", // Dark blue border for default
                "& .MuiChip-icon": {
                  fontSize: "1rem",
                  ml: 0.5,
                  color:
                    activeCategory === category.id ? "#ffffff" : "#0D47A1" // White icon for active, dark blue for default
                },
                "&:hover": {
                  bgcolor:
                    activeCategory === category.id ? "#0D47A1" : "#BBDEFB" // Dark blue for active hover, lighter blue for default hover
                }
              }}
            />
          )}
        </Box>
        <Box mb={6}>
          {filteredFaqs.length > 0 ? filteredFaqs.map((faq, index) =>
                <Accordion
                  key={index}
                  elevation={2}
                  sx={{
                    mb: 2,
                    backgroundColor: "#BBDEFB", // Lighter blue for accordion body background
                    color: "#424242", // Dark gray for accordion body text
                    borderRadius: "8px !important",
                    "&:before": { display: "none" },
                    "&:hover": {
                      backgroundColor: "#90CAF9" // Slightly darker light blue on hover
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#0D47A1" }} />} // Dark blue for expand icon
                    sx={{
                      bgcolor: "#90CAF9", // Medium light blue for accordion header background
                      borderRadius: "8px 8px 0 0",
                      "&:hover": {
                        bgcolor: "#64B5F6" // Slightly darker blue on hover
                      }
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="#0D47A1" // Darker, strong blue for question text
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ color:"#424242" }}> {/* Dark gray for answer text */}
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ) : <Box textAlign="center" py={4}>
                <Typography variant="h6" sx={{ color: "#212121" }}> {/* Very dark gray */}
                  No FAQs found matching your search
                </Typography>
                <Typography variant="body2" mt={1} sx={{ color: "#424242" }}> {/* Dark gray */}
                  Try different keywords or browse all categories
                </Typography>
              </Box>}
        </Box>
        <Divider sx={{ my: 4, borderColor: "#0D47A1" }} /> {/* Darker, strong blue for divider */}
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom sx={{ color: "#0D47A1" }}> {/* Darker, strong blue */}
            Still have questions?
          </Typography>
          <Typography variant="body1" sx={{ color: "#424242" }} mb={3}> {/* Dark gray */}
            Our support team is happy to help
          </Typography>
          <Chip
            label="Contact Support"
            variant="outlined"
            sx={{
              px: 3,
              py: 1.5,
              fontSize: "1rem",
              cursor: "pointer",
              color: "#0D47A1", // Dark blue for chip text
              borderColor: "#0D47A1", // Dark blue for chip border
              "&:hover": {
                bgcolor: "#1976D2", // Medium dark blue on hover
                color: "#ffffff" // White text on hover
              }
            }}
            onClick={() => (window.location.href = "/contact")}
          />
        </Box>
      </Container>
      <br />
      <br />
      <Footer2 />
    </Container>
  );
};

export default FAQPage;