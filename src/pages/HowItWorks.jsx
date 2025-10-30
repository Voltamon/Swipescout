import React from 'react';
import { Video, Users, TrendingUp } from 'lucide-react';
import Header from '../components/Headers/Header';
import Footer from '../components/Headers/Footer';
import { Helmet } from 'react-helmet';
import { homeThemeColors } from '../config/theme-colors-home';

const HowItWorksPage = () => {
  const steps = [
    {
      icon: <Video className="w-10 h-10 text-blue-500" />,
      title: "1. Create Your Video Profile",
      description: "Job seekers record a short video resume. Employers create video job postings or company profiles.",
      bgColor: "bg-blue-100",
    },
    {
      icon: <Users className="w-10 h-10 text-cyan-500" />,
      title: "2. Discover & Connect",
      description: "Swipe through video profiles or use our smart matching to find perfect candidates or opportunities.",
      bgColor: "bg-cyan-100",
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-teal-400" />,
      title: "3. Grow Your Career",
      description: "Build meaningful connections that lead to interviews, hires, and career growth.",
      bgColor: "bg-teal-100",
    },
  ];

  return (
    <>
      <Helmet>
        <title>How SwipeScout Works</title>
        <meta name="description" content="Learn how SwipeScout revolutionizes recruitment with video profiles." />
      </Helmet>
      <div className={`min-h-screen flex flex-col ${homeThemeColors.background} ${homeThemeColors.text}`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-16">
            <h1 className={`text-4xl sm:text-5xl font-extrabold mb-4 ${homeThemeColors.titleText}`}>
              How SwipeScout Works
            </h1>
            <p className={`max-w-3xl mx-auto text-lg sm:text-xl ${homeThemeColors.secondaryText}`}>
              A simple, intuitive, and modern way to connect talent with opportunity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 ${homeThemeColors.cardBackground} shadow-lg hover:shadow-2xl`}
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${step.bgColor}`}
                >
                  {step.icon}
                </div>
                <h2 className={`text-2xl font-bold mb-3 ${homeThemeColors.cardTitleText}`}>
                  {step.title}
                </h2>
                <p className={`${homeThemeColors.cardSecondaryText}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HowItWorksPage;
