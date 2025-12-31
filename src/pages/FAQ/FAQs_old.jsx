import i18n from 'i18next';
import React, { useContext, useState  } from 'react';
import Header from "../../components/Headers/Header";
import Footer from "../../components/Headers/Footer";
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const faqData = [
    {
      category: "general",
      question: t('faq.questions.whatIsSwipeScout.question'),
      answer: t('faq.questions.whatIsSwipeScout.answer')
    },
    {
      category: "job-seekers",
      question: t('faq.questions.createVideoResume.question'),
      answer: t('faq.questions.createVideoResume.answer')
    },
    {
      category: "job-seekers",
      question: t('faq.questions.videoVisibility.question'),
      answer: t('faq.questions.videoVisibility.answer')
    },
    {
      category: "employers",
      question: t('faq.questions.jobPostingCost.question'),
      answer: t('faq.questions.jobPostingCost.answer')
    },
    {
      category: "technical",
      question: t('faq.questions.videoFormats.question'),
      answer: t('faq.questions.videoFormats.answer')
    },
    {
      category: "technical",
      question: t('faq.questions.uploadFailing.question'),
      answer: t('faq.questions.uploadFailing.answer')
    },
    {
      category: "general",
      question: t('faq.questions.howMatching.question'),
      answer: t('faq.questions.howMatching.answer')
    },
    {
      category: "employers",
      question: t('faq.questions.searchCandidates.question'),
      answer: t('faq.questions.searchCandidates.answer')
    }
  ];

  const categories = [
    { id: "all", label: t('faq.categories.all') },
    { id: "general", label: t('faq.categories.general') },
    { id: "job-seekers", label: t('faq.categories.jobSeekers') },
    { id: "employers", label: t('faq.categories.employers') },
    { id: "technical", label: t('faq.categories.technical') }
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
   <Box sx={{
        background: "linear-gradient(135deg, rgb(185, 229, 255) 0%, rgb(162, 194, 241) 100%)", // Main background as requested
        p: 0 ,width:'100%' ,m:0
      }} >
    
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
      </Helmet >
      <Header width='120%' />
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
            placeholder={i18n.t('auto_search_faqs')} 
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
            label={i18n.t('auto_contact_support')} 
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
      <Footer />
    </Box>
  );
};

export default FAQPage;