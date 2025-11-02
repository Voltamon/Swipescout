import React, { useState } from 'react';
import Header from "../../components/Headers/Header";
import Footer from "../../components/Headers/Footer";
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/UI/card.jsx";
import { Input } from "@/components/UI/input.jsx";
import { Badge } from "@/components/UI/badge.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/accordion.jsx";
import {
  Search,
  HelpCircle,
  LayoutGrid,
  ChevronDown
} from "lucide-react";

const FAQPage = () => {
  const { t } = useTranslation('faq');
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const faqData = [
    {
      category: "general",
      question: t('questions.whatIsSwipeScout.question'),
      answer: t('questions.whatIsSwipeScout.answer')
    },
    {
      category: "job-seekers",
      question: t('questions.createVideoResume.question'),
      answer: t('questions.createVideoResume.answer')
    },
    {
      category: "job-seekers",
      question: t('questions.videoVisibility.question'),
      answer: t('questions.videoVisibility.answer')
    },
    {
      category: "employers",
      question: t('questions.jobPostingCost.question'),
      answer: t('questions.jobPostingCost.answer')
    },
    {
      category: "technical",
      question: t('questions.videoFormats.question'),
      answer: t('questions.videoFormats.answer')
    },
    {
      category: "technical",
      question: t('questions.uploadFailing.question'),
      answer: t('questions.uploadFailing.answer')
    },
    {
      category: "general",
      question: t('questions.howMatching.question'),
      answer: t('questions.howMatching.answer')
    },
    {
      category: "employers",
      question: t('questions.searchCandidates.question'),
      answer: t('questions.searchCandidates.answer')
    }
  ];

  const categories = [
    { id: "all", label: t('categories.all') },
    { id: "general", label: t('categories.general') },
    { id: "job-seekers", label: t('categories.jobSeekers') },
    { id: "employers", label: t('categories.employers') },
    { id: "technical", label: t('categories.technical') }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
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
      
      <Header width='120%' />
      
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h1>
              <p className="text-gray-600 text-lg">
                Find answers to common questions about SwipeScout
              </p>
            </div>

            {/* Search Box */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-lg shadow-sm"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
              {categories.map(category => (
                <Badge
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 cursor-pointer transition-all duration-200 ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700"
                      : "bg-white text-gray-700 border border-purple-200 hover:bg-purple-50"
                  }`}
                >
                  {category.id === "all" ? (
                    <HelpCircle className="h-4 w-4 inline mr-1" />
                  ) : (
                    <LayoutGrid className="h-4 w-4 inline mr-1" />
                  )}
                  {category.label}
                </Badge>
              ))}
            </div>

            {/* FAQ Accordion */}
            <div className="mb-8">
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <span className="text-left font-semibold text-purple-900">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No FAQs found matching your search
                  </h3>
                  <p className="text-gray-500">
                    Try different keywords or browse all categories
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-purple-200 my-8"></div>

            {/* Contact Support Section */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Still have questions?
              </h2>
              <p className="text-gray-600 mb-6">
                Our support team is happy to help
              </p>
              <button
                onClick={() => (window.location.href = "/contact")}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Contact Support
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default FAQPage;
