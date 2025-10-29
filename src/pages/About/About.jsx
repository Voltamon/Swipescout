import React from "react";
import Header from "../../components/Headers/Header";
import { Helmet } from "react-helmet";
import Footer from "../../components/Headers/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
    { value: "+", label: t('about.stats.jobsPosted'), icon: <Users className="h-10 w-10" /> },
    { value: "+", label: t('about.stats.candidatesHired'), icon: <Heart className="h-10 w-10" /> },
    { value: "+", label: t('about.stats.partnerCompanies'), icon: <Handshake className="h-10 w-10" /> },
    { value: "95%", label: t('about.stats.satisfactionRate'), icon: <Lightbulb className="h-10 w-10" /> }
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
        <Header />
        
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {t('about.hero.title')}
            </h1>
            <h2 className="text-2xl font-semibold text-purple-700 mb-4">
              {t('about.hero.subtitle')}
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              {t('about.hero.description')}
            </p>
          </div>

          <div className="border-t-4 border-purple-600 my-12"></div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                {t('about.mission.title')}
              </h2>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                {t('about.mission.description1')}
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {t('about.mission.description2')}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-purple-100 to-purple-200 border-none shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 mx-auto mb-3 text-purple-600" />
                    <p className="font-semibold text-purple-900">Innovation</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-100 to-cyan-200 border-none shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 mx-auto mb-3 text-cyan-600" />
                    <p className="font-semibold text-cyan-900">Excellence</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-pink-100 to-pink-200 border-none shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <Heart className="h-12 w-12 mx-auto mb-3 text-pink-600" />
                    <p className="font-semibold text-pink-900">Passion</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-100 to-green-200 border-none shadow-lg hover:shadow-xl transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 text-green-600" />
                    <p className="font-semibold text-green-900">Growth</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 border-none shadow-xl mb-16">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-purple-600 mb-4 flex justify-center">
                        {stat.icon}
                      </div>
                      <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              {t('about.team.title')}
            </h2>
            <p className="text-gray-600 text-center text-lg max-w-3xl mx-auto mb-12">
              {t('about.team.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="h-32 w-32 mb-4 border-4 border-white shadow-lg">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-2xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold mb-1 text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-purple-600 mb-3">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <Card className="bg-gradient-to-r from-purple-100 to-cyan-100 border-none shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Get In Touch
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
                  <MapPin className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Doha Qatar</span>
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
                  <Mail className="h-6 w-6 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">info@swipescout.xyz</span>
                </div>
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
