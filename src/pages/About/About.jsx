import React from "react";
import Header from "../../components/Headers/Header";
import { Helmet } from "react-helmet";
import Footer from "../../components/Headers/Footer";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar.jsx";
import {
  Users,
  Heart,
  Lightbulb,
  Handshake,
  MapPin,
  Mail,
  TrendingUp,
  Target,
  Award
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { homeThemeColors } from "../../config/theme-colors-home";

const AboutUs = () => {
  const { t } = useTranslation();

  const teamMembers = [
    {
      name: "Raj Singah",
      role: t('about.team.raj.role'),
      bio: t('about.team.raj.bio'),
      avatar: "/images/raj_sin.jpg"
    },
    {
      name: "Varshal Dubey",
      role: t('about.team.varshal.role'),
      bio: t('about.team.varshal.bio'),
      avatar: "/images/varsha_dub.jpg"
    },
    {
      name: "Tareq Alsharif",
      role: t('about.team.tareq.role'),
      bio: t('about.team.tareq.bio'),
      avatar: "/images/tareq.jpg"
    },
    {
      name: "Obaid Nieroukh",
      role: t('about.team.obaid.role'),
      bio: t('about.team.obaid.bio'),
      avatar: "/images/obaid.jpg"
    },
    {
      name: "Bahri Ayzabar",
      role: t('about.team.bahri.role'),
      bio: t('about.team.bahri.bio'),
      avatar: "/images/bahr_ayzaba.jpg"
    }
  ];

  const stats = [
    { value: "+", label: t('about.stats.jobsPosted'), icon: Users },
    { value: "+", label: t('about.stats.candidatesHired'), icon: Heart },
    { value: "+", label: t('about.stats.partnerCompanies'), icon: Handshake },
    { value: "95%", label: t('about.stats.satisfactionRate'), icon: Lightbulb }
  ];

  const values = [
    { icon: Target, title: "Innovation", desc: "Driving forward-thinking solutions" },
    { icon: Award, title: "Excellence", desc: "Maintaining the highest standards" },
    { icon: Heart, title: "Passion", desc: "Dedicated to our community" },
    { icon: TrendingUp, title: "Growth", desc: "Continuous improvement mindset" }
  ];

  return (
    <>
      <Helmet>
        <title>{t('about.meta.title')}</title>
        <meta name="description" content={t('about.meta.description')} />
        <meta name="keywords" content={t('about.meta.keywords')} />
        <meta property="og:title" content={t('about.meta.title')} />
        <meta property="og:description" content={t('about.meta.ogDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.swipescout.xyz/about" />
        <link rel="canonical" href="https://www.swipescout.xyz/about" />
      </Helmet>

      <div className={`min-h-screen ${homeThemeColors.backgrounds.page}`}>
        <Header />
        
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className={`text-5xl font-bold mb-4 ${homeThemeColors.text.gradient}`}>
              {t('about.hero.title')}
            </h1>
            <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-400 mb-4">
              {t('about.hero.subtitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              {t('about.hero.description')}
            </p>
          </div>

          <div className="border-t-4 border-indigo-600 my-12"></div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${homeThemeColors.text.gradient}`}>
                {t('about.mission.title')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                {t('about.mission.description1')}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {t('about.mission.description2')}
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <Card key={value.title} className={`${homeThemeColors.backgrounds.card} border ${homeThemeColors.borders.primary} hover:shadow-lg transition-all duration-200 transform hover:-translate-y-2`}>
                    <CardContent className="p-6 text-center">
                      <Icon className="h-12 w-12 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
                      <p className="font-semibold text-gray-900 dark:text-white">{value.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{value.desc}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Stats Section */}
          <Card className={`${homeThemeColors.backgrounds.highlight} border ${homeThemeColors.borders.primary} shadow-xl mb-16`}>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className={`${homeThemeColors.backgrounds.card} border ${homeThemeColors.borders.default} shadow-md hover:shadow-lg transition-all duration-200`}>
                      <CardContent className="p-6 text-center">
                        <div className="text-indigo-600 dark:text-indigo-400 mb-4 flex justify-center">
                          <Icon className="h-10 w-10" />
                        </div>
                        <div className={`text-4xl font-bold mb-2 ${homeThemeColors.text.gradient}`}>
                          {stat.value}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 font-medium">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className={`text-4xl font-bold text-center mb-4 ${homeThemeColors.text.gradient}`}>
              {t('about.team.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center text-lg max-w-3xl mx-auto mb-12">
              {t('about.team.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className={`${homeThemeColors.backgrounds.card} border ${homeThemeColors.borders.primary} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="h-32 w-32 mb-4 border-4 border-indigo-600 dark:border-indigo-400 shadow-lg">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-2xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <Card className={`${homeThemeColors.backgrounds.highlight} border ${homeThemeColors.borders.primary} shadow-xl`}>
            <CardContent className="p-8">
              <h2 className={`text-3xl font-bold text-center mb-8 ${homeThemeColors.text.gradient}`}>
                Get In Touch
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <a
                  href="https://maps.google.com/?q=Doha+Qatar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 ${homeThemeColors.backgrounds.card} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
                >
                  <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Doha Qatar</span>
                </a>
                <a
                  href="mailto:info@swipescout.xyz"
                  className={`flex items-center gap-4 ${homeThemeColors.backgrounds.card} p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
                >
                  <Mail className="h-6 w-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">info@swipescout.xyz</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AboutUs;
