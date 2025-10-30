import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { Switch } from '@/components/UI/switch.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/UI/dialog.jsx';
import { Input } from '@/components/UI/input.jsx';
import { useToast } from '@/hooks/use-toast';
import {
  Check,
  Star,
  Briefcase,
  Building,
  CreditCard,
  Shield,
  Loader2,
  TrendingUp,
  Users,
  MessageCircle,
  Video,
  BarChart,
  Search,
  Sparkles,
  GraduationCap,
  UserPlus,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Headers/Header';
import Footer from '../components/Headers/Footer';
import { 
  getPlansAndServices, 
  createSubscription, 
  purchaseService,
  getSubscriptionStatus 
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function PricingPage() {
  const { user } = useAuth();
  const { t } = useTranslation('pricing');
  const { toast } = useToast();
  const [tabValue, setTabValue] = useState('job-seekers');
  const [isAnnual, setIsAnnual] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // Job Seeker Plans
  const jobSeekerPlans = [
    {
      id: 'basic',
      type: 'BASIC',
      title: t('jobSeekerPlans.basic.title'),
      price: t('jobSeekerPlans.basic.price'),
      monthlyPrice: 0,
      annualPrice: 0,
      description: t('jobSeekerPlans.basic.description'),
      features: [
        t('jobSeekerPlans.basic.features.0'),
        t('jobSeekerPlans.basic.features.1'),
        t('jobSeekerPlans.basic.features.2'),
        t('jobSeekerPlans.basic.features.3'),
        t('jobSeekerPlans.basic.features.4')
      ],
      buttonText: t('jobSeekerPlans.basic.buttonText'),
      mostPopular: false
    },
    {
      id: 'professional',
      type: 'PROFESSIONAL',
      title: t('jobSeekerPlans.professional.title'),
      price: t('jobSeekerPlans.professional.price'),
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      period: '/month',
      description: t('jobSeekerPlans.professional.description'),
      features: [
        t('jobSeekerPlans.professional.features.0'),
        t('jobSeekerPlans.professional.features.1'),
        t('jobSeekerPlans.professional.features.2'),
        t('jobSeekerPlans.professional.features.3'),
        t('jobSeekerPlans.professional.features.4'),
        t('jobSeekerPlans.professional.features.5'),
        t('jobSeekerPlans.professional.features.6')
      ],
      buttonText: t('jobSeekerPlans.professional.buttonText'),
      highlight: true,
      mostPopular: true
    },
    {
      id: 'premium',
      type: 'PREMIUM',
      title: t('jobSeekerPlans.premium.title'),
      price: t('jobSeekerPlans.premium.price'),
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      period: '/month',
      description: t('jobSeekerPlans.premium.description'),
      features: [
        t('jobSeekerPlans.premium.features.0'),
        t('jobSeekerPlans.premium.features.1'),
        t('jobSeekerPlans.premium.features.2'),
        t('jobSeekerPlans.premium.features.3'),
        t('jobSeekerPlans.premium.features.4'),
        t('jobSeekerPlans.premium.features.5'),
        t('jobSeekerPlans.premium.features.6'),
        t('jobSeekerPlans.premium.features.7')
      ],
      buttonText: t('jobSeekerPlans.premium.buttonText'),
      mostPopular: false
    }
  ];

  // Employer Plans
  const employerPlans = [
    {
      id: 'starter',
      type: 'STARTER',
      title: t('employerPlans.starter.title'),
      price: t('employerPlans.starter.price'),
      monthlyPrice: 29.99,
      annualPrice: 299.99,
      period: '/month',
      description: t('employerPlans.starter.description'),
      features: [
        t('employerPlans.starter.features.0'),
        t('employerPlans.starter.features.1'),
        t('employerPlans.starter.features.2'),
        t('employerPlans.starter.features.3'),
        t('employerPlans.starter.features.4'),
        t('employerPlans.starter.features.5')
      ],
      buttonText: t('employerPlans.starter.buttonText'),
      mostPopular: false
    },
    {
      id: 'business',
      type: 'BUSINESS',
      title: t('employerPlans.business.title'),
      price: t('employerPlans.business.price'),
      monthlyPrice: 79.99,
      annualPrice: 799.99,
      period: '/month',
      description: t('employerPlans.business.description'),
      features: [
        t('employerPlans.business.features.0'),
        t('employerPlans.business.features.1'),
        t('employerPlans.business.features.2'),
        t('employerPlans.business.features.3'),
        t('employerPlans.business.features.4'),
        t('employerPlans.business.features.5'),
        t('employerPlans.business.features.6'),
        t('employerPlans.business.features.7')
      ],
      buttonText: t('employerPlans.business.buttonText'),
      highlight: true,
      mostPopular: true
    },
    {
      id: 'enterprise',
      type: 'ENTERPRISE',
      title: t('employerPlans.enterprise.title'),
      price: t('employerPlans.enterprise.price'),
      monthlyPrice: 199.99,
      annualPrice: 1999.99,
      period: '/month',
      description: t('employerPlans.enterprise.description'),
      features: [
        t('employerPlans.enterprise.features.0'),
        t('employerPlans.enterprise.features.1'),
        t('employerPlans.enterprise.features.2'),
        t('employerPlans.enterprise.features.3'),
        t('employerPlans.enterprise.features.4'),
        t('employerPlans.enterprise.features.5'),
        t('employerPlans.enterprise.features.6'),
        t('employerPlans.enterprise.features.7'),
        t('employerPlans.enterprise.features.8')
      ],
      buttonText: t('employerPlans.enterprise.buttonText'),
      mostPopular: false
    }
  ];

  // Professional Services for Job Seekers
  const jobSeekerServices = [
    {
      id: 'career-coaching',
      type: 'CAREER_COACHING',
      title: t('jobSeekerServices.careerCoaching.title'),
      price: t('jobSeekerServices.careerCoaching.price'),
      description: t('jobSeekerServices.careerCoaching.description'),
      icon: <Briefcase className="h-10 w-10 text-green-600" />,
      duration: t('jobSeekerServices.careerCoaching.duration'),
      features: [
        t('jobSeekerServices.careerCoaching.features.0'),
        t('jobSeekerServices.careerCoaching.features.1'),
        t('jobSeekerServices.careerCoaching.features.2'),
        t('jobSeekerServices.careerCoaching.features.3')
      ]
    },
    {
      id: 'resume-review',
      type: 'RESUME_REVIEW',
      title: t('jobSeekerServices.resumeReview.title'),
      price: t('jobSeekerServices.resumeReview.price'),
      description: t('jobSeekerServices.resumeReview.description'),
      icon: <Star className="h-10 w-10 text-orange-600" />,
      duration: t('jobSeekerServices.resumeReview.duration'),
      features: [
        t('jobSeekerServices.resumeReview.features.0'),
        t('jobSeekerServices.resumeReview.features.1'),
        t('jobSeekerServices.resumeReview.features.2'),
        t('jobSeekerServices.resumeReview.features.3')
      ]
    },
    {
      id: 'interview-prep',
      type: 'INTERVIEW_PREP',
      title: t('jobSeekerServices.interviewPrep.title'),
      price: t('jobSeekerServices.interviewPrep.price'),
      description: t('jobSeekerServices.interviewPrep.description'),
      icon: <Sparkles className="h-10 w-10 text-blue-600" />,
      duration: t('jobSeekerServices.interviewPrep.duration'),
      features: [
        t('jobSeekerServices.interviewPrep.features.0'),
        t('jobSeekerServices.interviewPrep.features.1'),
        t('jobSeekerServices.interviewPrep.features.2'),
        t('jobSeekerServices.interviewPrep.features.3')
      ]
    },
    {
      id: 'linkedin-optimization',
      type: 'LINKEDIN_OPTIMIZATION',
      title: t('jobSeekerServices.linkedinOptimization.title'),
      price: t('jobSeekerServices.linkedinOptimization.price'),
      description: t('jobSeekerServices.linkedinOptimization.description'),
      icon: <TrendingUp className="h-10 w-10 text-blue-700" />,
      duration: t('jobSeekerServices.linkedinOptimization.duration'),
      features: [
        t('jobSeekerServices.linkedinOptimization.features.0'),
        t('jobSeekerServices.linkedinOptimization.features.1'),
        t('jobSeekerServices.linkedinOptimization.features.2'),
        t('jobSeekerServices.linkedinOptimization.features.3')
      ]
    }
  ];

  // Professional Services for Employers
  const employerServices = [
    {
      id: 'recruitment-consulting',
      type: 'RECRUITMENT_CONSULTING',
      title: t('employerServices.recruitmentConsulting.title'),
      price: t('employerServices.recruitmentConsulting.price'),
      description: t('employerServices.recruitmentConsulting.description'),
      icon: <Users className="h-10 w-10 text-green-600" />,
      duration: t('employerServices.recruitmentConsulting.duration'),
      features: [
        t('employerServices.recruitmentConsulting.features.0'),
        t('employerServices.recruitmentConsulting.features.1'),
        t('employerServices.recruitmentConsulting.features.2'),
        t('employerServices.recruitmentConsulting.features.3')
      ]
    },
    {
      id: 'employer-branding',
      type: 'EMPLOYER_BRANDING',
      title: t('employerServices.employerBranding.title'),
      price: t('employerServices.employerBranding.price'),
      description: t('employerServices.employerBranding.description'),
      icon: <Building className="h-10 w-10 text-orange-600" />,
      duration: t('employerServices.employerBranding.duration'),
      features: [
        t('employerServices.employerBranding.features.0'),
        t('employerServices.employerBranding.features.1'),
        t('employerServices.employerBranding.features.2'),
        t('employerServices.employerBranding.features.3')
      ]
    },
    {
      id: 'team-training',
      type: 'TEAM_TRAINING',
      title: t('employerServices.teamTraining.title'),
      price: t('employerServices.teamTraining.price'),
      description: t('employerServices.teamTraining.description'),
      icon: <GraduationCap className="h-10 w-10 text-blue-600" />,
      duration: t('employerServices.teamTraining.duration'),
      features: [
        t('employerServices.teamTraining.features.0'),
        t('employerServices.teamTraining.features.1'),
        t('employerServices.teamTraining.features.2'),
        t('employerServices.teamTraining.features.3')
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      loadCurrentSubscription();
    }
  }, [user]);

  const loadCurrentSubscription = async () => {
    try {
      const response = await getSubscriptionStatus(user.id);
      setCurrentSubscription(response.data);
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast({
        title: t('errors.loginRequired'),
        variant: 'destructive'
      });
      return;
    }

    setSelectedPlan(plan);
    setPaymentDialog(true);
  };

  const handleConfirmSubscription = async () => {
    setSubscribing(true);
    try {
      await createSubscription(selectedPlan.type, user.id, isAnnual);
      toast({
        title: t('success.subscriptionUpdated'),
      });
      setPaymentDialog(false);
      loadCurrentSubscription();
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast({
        title: t('errors.genericError'),
        variant: 'destructive'
      });
    } finally {
      setSubscribing(false);
    }
  };

  const handlePurchaseService = async (service) => {
    if (!user) {
      toast({
        title: t('errors.loginRequired'),
        variant: 'destructive'
      });
      return;
    }

    try {
      await purchaseService(service.type, user.id);
      toast({
        title: t('success.paymentProcessed'),
      });
    } catch (error) {
      console.error('Error purchasing service:', error);
      toast({
        title: t('errors.genericError'),
        variant: 'destructive'
      });
    }
  };

  const getPrice = (plan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (!plan.annualPrice || !plan.monthlyPrice) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.annualPrice;
    return Math.round((savings / monthlyTotal) * 100);
  };

  const renderPricingCards = (plansList) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {plansList.map((plan, index) => (
        <Card
          key={index}
          className={`relative flex flex-col transition-all duration-300 hover:-translate-y-2 ${
            plan.highlight
              ? 'border-2 border-purple-600 shadow-2xl'
              : 'border border-gray-200 shadow-lg hover:shadow-xl'
          }`}
        >
          {plan.mostPopular && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-cyan-600">
              {t('mostPopular')}
            </Badge>
          )}

          <CardHeader className="text-center pb-4">
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {plan.title}
            </h3>
            <p className="text-gray-600 text-sm">{plan.description}</p>
          </CardHeader>

          <CardContent className="flex-1">
            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  ${getPrice(plan)}
                </span>
                {plan.period && (
                  <span className="text-gray-500 text-lg">{plan.period}</span>
                )}
              </div>
              {isAnnual && plan.annualPrice > 0 && (
                <Badge variant="outline" className="mt-2 border-green-500 text-green-600">
                  Save {getSavings(plan)}%
                </Badge>
              )}
            </div>

            <ul className="space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter>
            <Button
              onClick={() => handleSubscribe(plan)}
              className={`w-full ${
                plan.highlight
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700'
                  : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
              }`}
            >
              {plan.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderServiceCards = (servicesList) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
      {servicesList.map((service, index) => (
        <Card key={index} className="hover:shadow-xl transition-all duration-200 border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100">
                {service.icon}
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">{service.title}</h3>
            <p className="text-center text-gray-600 text-sm mb-4">{service.description}</p>
            
            <div className="text-center mb-4">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {service.price}
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{service.duration}</span>
            </div>

            <ul className="space-y-2 mb-6">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => handlePurchaseService(service)}
              className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              Purchase
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto py-12 px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {t('title') || 'Choose Your Plan'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle') || 'Find the perfect plan for your needs'}
          </p>
        </div>

        {/* Annual/Monthly Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <Label htmlFor="billing-toggle" className={`font-medium ${!isAnnual ? 'text-purple-600' : 'text-gray-500'}`}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label htmlFor="billing-toggle" className={`font-medium ${isAnnual ? 'text-purple-600' : 'text-gray-500'}`}>
            Annual <Badge variant="outline" className="ml-2 border-green-500 text-green-600">Save up to 17%</Badge>
          </Label>
        </div>

        {/* Tabs */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="max-w-7xl mx-auto">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="job-seekers">{t('forJobSeekers') || 'For Job Seekers'}</TabsTrigger>
            <TabsTrigger value="employers">{t('forEmployers') || 'For Employers'}</TabsTrigger>
          </TabsList>

          {/* Job Seekers Tab */}
          <TabsContent value="job-seekers" className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">
                {t('subscriptionPlans') || 'Subscription Plans'}
              </h2>
              {renderPricingCards(jobSeekerPlans)}
            </div>

            <div className="border-t-4 border-purple-200 pt-12">
              <h2 className="text-3xl font-bold text-center mb-4">
                {t('professionalServices') || 'Professional Services'}
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('professionalServicesDesc') || 'Enhance your job search with our expert services'}
              </p>
              {renderServiceCards(jobSeekerServices)}
            </div>
          </TabsContent>

          {/* Employers Tab */}
          <TabsContent value="employers" className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">
                {t('subscriptionPlans') || 'Subscription Plans'}
              </h2>
              {renderPricingCards(employerPlans)}
            </div>

            <div className="border-t-4 border-purple-200 pt-12">
              <h2 className="text-3xl font-bold text-center mb-4">
                {t('professionalServices') || 'Professional Services'}
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                {t('professionalServicesDesc') || 'Expert solutions for your recruitment needs'}
              </p>
              {renderServiceCards(employerServices)}
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment Dialog */}
        <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {t('confirmSubscription') || 'Confirm Subscription'}
              </DialogTitle>
              <DialogDescription>
                {t('confirmSubscriptionDesc') || 'Complete your subscription to get started'}
              </DialogDescription>
            </DialogHeader>

            {selectedPlan && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-cyan-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">{selectedPlan.title}</h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    ${getPrice(selectedPlan)} {selectedPlan.period}
                  </p>
                  {isAnnual && selectedPlan.annualPrice > 0 && (
                    <Badge variant="outline" className="mt-2 border-green-500 text-green-600">
                      Save {getSavings(selectedPlan)}% annually
                    </Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" className="mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" className="mt-1" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure payment powered by Stripe</span>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmSubscription}
                disabled={subscribing}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                {subscribing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {subscribing ? 'Processing...' : 'Confirm Payment'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}
