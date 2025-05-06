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

  return <Container maxWidth="false" sx={{ background: "linear-gradient(to right, #1a032a, #003366)", py: 0 }}>
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
      <Container maxWidth="md" sx={{ py: 6, bgcolor: "#1a365d", color: "#ffffff", borderRadius: 2, boxShadow: 3 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: "#63b3ed" }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ color: "#a0aec0" }}>
            Find answers to common questions about SwipeScout
          </Typography>
        </Box>
        <Box mb={4}>
          <TextField fullWidth variant="outlined" placeholder="Search FAQs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "#4299e1" }} /> }} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4, boxShadow: theme.shadows[1], backgroundColor: "#ffffff", color: "#2d3748" } }} />
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
                bgcolor:
                  activeCategory === category.id ? "#2c5282" : "transparent",
                color: activeCategory === category.id ? "#ffffff" : "#cbd5e0",
                borderColor: "#4299e1",
                "& .MuiChip-icon": {
                  fontSize: "1rem",
                  ml: 0.5,
                  color:
                    activeCategory === category.id ? "#ffffff" : "#4299e1"
                },
                "&:hover": {
                  bgcolor:
                    activeCategory === category.id ? "#2c5282" : "#2d3748"
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
                    backgroundColor:"rgba(56, 115, 182, 0.67)",
                    color: "#a0aec0",
                    borderRadius: "8px !important",
                    "&:before": { display: "none" },
                    "&:hover": {
                      backgroundColor: "rgba(56, 122, 197, 0.67)"
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#63b3ed" }} />}
                    sx={{
                      bgcolor: "#1a365d",
                      borderRadius: "8px 8px 0 0",
                      "&:hover": {
                        bgcolor: "#2c5282"
                      }
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="#63b3ed"
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" sx={{ color:"rgb(173, 215, 255)"  }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ) : <Box textAlign="center" py={4}>
                <Typography variant="h6" sx={{ color: "#e2e8f0" }}>
                  No FAQs found matching your search
                </Typography>
                <Typography variant="body2" mt={1} sx={{ color: "#a0aec0" }}>
                  Try different keywords or browse all categories
                </Typography>
              </Box>}
        </Box>
        <Divider sx={{ my: 4, borderColor: "#4299e1" }} />
        <Box textAlign="center">
          <Typography variant="h5" gutterBottom sx={{ color: "#63b3ed" }}>
            Still have questions?
          </Typography>
          <Typography variant="body1" sx={{ color: "#cbd5e0" }} mb={3}>
            Our support team is happy to help
          </Typography>
          <Chip label="Contact Support" variant="outlined" sx={{ px: 3, py: 1.5, fontSize: "1rem", cursor: "pointer", color: "#63b3ed", borderColor: "#63b3ed", "&:hover": { bgcolor: "#3182ce", color: "#ffffff" } }} onClick={() => (window.location.href = "/contact")} />
        </Box>
      </Container>
      <br />
      <br />
      <Footer2 />
    </Container>;
};

export default FAQPage;
