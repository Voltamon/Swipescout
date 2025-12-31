import i18n from 'i18next';
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/UI/card.jsx";
import { Input } from "@/components/UI/input.jsx";
import { Button } from "@/components/UI/button.jsx";
import { Badge } from "@/components/UI/badge.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs.jsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/UI/accordion.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog.jsx";
import { Label } from "@/components/UI/label.jsx";
import { Textarea } from "@/components/UI/textarea.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/select.jsx";
import {
  Search,
  HelpCircle,
  Video,
  Mail,
  Phone,
  MessageCircle,
  Users,
  Briefcase,
  User,
  Building,
  CreditCard,
  Settings,
  Bug,
  MessageSquare,
  GraduationCap,
  TrendingUp,
  Shield,
  PlayCircle,
  Download,
  Clock
} from "lucide-react";

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState("faqs");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactDialog, setContactDialog] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <HelpCircle className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I create an account on SwipeScout?",
          answer: 'To create an account, click the "Sign Up" button on the homepage. You can register as either a job seeker or employer. Fill in your basic information, verify your email, and complete your profile setup.'
        },
        {
          question: "What is the difference between job seeker and employer accounts?",
          answer: "Job seeker accounts allow you to search for jobs, upload video resumes, apply to positions, and connect with employers. Employer accounts let you post jobs, search for candidates, view video resumes, and manage applications."
        },
        {
          question: "How do I complete my profile?",
          answer: "After registration, follow the step-by-step profile completion guide. Add your personal information, work experience, skills, education, and upload a professional photo. For job seekers, uploading a video resume is highly recommended."
        }
      ]
    },
    {
      id: "video-resumes",
      title: "Video Resumes",
      icon: <Video className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I upload a video resume?",
          answer: 'Go to your profile page and click "Upload Video Resume". Record or upload a video (max 2 minutes, MP4 format). You can trim, edit, and add captions before publishing. Ensure your profile is at least 60% complete before uploading.'
        },
        {
          question: "What makes a good video resume?",
          answer: "A good video resume should be 60-90 seconds long, well-lit, with clear audio. Introduce yourself, highlight key skills and experiences, and show your personality. Dress professionally and maintain eye contact with the camera."
        },
        {
          question: "Can I edit my video after uploading?",
          answer: "Yes, you can edit your video title, description, and tags. For major changes to the video content, you'll need to upload a new version. You can also trim the video length using our built-in editor."
        }
      ]
    },
    {
      id: "job-search",
      title: "Job Search & Applications",
      icon: <Briefcase className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I search for jobs?",
          answer: "Use the job search page to filter jobs by location, industry, experience level, salary range, and job type. You can also browse video job postings and use our TikTok-style feed to discover opportunities."
        },
        {
          question: "How do I apply for a job?",
          answer: 'Click "Apply" on any job posting. Your profile and video resume will be automatically submitted. You can also add a personalized cover letter. Track your applications in the "My Applications" section.'
        },
        {
          question: "How can I save jobs for later?",
          answer: 'Click the bookmark icon on any job posting to save it. Access your saved jobs from your dashboard or the "Saved Jobs" section in your profile menu.'
        }
      ]
    },
    {
      id: "employers",
      title: "For Employers",
      icon: <Building className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I post a job?",
          answer: 'From your employer dashboard, click "Post New Job". Fill in the job details, requirements, and compensation. You can also upload a company video to make your posting more engaging.'
        },
        {
          question: "How do I search for candidates?",
          answer: "Use the candidate search page to filter by skills, experience, location, and other criteria. Browse video resumes to get a better sense of candidates' personalities and communication skills."
        },
        {
          question: "How do I manage applications?",
          answer: "Access all applications from your employer dashboard. You can filter by job posting, review candidate profiles and videos, schedule interviews, and update application statuses."
        }
      ]
    },
    {
      id: "premium",
      title: "Premium Features",
      icon: <TrendingUp className="h-5 w-5" />,
      faqs: [
        {
          question: "What are the premium features?",
          answer: "Premium features include advanced analytics, priority support, enhanced profile visibility, unlimited video uploads, AI-powered job matching, career coaching sessions, and access to exclusive job opportunities."
        },
        {
          question: "How do I upgrade to premium?",
          answer: 'Go to Settings > Premium or click the "Upgrade" button in your dashboard. Choose from monthly or annual plans. We accept all major credit cards and PayPal through our secure Stripe payment system.'
        },
        {
          question: "Can I cancel my premium subscription?",
          answer: "Yes, you can cancel anytime from your account settings. Your premium features will remain active until the end of your current billing period. No cancellation fees apply."
        }
      ]
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: <Settings className="h-5 w-5" />,
      faqs: [
        {
          question: "Why can't I upload my video?",
          answer: "Ensure your video is in MP4 format, under 100MB, and less than 2 minutes long. Check your internet connection and try again. If the problem persists, contact our technical support team."
        },
        {
          question: "How do I reset my password?",
          answer: 'Click "Forgot Password" on the login page. Enter your email address and follow the instructions in the reset email. If you don\'t receive the email, check your spam folder.'
        },
        {
          question: "Why am I not receiving notifications?",
          answer: "Check your notification settings in your profile. Ensure you've allowed browser notifications and that our emails aren't going to spam. You can also enable SMS notifications for important updates."
        }
      ]
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with SwipeScout",
      description: "Complete guide to setting up your account and profile",
      duration: "5 min",
      type: "video"
    },
    {
      title: "Creating the Perfect Video Resume",
      description: "Tips and best practices for recording your video resume",
      duration: "8 min",
      type: "video"
    },
    {
      title: "Advanced Job Search Techniques",
      description: "How to use filters and find the best job matches",
      duration: "6 min",
      type: "video"
    },
    {
      title: "Employer Guide: Finding Top Talent",
      description: "Best practices for employers to attract candidates",
      duration: "10 min",
      type: "video"
    }
  ];

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageCircle className="h-8 w-8" />,
      action: "Start Chat",
      available: "24/7"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: <Mail className="h-8 w-8" />,
      action: "Send Email",
      available: "Response within 24h"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our team",
      icon: <Phone className="h-8 w-8" />,
      action: "Call Now",
      available: "Mon-Fri 9AM-6PM"
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: <Users className="h-8 w-8" />,
      action: "Visit Forum",
      available: "Always open"
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const handleSubmitContact = () => {
    console.log("Contact form submitted:", contactForm);
    setContactDialog(false);
    setContactForm({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <Card className="mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-none shadow-xl">
          <CardContent className="p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">{i18n.t('auto_help_center')}</h1>
            <p className="text-lg mb-6 opacity-90">
              Find answers, get support, and learn how to make the most of SwipeScout
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={i18n.t('auto_search_for_help_articles_tutorials_or_fa')} 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white text-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl mx-auto">
            <TabsTrigger value="faqs">{i18n.t('auto_faqs')}</TabsTrigger>
            <TabsTrigger value="tutorials">{i18n.t('auto_video_tutorials')}</TabsTrigger>
            <TabsTrigger value="support">{i18n.t('auto_contact_support')}</TabsTrigger>
            <TabsTrigger value="downloads">{i18n.t('auto_downloads')}</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faqs">
            {searchQuery ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Search Results for "{searchQuery}"</h2>
                {filteredFAQs.map(category => (
                  <Card key={category.id} className="mb-6 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        {category.icon}
                        <h3 className="text-xl font-semibold">{category.title}</h3>
                      </div>
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-2">
                            <AccordionTrigger className="hover:no-underline">
                              <span className="text-left font-medium">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqCategories.map(category => (
                  <Card key={category.id} className="hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-gradient-to-r from-purple-100 to-cyan-100">
                          {category.icon}
                        </div>
                        <h3 className="text-xl font-bold">{category.title}</h3>
                      </div>
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.faqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="hover:no-underline text-sm">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 text-sm">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Video Tutorials Tab */}
          <TabsContent value="tutorials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-200 border-l-4 border-l-cyan-500">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-100 to-cyan-100">
                        <PlayCircle className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{tutorial.title}</h3>
                        <p className="text-gray-600 mb-4">{tutorial.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {tutorial.duration}
                          </Badge>
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">{i18n.t('auto_watch_now')}</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="support">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100 mb-4">
                        {option.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                      <p className="text-gray-600 mb-4">{option.description}</p>
                      <Badge className="mb-4 bg-green-100 text-green-700">
                        {option.available}
                      </Badge>
                      <Button
                        onClick={() => setContactDialog(true)}
                        className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                      >
                        {option.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Downloads Tab */}
          <TabsContent value="downloads">
            <Card className="shadow-xl">
              <CardContent className="p-8 text-center">
                <Download className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                <h3 className="text-2xl font-bold mb-4">Resources & Downloads</h3>
                <p className="text-gray-600 mb-6">
                  Download helpful guides, templates, and resources to enhance your SwipeScout experience
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">{i18n.t('auto_user_guide_pdf')}</Button>
                  <Button variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">{i18n.t('auto_video_resume_tips')}</Button>
                  <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">{i18n.t('auto_mobile_app')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Contact Dialog */}
        <Dialog open={contactDialog} onOpenChange={setContactDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{i18n.t('auto_contact_support')}</DialogTitle>
              <DialogDescription>
                Fill out the form below and our team will get back to you as soon as possible.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{i18n.t('auto_name')}</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder={i18n.t('auto_your_name')} 
                />
              </div>
              <div>
                <Label htmlFor="email">{i18n.t('auto_email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder={i18n.t('auto_your_email_com')} 
                />
              </div>
              <div>
                <Label htmlFor="category">{i18n.t('auto_category')}</Label>
                <Select
                  value={contactForm.category}
                  onValueChange={value => setContactForm({ ...contactForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={i18n.t('auto_select_category')}  />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{i18n.t('auto_general')}</SelectItem>
                    <SelectItem value="technical">{i18n.t('auto_technical_support')}</SelectItem>
                    <SelectItem value="billing">{i18n.t('auto_billing')}</SelectItem>
                    <SelectItem value="feedback">{i18n.t('auto_feedback')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">{i18n.t('subject')}</Label>
                <Input
                  id="subject"
                  value={contactForm.subject}
                  onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder={i18n.t('auto_brief_description_1')} 
                />
              </div>
              <div>
                <Label htmlFor="message">{i18n.t('auto_message')}</Label>
                <Textarea
                  id="message"
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder={i18n.t('auto_describe_your_issue_or_question')} 
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setContactDialog(false)}>{i18n.t('auto_cancel')}</Button>
              <Button
                onClick={handleSubmitContact}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >{i18n.t('sendMessage')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HelpPage;
