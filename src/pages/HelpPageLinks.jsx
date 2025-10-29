import React from 'react';
import { Card, CardContent } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { Mail, MessageCircle } from "lucide-react";

// Custom Discord icon as an inline SVG component
const DiscordIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="60px"
    height="60px"
    aria-hidden="true"
  >
    <path d="M21.17,1.83a2.38,2.38,0,0,0-1.28-.79C17.75,0,14.63,0,11.5,0A22.82,22.82,0,0,0,1.72,1.15a2.37,2.37,0,0,0-1.28.79A2.37,2.37,0,0,0,0,2.94,22.39,22.39,0,0,0,1.3,16.27,2.37,2.37,0,0,0,2,17.43a2.38,2.38,0,0,0,1.28.79A22.82,22.82,0,0,0,11.5,19.34a22.82,22.82,0,0,0,8.22-1.12,2.38,2.38,0,0,0,1.28-.79,2.37,2.37,0,0,0,.72-1.16,22.39,22.39,0,0,0,1.3-13.33A2.37,2.37,0,0,0,21.17,1.83Zm-1.84,14.4a.79.79,0,0,1-.46.33,18.73,18.73,0,0,1-7.37,1,18.73,18.73,0,0,1-7.37-1,.79.79,0,0,1-.46-.33,18.84,18.84,0,0,1-.7-3.95A19.46,19.46,0,0,1,2.83,6.23a.79.79,0,0,1,.46-.33A18.73,18.73,0,0,1,11.5,5a18.73,18.73,0,0,1,7.37,1,.79.79,0,0,1,.46.33A19.46,19.46,0,0,1,20.08,12.3Z" />
    <path d="M12.91,12.35a2.4,2.4,0,0,1-1.39.46,2.4,2.4,0,0,1-1.39-.46,2.16,2.16,0,0,1-.39-.56,3.87,3.87,0,0,1-.13-.7,4.3,4.3,0,0,1,.13-.7,2.16,2.16,0,0,1,.39-.56A2.4,2.4,0,0,1,11.5,9.45a2.4,2.4,0,0,1,1.39.46,2.16,2.16,0,0,1,.39.56,3.87,3.87,0,0,1,.13.7,4.3,4.3,0,0,1-.13.7,2.16,2.16,0,0,1-.39.56Z" />
    <path d="M16.14,12.35a2.4,2.4,0,0,1-1.39.46,2.4,2.4,0,0,1-1.39-.46,2.16,2.16,0,0,1-.39-.56,3.87,3.87,0,0,1-.13-.7,4.3,4.3,0,0,1,.13-.7,2.16,2.16,0,0,1,.39-.56,2.4,2.4,0,0,1,1.39-.46,2.4,2.4,0,0,1,1.39.46,2.16,2.16,0,0,1,.39.56,3.87,3.87,0,0,1,.13.7,4.3,4.3,0,0,1-.13.7,2.16,2.16,0,0,1-.39.56Z" />
    <path d="M11.5,14.61a.7.7,0,0,1-.41-.12,5.77,5.77,0,0,1-1.5-.7,4.2,4.2,0,0,1-.7-.84.79.79,0,0,1,.16-.83.77.77,0,0,1,.71-.16.7.7,0,0,1,.41.12,4.55,4.55,0,0,0,1.07.56A4.55,4.55,0,0,0,12.5,12.9a.7.7,0,0,1,.41-.12.77.77,0,0,1,.71.16.79.79,0,0,1,.16.83,4.2,4.2,0,0,1-.7.84,5.77,5.77,0,0,1-1.5.7A.7.7,0,0,1,11.5,14.61Z" />
  </svg>
);

export default function HelpPageLinks() {
  const discordLink = "https://discord.gg/mHcdMn6yMh";

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Main heading for the page */}
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
        Help Center
      </h1>

      {/* Introduction text */}
      <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        We are here to help you get the most out of Swipescout. Whether you have a question, need technical support, or just want to connect with the community, you can reach out to us through the following channels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email Support Card */}
        <Card className="border-2 border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-purple-100 to-cyan-100 p-4 rounded-full mb-6">
              <Mail className="h-16 w-16 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Email Support
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              For general inquiries and technical assistance, please send us an email.
            </p>
            <a
              href="mailto:info@swipescout.xyz"
              className="text-lg font-semibold text-purple-600 hover:text-purple-700 transition-colors duration-200 hover:underline"
            >
              info@swipescout.xyz
            </a>
          </CardContent>
        </Card>

        {/* Discord Community Card */}
        <Card className="border-2 border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-full mb-6">
              <div className="text-indigo-600">
                <DiscordIcon />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Join Our Discord
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Connect with the community, get real-time help, and stay updated on all things Swipescout.
            </p>
            <Button
              asChild
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <a
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Join Discord
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Help Resources Section */}
      <Card className="mt-12 bg-gradient-to-r from-purple-50 to-cyan-50 border-2 border-purple-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Need More Help?
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
            Check out our comprehensive FAQ section, video tutorials, and documentation to find answers to common questions and learn how to make the most of SwipeScout's features.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => window.location.href = '/faq'}
            >
              Visit FAQ
            </Button>
            <Button
              variant="outline"
              className="border-cyan-600 text-cyan-600 hover:bg-cyan-50"
              onClick={() => window.location.href = '/help'}
            >
              Help Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
