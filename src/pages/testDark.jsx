import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Sparkles, Home, MessageSquare, Bell, Video, User, LogOut } from 'lucide-react';


// Utility function to get dynamic classes based on bright mode
const getDynamicClasses = (isBrightMode) => ({
  // General backgrounds
  appBg: isBrightMode ? 'bg-gray-50' : 'bg-gray-900',
  headerBg: isBrightMode ? 'bg-white' : 'bg-gray-800',
  sidebarBg: isBrightMode ? 'bg-white' : 'bg-gray-800',
  pageContainerBg: isBrightMode ? 'bg-white' : 'bg-gray-800',
  innerSectionBg: isBrightMode ? 'bg-gray-100' : 'bg-gray-700',
  listItemBg: isBrightMode ? 'bg-gray-200' : 'bg-gray-600',
  videoPlayerBg: isBrightMode ? 'bg-gray-200' : 'bg-gray-900',
  timelineBg: isBrightMode ? 'bg-gray-200' : 'bg-gray-900',
  progressBarBg: isBrightMode ? 'bg-blue-600' : 'bg-blue-500',
  playheadBg: isBrightMode ? 'bg-blue-500' : 'bg-blue-400',
  fileInputBg: isBrightMode ? 'file:bg-blue-100' : 'file:bg-blue-50',
  fileInputHoverBg: isBrightMode ? 'hover:file:bg-blue-200' : 'hover:file:bg-blue-100',

  // Footer specific colors - Matches header background
  footerBg: isBrightMode ? 'bg-white' : 'bg-gray-800',
  footerText: isBrightMode ? 'text-gray-700' : 'text-gray-300',
  footerLinkHover: isBrightMode ? 'hover:text-blue-600' : 'hover:text-blue-300',
  footerBorder: isBrightMode ? 'border-gray-300' : 'border-gray-700',
  footerIconBg: isBrightMode ? 'bg-gray-300' : 'bg-gray-700',
  footerIconHoverBg: isBrightMode ? 'hover:bg-gray-400' : 'hover:bg-gray-600',
  footerIconColor: isBrightMode ? 'text-gray-800' : 'text-white',
  footerBrandColor: isBrightMode ? 'text-blue-700' : 'text-blue-400',
  footerBrandAccent: isBrightMode ? 'text-blue-600' : 'text-blue-300',

  // Text colors
  primaryText: isBrightMode ? 'text-gray-900' : 'text-white',
  secondaryText: isBrightMode ? 'text-gray-700' : 'text-gray-300',
  tertiaryText: isBrightMode ? 'text-gray-600' : 'text-gray-400',
  quaternaryText: isBrightMode ? 'text-gray-500' : 'text-gray-500',
  blueTextPrimary: isBrightMode ? 'text-blue-700' : 'text-blue-400',
  blueTextSecondary: isBrightMode ? 'text-blue-600' : 'text-blue-300',
  greenText: isBrightMode ? 'text-green-600' : 'text-green-400',

  // Button colors
  buttonBg: isBrightMode ? 'bg-blue-600' : 'bg-blue-600',
  buttonHoverBg: isBrightMode ? 'hover:bg-blue-700' : 'hover:bg-blue-700',
  disabledButtonBg: isBrightMode ? 'bg-gray-300' : 'bg-gray-500',

  // Borders
  borderPrimary: isBrightMode ? 'border-gray-300' : 'border-gray-600',
  borderBlue: isBrightMode ? 'border-blue-700' : 'border-blue-400',

  // Icon colors
  iconColor: isBrightMode ? '#4f46e5' : '#a78bfa',
});

// Header Component
const Header = ({ isSidebarOpen, setIsSidebarOpen, isBrightMode, setIsBrightMode, user, role, handleProfileClick, handleLogout }) => {
  const classes = getDynamicClasses(isBrightMode);

  return (
    <nav
      className={`${classes.headerBg} p-4 shadow-lg flex items-center relative z-10 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
    >
      {/* Left section: Menu icon and App title */}
      <div className="flex items-center gap-2">
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 mr-4"
            aria-label="Show sidebar"
          >
            <Menu size={24} color={classes.iconColor} />
          </button>
        )}
        <h1 className={`text-xl font-bold ${classes.blueTextPrimary} transition-colors duration-300 ease-in-out`}>Swipscout</h1>
      </div>

      {/* Right section: Navigation icons, User Avatar, and Bright Mode Toggle */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200" aria-label="Home">
          <Home size={24} color={classes.secondaryText} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200" aria-label="Chat">
          <MessageSquare size={24} color={classes.secondaryText} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200" aria-label="Notifications">
          <Bell size={24} color={classes.secondaryText} />
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200" aria-label="Video Call">
          <Video size={24} color={classes.secondaryText} />
        </button>

        {/* User Avatar */}
        <button onClick={handleProfileClick} className="p-0 rounded-full overflow-hidden">
          <img
            src={user?.photo_url || 'https://placehold.co/40x40/cccccc/000000?text=U'}
            alt={user?.displayName?.[0] || user?.name?.[0] || 'U'}
            className={`w-10 h-10 rounded-full border-2 ${classes.borderBlue} shadow-md transition-colors duration-300 ease-in-out`}
          />
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200" aria-label="Logout">
          <LogOut size={24} color={classes.secondaryText} />
        </button>

        {/* Bright Mode Toggle Button */}
        <button
          onClick={() => setIsBrightMode(!isBrightMode)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle bright mode"
        >
          {isBrightMode ? <Moon size={24} color={classes.iconColor} /> : <Sun size={24} color={classes.iconColor} />}
        </button>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = ({ isBrightMode }) => {
  const classes = getDynamicClasses(isBrightMode);

  const bottomLinks = [
    { text: "Privacy Policy", href: "#" },
    { text: "Terms of Service", href: "#" },
    { text: "Help", href: "#" },
  ];

  return (
    <footer
      className={`${classes.footerBg} ${classes.footerText} py-3 px-2 border-t ${classes.footerBorder} rounded-lg shadow-md mt-2 w-full transition-colors duration-300 ease-in-out`}
    >
      <div
        className="mx-auto w-full flex flex-col sm:flex-row justify-between items-center gap-2 px-1 sm:px-3"
      >
        {/* Brand and Social Icons */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <h2 className={`text-xl font-bold ${classes.footerBrandColor} transition-colors duration-300 ease-in-out`}>
            Swip<span className={`${classes.footerBrandAccent} transition-colors duration-300 ease-in-out`}>scout</span>
          </h2>
          <p className={`text-sm ${classes.footerText} text-center sm:text-left transition-colors duration-300 ease-in-out`}>
            Revolutionizing recruitment through video connections.
          </p>

          <div className="flex gap-1 mt-1">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
              <button
                key={index}
                className={`p-2 rounded-lg ${classes.footerIconBg} ${classes.footerIconHoverBg} transition-all duration-200 shadow-md`}
                aria-label={Icon.displayName || 'Social media link'}
              >
                <Icon size={16} className={`${classes.footerIconColor} transition-colors duration-300 ease-in-out`} />
              </button>
            ))}
          </div>
        </div>

        {/* Copyright and Bottom Links */}
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
          <p className={`text-sm ${classes.footerText} transition-colors duration-300 ease-in-out`}>
            © {new Date().getFullYear()} Swipscout. All rights reserved.
          </p>

          <div className="flex gap-1.5 sm:gap-3">
            {bottomLinks.map((link) => (
              <a
                key={link.text}
                href={link.href}
                className={`${classes.footerText} no-underline ${classes.footerLinkHover} transition-all duration-200 text-sm`}
              >
                {link.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Define navigation links based on roles
const navigationLinks = {
  job_seeker: [
    { name: 'Job Listings', page: 'jobListings', icon: Home },
    { name: 'Video Editor', page: 'videoEditor', icon: Video },
    { name: 'Upload Video', page: 'uploadVideo', icon: MessageSquare },
    { name: 'My Applications', page: 'myApplications', icon: Bell },
    { name: 'Resume Builder', page: 'resumeBuilder', icon: User },
  ],
  employer: [
    { name: 'Job Listings', page: 'jobListings', icon: Home },
    { name: 'Video Editor', page: 'videoEditor', icon: Video },
    { name: 'Upload Video', page: 'uploadVideo', icon: MessageSquare },
    { name: 'Post Job', page: 'postJob', icon: Bell },
    { name: 'Manage Applicants', page: 'manageApplicants', icon: User },
  ],
  admin: [
    { name: 'Dashboard', page: 'adminDashboard', icon: Home },
    { name: 'Job Listings', page: 'jobListings', icon: Video },
    { name: 'Video Editor', page: 'videoEditor', icon: MessageSquare },
    { name: 'Upload Video', page: 'uploadVideo', icon: Bell },
    { name: 'User Management', page: 'userManagement', icon: User },
  ]
};

// Define tab links for specific pages based on roles
const pageTabLinks = {
  videoEditor: {
    job_seeker: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'My Video List', page: 'myVideoList' },
      { name: 'Examples', page: 'examples' },
      { name: 'My Applications', page: 'myApplications' },
    ],
    employer: [
      { name: 'Record Interview', page: 'recordInterview' },
      { name: 'Candidate Videos', page: 'candidateVideos' },
      { name: 'Video Templates', page: 'videoTemplates' },
      { name: 'My Applications', page: 'myApplications' },
    ],
    admin: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'My Video List', page: 'myVideoList' },
      { name: 'Examples', page: 'examples' },
      { name: 'My Applications', page: 'myApplications' },
    ]
  },
  jobListings: {
    job_seeker: [
      { name: 'Explore', page: 'exploreJobs' },
      { name: 'Detailed Search', page: 'detailedSearch' },
      { name: 'Saved Jobs', page: 'savedJobs' },
    ],
    employer: [
      { name: 'My Posted Jobs', page: 'myPostedJobs' },
      { name: 'Browse Resumes', page: 'browseResumes' },
      { name: 'New Job Post', page: 'newJobPost' },
    ],
    admin: [
      { name: 'Manage Listings', page: 'manageListings' },
      { name: 'Review Jobs', page: 'reviewJobs' },
      { name: 'Analytics', page: 'analytics' },
    ]
  },
  uploadVideo: {
    job_seeker: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'My Video List', page: 'myVideoList' },
      { name: 'Examples', page: 'examples' },
      { name: 'My Applications', page: 'myApplications' },
    ],
    employer: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'Candidate Videos', page: 'candidateVideos' },
      { name: 'Video Templates', page: 'videoTemplates' },
      { name: 'My Applications', page: 'myApplications' },
    ],
    admin: [
      { name: 'Upload Video', page: 'uploadVideo' },
      { name: 'My Video List', page: 'myVideoList' },
      { name: 'Examples', page: 'examples' },
      { name: 'My Applications', page: 'myApplications' },
    ]
  }
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isBrightMode, setIsBrightMode] = useState(false);

  const [user] = useState({
    displayName: 'John Doe',
    photo_url: 'https://placehold.co/40x40/cccccc/000000?text=JD'
  });
  const [role] = useState('job_seeker'); // Change to 'employer' or 'admin' to test different roles

  const classes = getDynamicClasses(isBrightMode);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage isBrightMode={isBrightMode} />;
      case 'videoEditor':
        return <VideoEditorPage isBrightMode={isBrightMode} role={role} />;
      case 'jobListings':
        return <JobListingsPage isBrightMode={isBrightMode} role={role} />;
      case 'uploadVideo':
        return <UploadVideoPage isBrightMode={isBrightMode} role={role} />;
      case 'myApplications':
        return <GenericPage title="My Applications" isBrightMode={isBrightMode} />;
      case 'resumeBuilder':
        return <GenericPage title="Resume Builder" isBrightMode={isBrightMode} />;
      case 'postJob':
        return <GenericPage title="Post New Job" isBrightMode={isBrightMode} />;
      case 'manageApplicants':
        return <GenericPage title="Manage Applicants" isBrightMode={isBrightMode} />;
      case 'adminDashboard':
        return <GenericPage title="Admin Dashboard" isBrightMode={isBrightMode} />;
      case 'userManagement':
        return <GenericPage title="User Management" isBrightMode={isBrightMode} />;
      default:
        return <HomePage isBrightMode={isBrightMode} />;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleProfileClick = () => {
    console.log(`Profile clicked for role: ${role}`);
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <div className={`min-h-screen ${classes.appBg} ${classes.primaryText} font-sans flex flex-col`}>
      {/* Header */}
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isBrightMode={isBrightMode}
        setIsBrightMode={setIsBrightMode}
        user={user}
        role={role}
        handleProfileClick={handleProfileClick}
        handleLogout={handleLogout}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 ${classes.sidebarBg} shadow-xl transform transition-transform duration-300 ease-in-out z-30
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 overflow-hidden'}
          p-4 transition-colors duration-300 ease-in-out`}
        style={{ height: 'fit-content', maxHeight: '100vh', overflowY: 'auto' }}
      >
        {isSidebarOpen && (
          <div className="relative pt-12">
            {/* App Logo and Name */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Sparkles size={24} color={classes.blueTextPrimary} />
              <span className={`text-2xl font-bold ${classes.primaryText} transition-colors duration-300 ease-in-out`}>Swipescout</span>
            </div>

            {/* Close Sidebar Button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                aria-label="Hide sidebar"
              >
                <X size={24} color={classes.iconColor} />
              </button>
            </div>

            {/* Navigation Links with Icons */}
            <h2 className={`text-2xl font-bold mb-6 ${classes.blueTextPrimary} transition-colors duration-300 ease-in-out`}>Navigation</h2>
            <nav className="flex flex-col space-y-2">
              {(navigationLinks[role] || navigationLinks.job_seeker).map((link) => {
                const Icon = link.icon || Home;
                return (
                  <button
                    key={link.page}
                    onClick={() => handlePageChange(link.page)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base text-left ${currentPage === link.page
                      ? `${classes.buttonBg} text-white`
                      : `${classes.secondaryText} hover:${classes.listItemBg}`
                      }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {link.name}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main
        className={`flex-grow p-4 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Generic Page Component
function GenericPage({ title, isBrightMode }) {
  const classes = getDynamicClasses(isBrightMode);
  return (
    <div className={`container mx-auto p-6 ${classes.pageContainerBg} rounded-lg shadow-xl text-center transition-colors duration-300 ease-in-out`}>
      <h1 className={`text-4xl font-bold mb-4 ${classes.blueTextPrimary} transition-colors duration-300 ease-in-out`}>{title}</h1>
      <p className={`text-lg ${classes.secondaryText} transition-colors duration-300 ease-in-out`}>
        This is a placeholder page for {title}.
      </p>
    </div>
  );
}

// Home Page Component
function HomePage({ isBrightMode }) {
  const classes = getDynamicClasses(isBrightMode);
  return (
    <div className={`container mx-auto p-6 ${classes.pageContainerBg} rounded-lg shadow-xl text-center transition-colors duration-300 ease-in-out`}>
      <h1 className={`text-4xl font-bold mb-4 ${classes.blueTextPrimary} transition-colors duration-300 ease-in-out`}>Welcome to My Application!</h1>
      <p className={`text-lg ${classes.secondaryText} transition-colors duration-300 ease-in-out`}>
        Navigate through the different sections using the sidebar or the Home button.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`${classes.innerSectionBg} p-6 rounded-lg shadow-md transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-2xl font-semibold mb-2 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>Video Editing</h2>
          <p className={`${classes.tertiaryText} transition-colors duration-300 ease-in-out`}>Edit your videos with a powerful editor.</p>
        </div>
        <div className={`${classes.innerSectionBg} p-6 rounded-lg shadow-md transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-2xl font-semibold mb-2 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>Job Search</h2>
          <p className={`${classes.tertiaryText} transition-colors duration-300 ease-in-out`}>Find your next career opportunity.</p>
        </div>
        <div className={`${classes.innerSectionBg} p-6 rounded-lg shadow-md transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-2xl font-semibold mb-2 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>Upload & Manage</h2>
          <p className={`${classes.tertiaryText} transition-colors duration-300 ease-in-out`}>Upload and manage your video content.</p>
        </div>
      </div>
    </div>
  );
}

// Video Editor Page Component
function VideoEditorPage({ isBrightMode, role }) {
  const classes = getDynamicClasses(isBrightMode);
  const tabs = pageTabLinks.videoEditor[role] || pageTabLinks.videoEditor.job_seeker;

  return (
    <div className={`container mx-auto p-6 ${classes.pageContainerBg} rounded-lg shadow-xl min-h-[calc(100vh-160px)] flex flex-col transition-colors duration-300 ease-in-out`}>
      <h1 className={`text-3xl font-bold mb-6 ${classes.blueTextPrimary} transition-colors duration-300 ease-in-out`}>My Videos / My Video List / Edit</h1>

      {/* Navigation Tabs */}
      <div className={`border-b ${classes.borderPrimary} mb-6 flex space-x-4 overflow-x-auto pb-2 transition-colors duration-300 ease-in-out`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.page}
            className={`px-4 py-2 ${index === 0 ? classes.blueTextPrimary + ' border-b-2 ' + classes.borderBlue : classes.secondaryText + ' hover:' + classes.blueTextPrimary} font-semibold text-sm sm:text-base transition-colors duration-300 ease-in-out`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row flex-grow gap-6">
        {/* Left Sidebar - Video Editor Options */}
        <div className={`${classes.innerSectionBg} p-4 rounded-lg w-full lg:w-1/4 xl:w-1/5 flex-shrink-0 transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-xl font-semibold mb-4 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>Video editor</h2>
          <ul className="space-y-3">
            {['Edit', 'Trim & Cut', 'Blur', 'Audio', 'End Screen', 'Info cards'].map((option) => (
              <li key={option} className={`flex justify-between items-center py-2 px-3 ${classes.listItemBg} rounded-md hover:bg-gray-500 transition-colors duration-300 ease-in-out cursor-pointer`}>
                <span className={`${classes.primaryText} transition-colors duration-300 ease-in-out`}>{option}</span>
                <span className={`${classes.secondaryText} transition-colors duration-300 ease-in-out`}>+</span>
              </li>
            ))}
          </ul>
          <h2 className={`text-xl font-semibold mt-6 mb-4 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>Create</h2>
          <ul className="space-y-3">
            <li className={`flex justify-between items-center py-2 px-3 ${classes.listItemBg} rounded-md hover:bg-gray-500 transition-colors duration-300 ease-in-out cursor-pointer`}>
              <span className={`${classes.primaryText} transition-colors duration-300 ease-in-out`}>Music Library</span>
              <span className={`${classes.secondaryText} transition-colors duration-300 ease-in-out`}>+</span>
            </li>
          </ul>
        </div>

        {/* Main Content Area - Video Player */}
        <div className={`${classes.innerSectionBg} rounded-lg flex-grow flex flex-col justify-center items-center p-6 transition-colors duration-300 ease-in-out`}>
          <div className={`w-full h-auto aspect-video ${classes.videoPlayerBg} rounded-lg flex items-center justify-center ${classes.quaternaryText} text-xl mb-6 transition-colors duration-300 ease-in-out`}>
            Video Player
          </div>
          {/* Video Timeline */}
          <div className={`w-full ${classes.timelineBg} rounded-full h-2 mb-2 relative transition-colors duration-300 ease-in-out`}>
            <div className={`${classes.progressBarBg} h-2 rounded-full transition-colors duration-300 ease-in-out`} style={{ width: '40%' }}></div>
            <div className={`absolute top-1/2 -mt-2 -ml-2 w-4 h-4 ${classes.playheadBg} rounded-full shadow-lg transition-colors duration-300 ease-in-out`} style={{ left: '40%' }}></div>
          </div>
          <div className={`w-full flex justify-between ${classes.tertiaryText} text-sm transition-colors duration-300 ease-in-out`}>
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>22:10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Job Listings Page Component
function JobListingsPage({ isBrightMode, role }) {
  const classes = getDynamicClasses(isBrightMode);
  const tabs = pageTabLinks.jobListings[role] || pageTabLinks.jobListings.job_seeker;

  return (
    <div className={`container mx-auto p-6 ${classes.pageContainerBg} rounded-lg shadow-xl min-h-[calc(100vh-160px)] flex flex-col transition-colors duration-300 ease-in-out`}>
      <h1 className={`text-3xl font-bold mb-6 ${classes.primaryText} transition-colors duration-300 ease-in-out`}>Find Jobs / Job Listing / Filter / Scroll</h1>

      {/* Navigation Tabs */}
      <div className={`border-b ${classes.borderPrimary} mb-6 flex space-x-4 overflow-x-auto pb-2 transition-colors duration-300 ease-in-out`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.page}
            className={`px-4 py-2 ${tab.page === 'jobListings' ? classes.blueTextPrimary + ' border-b-2 ' + classes.borderBlue : classes.secondaryText + ' hover:' + classes.blueTextPrimary} font-semibold text-sm sm:text-base transition-colors duration-300 ease-in-out`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Job Listings Content */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Job Card 1 */}
        <div className={`${classes.innerSectionBg} p-6 rounded-lg shadow-md flex flex-col transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-2xl font-semibold mb-2 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>Software Engineer</h2>
          <p className={`${classes.tertiaryText} text-sm mb-4 transition-colors duration-300 ease-in-out`}>Google - Mountain View, CA</p>
          <p className={`${classes.secondaryText} flex-grow transition-colors duration-300 ease-in-out`}>
            We are looking for a passionate Software Engineer to join our team.
          </p>
          <button className={`mt-4 px-4 py-2 ${classes.buttonBg} rounded-lg ${classes.buttonHoverBg} transition-colors duration-300 ease-in-out self-end`}>
            Apply Now
          </button>
        </div>

        {/* Example Job Card 2 */}
        <div className={`${classes.innerSectionBg} p-6 rounded-lg shadow-md flex flex-col transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-2xl font-semibold mb-2 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>Product Manager</h2>
          <p className={`${classes.tertiaryText} text-sm mb-4 transition-colors duration-300 ease-in-out`}>Microsoft - Redmond, WA</p>
          <p className={`${classes.secondaryText} flex-grow transition-colors duration-300 ease-in-out`}>
            Lead the product lifecycle from conception to launch.
          </p>
          <button className={`mt-4 px-4 py-2 ${classes.buttonBg} rounded-lg ${classes.buttonHoverBg} transition-colors duration-300 ease-in-out self-end`}>
            Apply Now
          </button>
        </div>

        {/* Example Job Card 3 */}
        <div className={`${classes.innerSectionBg} p-6 rounded-lg shadow-md flex flex-col transition-colors duration-300 ease-in-out`}>
          <h2 className={`text-2xl font-semibold mb-2 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>UX Designer</h2>
          <p className={`${classes.tertiaryText} text-sm mb-4 transition-colors duration-300 ease-in-out`}>Apple - Cupertino, CA</p>
          <p className={`${classes.secondaryText} flex-grow transition-colors duration-300 ease-in-out`}>
            Design intuitive and engaging user experiences.
          </p>
          <button className={`mt-4 px-4 py-2 ${classes.buttonBg} rounded-lg ${classes.buttonHoverBg} transition-colors duration-300 ease-in-out self-end`}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Upload Video Page Component
function UploadVideoPage({ isBrightMode, role }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const classes = getDynamicClasses(isBrightMode);
  const tabs = pageTabLinks.uploadVideo[role] || pageTabLinks.uploadVideo.job_seeker;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadMessage('');
  };

  const handleUpload = () => {
    if (selectedFile) {
      setUploading(true);
      setUploadMessage('Uploading...');
      setTimeout(() => {
        setUploading(false);
        setUploadMessage(`Successfully uploaded: ${selectedFile.name}`);
        setSelectedFile(null);
      }, 2000);
    } else {
      setUploadMessage('Please select a file to upload.');
    }
  };

  return (
    <div className={`container mx-auto p-6 ${classes.pageContainerBg} rounded-lg shadow-xl min-h-[calc(100vh-160px)] flex flex-col transition-colors duration-300 ease-in-out`}>
      <h1 className={`text-3xl font-bold mb-6 ${classes.primaryText} transition-colors duration-300 ease-in-out`}>My Videos / Upload Video / Record Video / Video Editing / Preview Video</h1>

      {/* Navigation Tabs */}
      <div className={`border-b ${classes.borderPrimary} mb-6 flex space-x-4 overflow-x-auto pb-2 transition-colors duration-300 ease-in-out`}>
        {tabs.map((tab, index) => (
          <button
            key={tab.page}
            className={`px-4 py-2 ${tab.page === 'uploadVideo' ? classes.blueTextPrimary + ' border-b-2 ' + classes.borderBlue : classes.secondaryText + ' hover:' + classes.blueTextPrimary} font-semibold text-sm sm:text-base transition-colors duration-300 ease-in-out`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Upload Section */}
      <div className={`flex-grow flex flex-col items-center justify-center p-6 ${classes.innerSectionBg} rounded-lg shadow-md text-center transition-colors duration-300 ease-in-out`}>
        <h2 className={`text-2xl font-semibold mb-6 ${classes.blueTextSecondary} transition-colors duration-300 ease-in-out`}>Upload Your Video</h2>
        <div className="mb-6">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className={`block w-full text-sm ${classes.secondaryText}
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       ${classes.fileInputBg} file:${classes.blueTextPrimary}
                       ${classes.fileInputHoverBg} cursor-pointer transition-colors duration-300 ease-in-out`}
          />
        </div>
        {selectedFile && (
          <p className={`${classes.secondaryText} mb-4 transition-colors duration-300 ease-in-out`}>Selected file: <span className="font-medium">{selectedFile.name}</span></p>
        )}
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300 ease-in-out
            ${uploading || !selectedFile ? `${classes.disabledButtonBg} cursor-not-allowed` : `${classes.buttonBg} ${classes.buttonHoverBg}`}`}
        >
          {uploading ? 'Uploading...' : 'Start Upload'}
        </button>
        {uploadMessage && (
          <p className={`mt-4 text-md ${uploading ? classes.blueTextSecondary : classes.greenText} transition-colors duration-300 ease-in-out`}>
            {uploadMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;