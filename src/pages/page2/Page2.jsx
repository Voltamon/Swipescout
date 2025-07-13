"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  HeartHandshake,
  Users,
  Wand2,
  ChevronDown,
  FileText,
  FilePlus2,
  UserCog,
  BookOpenText,
  DollarSign,
  Check,
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
            >
              <path
                d="M5.33333 29.8333H24C24.7072 29.8333 25.3855 29.5524 25.8856 29.0523C26.3857 28.5522 26.6667 27.8739 26.6667 27.1667V9.83333L20 3.16667H7.99999C7.29275 3.16667 6.61447 3.44762 6.11438 3.94771C5.61428 4.44781 5.33333 5.12609 5.33333 5.83333V11.1667"
                stroke="#0F172A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.6667 3.16667V8.5C18.6667 9.20724 18.9476 9.88552 19.4477 10.3856C19.9478 10.8857 20.6261 11.1667 21.3333 11.1667H26.6667"
                stroke="#0F172A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 16.5H4.00001C3.26363 16.5 2.66667 17.097 2.66667 17.8333V23.1667C2.66667 23.903 3.26363 24.5 4.00001 24.5H12C12.7364 24.5 13.3333 23.903 13.3333 23.1667V17.8333C13.3333 17.097 12.7364 16.5 12 16.5Z"
                stroke="#0F172A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.3333 21.1667L18.6667 24.5V16.5L13.3333 19.8333"
                stroke="#0F172A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-2xl font-bold text-gray-900">SwipeHire</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              It's Free!
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              About
            </a>
            <a
              href="#blog"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Blog
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Log In
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800">Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[749px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero.jpeg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 via-indigo-800/30 to-transparent opacity-70" />

        <div className="container relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Unlock Your Career <span className="block">Potential</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              SwipeHire revolutionizes recruitment with AI-powered video resumes
              and intelligent talent matching. Create your AI resume, find
              remote job opportunities, or connect with efficient recruitment
              software.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button className="bg-white text-gray-900 hover:bg-white/90 h-11 px-6">
                <FileText className="mr-2 h-4 w-4" />
                Get Started Free
              </Button>
              <Button
                variant="secondary"
                className="bg-gray-800/80 text-white hover:bg-gray-800 h-11 px-6"
              >
                <Users className="mr-2 h-4 w-4" />
                Continue as Guest
              </Button>
            </div>
          </div>
          <ChevronDown className="absolute bottom-16 h-8 w-8 text-white animate-bounce" />
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-gray-900/90 py-4">
        <div className="container flex items-center justify-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
          >
            <path
              d="M12.6563 5.67186C12.6574 5.2719 12.5786 4.87573 12.4245 4.50666C12.2703 4.1376 12.0439 3.80309 11.7585 3.52281C11.4732 3.24253 11.1347 3.02214 10.7629 2.8746C10.3912 2.72705 9.99364 2.65534 9.59376 2.66368C9.19387 2.67201 8.79969 2.76023 8.4344 2.92313C8.06911 3.08604 7.74008 3.32034 7.46666 3.61227C7.19325 3.9042 6.98097 4.24785 6.84231 4.62302C6.70366 4.99818 6.64142 5.39729 6.65926 5.79686C6.07146 5.948 5.52577 6.23091 5.06349 6.62418C4.60122 7.01744 4.2345 7.51074 3.99111 8.06671C3.74771 8.62269 3.63402 9.22676 3.65865 9.83318C3.68328 10.4396 3.84558 11.0325 4.13326 11.5669C3.62744 11.9778 3.22969 12.5061 2.9746 13.1058C2.71952 13.7055 2.61482 14.3585 2.66963 15.0079C2.72443 15.6572 2.93708 16.2834 3.28907 16.8319C3.64106 17.3804 4.12173 17.8345 4.68926 18.1549C4.61918 18.6971 4.661 19.2479 4.81215 19.7734C4.9633 20.2988 5.22056 20.7877 5.56805 21.2098C5.91554 21.6319 6.34587 21.9783 6.83248 22.2276C7.31909 22.4769 7.85164 22.6238 8.39724 22.6592C8.94284 22.6946 9.4899 22.6178 10.0047 22.4335C10.5194 22.2492 10.9909 21.9613 11.39 21.5876C11.7892 21.214 12.1074 20.7624 12.3252 20.2609C12.543 19.7594 12.6557 19.2186 12.6563 18.6719V5.67186Z"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.6563 5.67186C12.6551 5.2719 12.7339 4.87573 12.8881 4.50666C13.0422 4.1376 13.2687 3.80309 13.554 3.52281C13.8393 3.24253 14.1778 3.02214 14.5496 2.8746C14.9214 2.72705 15.3189 2.65534 15.7188 2.66368C16.1187 2.67201 16.5128 2.76023 16.8781 2.92313C17.2434 3.08604 17.5724 3.32034 17.8459 3.61227C18.1193 3.9042 18.3316 4.24785 18.4702 4.62302C18.6089 4.99818 18.6711 5.39729 18.6533 5.79686C19.2411 5.948 19.7868 6.23091 20.249 6.62418C20.7113 7.01744 21.078 7.51074 21.3214 8.06671C21.5648 8.62269 21.6785 9.22676 21.6539 9.83318C21.6292 10.4396 21.4669 11.0325 21.1793 11.5669C21.6851 11.9778 22.0828 12.5061 22.3379 13.1058C22.593 13.7055 22.6977 14.3585 22.6429 15.0079C22.5881 15.6572 22.3754 16.2834 22.0235 16.8319C21.6715 17.3804 21.1908 17.8345 20.6233 18.1549C20.6933 18.6971 20.6515 19.2479 20.5004 19.7734C20.3492 20.2988 20.092 20.7877 19.7445 21.2098C19.397 21.6319 18.9667 21.9783 18.48 22.2276C17.9934 22.4769 17.4609 22.6238 16.9153 22.6592C16.3697 22.6946 15.8226 22.6178 15.3079 22.4335C14.7931 22.2492 14.3216 21.9613 13.9225 21.5876C13.5234 21.214 13.2051 20.7624 12.9873 20.2609C12.7695 19.7594 12.6568 19.2186 12.6563 18.6719V5.67186Z"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.6562 13.6719C14.8167 13.3765 14.0836 12.8389 13.5496 12.1269C13.0156 11.4149 12.7047 10.5605 12.6562 9.67188C12.6078 10.5605 12.2969 11.4149 11.7629 12.1269C11.2289 12.8389 10.4958 13.3765 9.65625 13.6719"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M18.2552 7.17188C18.4973 6.75246 18.6342 6.28069 18.6542 5.79688"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.65924 5.79688C6.67902 6.28061 6.81557 6.75237 7.05724 7.17188"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.13324 11.5679C4.31618 11.4189 4.51194 11.2864 4.71824 11.1719"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.5942 11.1719C20.8005 11.2864 20.9963 11.4189 21.1792 11.5679"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.65627 18.6719C5.9671 18.6722 5.28954 18.4945 4.68927 18.1559"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.6232 18.1559C20.023 18.4945 19.3454 18.6722 18.6562 18.6719"
              stroke="#F8FAFC"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-lg text-white">
            Join thousands finding their dream jobs & top talent with AI-driven
            insights.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why SwipeHire for AI Recruitment & Job Seeking?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the next generation of recruitment and job searching
              with tools designed for impact, from AI resumes to talent matching
              systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {/* Feature Card 1 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-end">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-900"
                >
                  <path
                    d="M7.30728 37.3386H30.6406C31.5247 37.3386 32.3725 36.9874 32.9976 36.3623C33.6228 35.7371 33.9739 34.8893 33.9739 34.0052V12.3386L25.6406 4.00525H10.6406C9.75656 4.00525 8.90871 4.35644 8.28359 4.98156C7.65847 5.60668 7.30728 6.45453 7.30728 7.33858V14.0052"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23.974 4.00525V10.6719C23.974 11.556 24.3252 12.4038 24.9503 13.0289C25.5754 13.6541 26.4232 14.0052 27.3073 14.0052H33.974"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.6406 20.6719H5.64064C4.72016 20.6719 3.97397 21.4181 3.97397 22.3385V29.0052C3.97397 29.9257 4.72016 30.6719 5.64064 30.6719H15.6406C16.5611 30.6719 17.3073 29.9257 17.3073 29.0052V22.3385C17.3073 21.4181 16.5611 20.6719 15.6406 20.6719Z"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.3073 26.5052L23.9739 30.6719V20.6719L17.3073 24.8385"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 text-center">
                AI Video Resumes
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                Showcase your personality and skills beyond paper. Get AI
                assistance to create compelling video introductions.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-end">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-900"
                >
                  <path
                    d="M7.32779 11.0053C7.26827 10.7746 7.14802 10.564 6.97954 10.3955C6.81106 10.2271 6.60051 10.1068 6.36979 10.0473L2.27979 8.99263C2.21001 8.97282 2.1486 8.93079 2.10487 8.87292C2.06114 8.81505 2.03748 8.7445 2.03748 8.67196C2.03748 8.59942 2.06114 8.52887 2.10487 8.471C2.1486 8.41313 2.21001 8.3711 2.27979 8.35129L6.36979 7.29596C6.60043 7.2365 6.81092 7.11634 6.97939 6.94799C7.14787 6.77963 7.26817 6.56922 7.32779 6.33863L8.38246 2.24863C8.40206 2.17857 8.44405 2.11685 8.50201 2.07289C8.55996 2.02892 8.63071 2.00513 8.70346 2.00513C8.77621 2.00513 8.84695 2.02892 8.90491 2.07289C8.96287 2.11685 9.00485 2.17857 9.02446 2.24863L10.0785 6.33863C10.138 6.56934 10.2582 6.77989 10.4267 6.94837C10.5952 7.11685 10.8057 7.23711 11.0365 7.29663L15.1265 8.35063C15.1968 8.37003 15.2588 8.41197 15.303 8.47001C15.3472 8.52806 15.3712 8.599 15.3712 8.67196C15.3712 8.74492 15.3472 8.81586 15.303 8.87391C15.2588 8.93195 15.1968 8.97389 15.1265 8.99329L11.0365 10.0473C10.8057 10.1068 10.5952 10.2271 10.4267 10.3955C10.2582 10.564 10.138 10.7746 10.0785 11.0053L9.02379 15.0953C9.00419 15.1653 8.9622 15.2271 8.90425 15.271C8.84629 15.315 8.77554 15.3388 8.70279 15.3388C8.63005 15.3388 8.5593 15.315 8.50134 15.271C8.44338 15.2271 8.4014 15.1653 8.38179 15.0953L7.32779 11.0053Z"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.0364 2.67188V5.33854"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.3698 4.00513H12.7031"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.36981 12.0051V13.3385"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.03646 12.6719H2.70312"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 text-center">
                Intelligent Talent Matching
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                Our AI connects you with the right opportunities or candidates
                based on deep profile analysis and preferences.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-end">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-900"
                >
                  <path
                    d="M36.3636 6.73858L34.2302 4.60524C34.0427 4.41577 33.8195 4.26536 33.5735 4.16271C33.3274 4.06006 33.0635 4.0072 32.7969 4.0072C32.5303 4.0072 32.2664 4.06006 32.0204 4.16271C31.7743 4.26536 31.5511 4.41577 31.3636 4.60524L4.23024 31.7386C4.04077 31.9261 3.89036 32.1493 3.78771 32.3954C3.68506 32.6414 3.6322 32.9053 3.6322 33.1719C3.6322 33.4385 3.68506 33.7024 3.78771 33.9485C3.89036 34.1945 4.04077 34.4177 4.23024 34.6052L6.36358 36.7386C6.54994 36.9301 6.7728 37.0823 7.01898 37.1863C7.26517 37.2902 7.52968 37.3437 7.79691 37.3437C8.06414 37.3437 8.32865 37.2902 8.57483 37.1863C8.82102 37.0823 9.04388 36.9301 9.23024 36.7386L36.3636 9.60524C36.5551 9.41888 36.7073 9.19602 36.8113 8.94983C36.9152 8.70365 36.9687 8.43914 36.9687 8.17191C36.9687 7.90468 36.9152 7.64017 36.8113 7.39398C36.7073 7.1478 36.5551 6.92494 36.3636 6.73858Z"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.53125 10.5L6.53125 8.50002C6.88601 7.57964 7.33272 6.6974 7.86458 5.86669C8.64137 4.62468 9.723 3.60206 11.0066 2.89608C12.2902 2.19011 13.733 1.82427 15.1979 1.83336C15.1979 3.64669 14.6779 6.83336 11.1979 9.16669C10.3558 9.69917 9.46248 10.1459 8.53125 10.5Z"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.53127 8.49997H3.19794C3.19794 8.49997 3.5646 6.47997 4.53127 5.83331C5.61127 5.11331 7.8646 5.83331 7.8646 5.83331"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.53125 10.5V13.8334C8.53125 13.8334 10.5513 13.4667 11.1979 12.5C11.9179 11.42 11.1979 9.16669 11.1979 9.16669"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 text-center">
                AI Recruitment Toolkit
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                Access tools like script generators, avatar creators, and video
                feedback to perfect your application or job posting.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-end">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-900"
                >
                  <path
                    d="M12.6562 7.51025C11.3301 7.51025 10.0583 8.03704 9.12062 8.97472C8.18294 9.9124 7.65615 11.1842 7.65615 12.5103V18.3436H11.6562V12.5103C11.6562 12.0682 11.8318 11.6443 12.1443 11.3317C12.4569 11.0192 12.8808 10.8436 13.3229 10.8436C13.7649 10.8436 14.1888 11.0192 14.5014 11.3317C14.8139 11.6443 14.9895 12.0682 14.9895 12.5103V18.3436H18.9895V12.5103C18.9895 11.1842 18.4627 9.9124 17.525 8.97472C16.5874 8.03704 15.3156 7.51025 13.9895 7.51025Z"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27.3229 14.0052H17.3229C16.4024 14.0052 15.6562 14.7514 15.6562 15.6719V19.0052C15.6562 19.9257 16.4024 20.6719 17.3229 20.6719H27.3229C28.2434 20.6719 28.9895 19.9257 28.9895 19.0052V15.6719C28.9895 14.7514 28.2434 14.0052 27.3229 14.0052Z"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 text-center">
                Dynamic Job Postings
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                Recruiters can create engaging job posts with video, showcasing
                company culture and role specifics for efficient recruitment.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-end">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-900"
                >
                  <path
                    d="M6.96349 24.0052C6.6481 24.0063 6.33887 23.9178 6.07174 23.7502C5.80461 23.5825 5.59054 23.3425 5.4544 23.058C5.31826 22.7735 5.26564 22.4562 5.30265 22.143C5.33966 21.8297 5.46479 21.5335 5.66349 21.2885L22.1635 4.28853C22.2873 4.14566 22.4559 4.04912 22.6418 4.01475C22.8277 3.98038 23.0197 3.98038 23.1864 4.06953C23.353 4.15868 23.4845 4.30185 23.559 4.47554C23.6336 4.64922 23.647 4.8431 23.5968 5.02536L20.3968 15.0587C20.3025 15.3113 20.2708 15.5829 20.3045 15.8504C20.3382 16.1179 20.4363 16.3732 20.5903 16.5944C20.7444 16.8157 20.9498 16.9963 21.1889 17.1207C21.4281 17.2451 21.6939 17.3096 21.9635 17.3087H33.6302C33.9455 17.3077 34.2548 17.3961 34.5219 17.5638C34.789 17.7314 35.0031 17.9715 35.1392 18.256C35.2754 18.5405 35.328 18.8578 35.291 19.171C35.254 19.4842 35.1289 19.7805 34.9302 20.0254L18.4302 37.0254C18.3064 37.1682 18.1377 37.2648 17.9519 37.2991C17.766 37.3335 17.5739 37.3037 17.4073 37.2146C17.2406 37.1254 17.1092 36.9822 17.0346 36.8085C16.96 36.6349 16.9467 36.441 16.9968 36.2587L20.1968 26.2254C20.2912 25.9729 20.3229 25.7012 20.2892 25.4337C20.2555 25.1662 20.1574 24.9109 20.0033 24.6897C19.8493 24.4684 19.6439 24.2879 19.4047 24.1635C19.1655 24.0391 18.8997 23.9745 18.6302 23.9754H6.96349Z"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 text-center">
                Staff Diary & Community
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                Share experiences, insights, and connect with a community of
                professionals. Explore remote job opportunities.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-end">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 41 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-gray-900"
                >
                  <path
                    d="M8.65625 12.5052L16.6562 20.5052L24.6562 12.5052"
                    stroke="#0F172A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4 text-center">
                Mutual Interest First
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                Connect only when both parties express interest, making
                interactions more meaningful and efficient. Swipe to find jobs
                easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Steps to Success with Our Recruitment Platform
            </h2>
            <p className="text-lg text-gray-600">Get started in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">
                Create Your AI Profile
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                Job seekers build a dynamic profile with an AI resume and video.
                Recruiters showcase their company and roles with our AI
                recruitment software.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">
                Swipe & Discover Talent
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                Explore AI-matched candidates or job opportunities with an
                intuitive swipe interface. Ideal for finding remote job
                opportunities or specific talent.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">
                Connect & Engage Efficiently
              </h3>
              <p className="text-gray-600 mt-4 text-center">
                When it's a mutual match via our talent matching system, connect
                directly, chat, and take the next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Professionals
            </h2>
            <p className="text-lg text-gray-600">
              See what our early users are saying.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {/* Testimonial 1 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <p className="text-gray-600">
                "SwipeHire's video resume feature helped me stand out and land
                my dream job. The AI feedback was invaluable."
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-700 font-medium">SL</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-gray-900 font-medium">Sarah L.</h4>
                  <p className="text-xs text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <p className="text-gray-600">
                "Finding qualified candidates used to be a chore. SwipeHire's AI
                recruitment software and talent matching system is a
                game-changer."
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-700 font-medium">JB</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-gray-900 font-medium">John B.</h4>
                  <p className="text-xs text-gray-500">HR Manager, Tech Corp</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <p className="text-gray-600">
                "The AI tools for video resumes are incredibly helpful. This
                platform made my job search efficient and modern."
              </p>
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-700 font-medium">MG</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-gray-900 font-medium">Maria G.</h4>
                  <p className="text-xs text-gray-500">Marketing Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
              >
                <path
                  d="M33.3333 14.0051H6.66667C5.74619 14.0051 5 14.7513 5 15.6718V19.0051C5 19.9256 5.74619 20.6718 6.66667 20.6718H33.3333C34.2538 20.6718 35 19.9256 35 19.0051V15.6718C35 14.7513 34.2538 14.0051 33.3333 14.0051Z"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 14.0051V35.6718"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M31.6667 20.6719V32.3385C31.6667 33.2226 31.3155 34.0704 30.6904 34.6956C30.0652 35.3207 29.2174 35.6719 28.3333 35.6719H11.6667C10.7826 35.6719 9.93478 35.3207 9.30965 34.6956C8.68453 34.0704 8.33334 33.2226 8.33334 32.3385V20.6719"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 14.0052C11.3949 14.0052 10.3351 13.5662 9.55373 12.7848C8.77233 12.0034 8.33334 11.9436 8.33334 10.8385C8.33334 9.73347 8.77233 8.67366 9.55373 7.89226C10.3351 7.11086 11.3949 6.67187 12.5 6.67187C14.1078 6.64386 15.6834 7.42397 17.0212 8.91047C18.3591 10.39697 19.3971 12.5209 20 14.0052C20.6029 12.5209 21.6409 10.39697 22.9788 8.91047C24.3166 7.42397 25.8922 6.64386 27.5 6.67187C28.6051 6.67187 29.6649 7.11086 30.4463 7.89226C31.2277 8.67366 31.6667 9.73347 31.6667 10.8385C31.6667 11.9436 31.2277 12.0034 30.4463 12.7848C29.6649 13.5662 28.6051 14.0052 27.5 14.0052"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                SwipeHire is Now
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-green-500">
                completely free
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                for job seekers!
              </h2>
            </div>
            <p className="text-lg text-gray-600">
              That's right! All features, for everyone. We believe in
              democratizing access to powerful hiring and job-seeking tools like
              AI Resumes and Video Interview Tools. No tiers, no subscriptions,
              no hidden costs. Just pure value.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-16 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      AI Video Resume Builder
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Craft compelling video intros with AI script assistance,
                      avatar generation, and recording tools.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Unlimited Swipes & Connections
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Explore as many profiles or job postings as you need to
                      find your perfect match. Swipe to find jobs!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Dynamic Profile & Job Posting Creation
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Full access for both job seekers to create rich profiles
                      and recruiters to post detailed jobs with video interview
                      tools.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="flex items-start gap-3 mb-6">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Intelligent Candidate & Job Matching
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Our AI talent matching system connects job seekers with
                      relevant roles and recruiters with ideal candidates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-6">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Direct Messaging on Matches
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Once a mutual interest is established, connect and chat
                      directly within our privacy recruitment platform.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Staff Diary & Community Access
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Share insights, learn from peers, and engage with the
                      professional community for efficient recruitment and job
                      seeking.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <Button className="bg-gray-900 hover:bg-gray-800 h-11 px-8">
                Join SwipeHire for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-900/75">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring or Job Search?
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
            Join SwipeHire today and experience a smarter, more engaging way to
            connect with our talent matching system and AI recruitment software.
          </p>
          <Button className="bg-white text-gray-900 hover:bg-white/90 h-11 px-8">
            Sign Up Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-8">
              We are Award-Winning!
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="w-40 h-14 bg-gray-100 rounded-md" />
              <div className="w-40 h-14 bg-gray-100 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">SwipeHire</h4>
              <p className="text-gray-400 text-sm">
                Revolutionizing recruitment through AI and video. Connecting
                talent with opportunity, seamlessly. Your privacy recruitment
                platform for efficient hiring.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    It's Free!
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white">
                    About Us (Conceptual)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 SwipeHire. All rights reserved. Built with AI assistance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
