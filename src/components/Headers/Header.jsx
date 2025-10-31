import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User,
  Settings,
  HelpCircle,
  LogOut,
  UserCheck,
  LayoutDashboard,
  Briefcase,
  Users,
  Video,
  ChevronDown
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';
import { homeThemeColors } from "../../config/theme-colors-home";

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation(['header', 'navigation']);
  
  // Get authentication context
  const { user, isAuthenticated, logout } = useAuth() || {};

  const navLinks = [
    { label: t('navigation:home'), href: '/' },
    { label: t('exploreVideos'), href: '/videos' },
    { label: t('navigation:blog'), href: '/blog' },
    { label: t('navigation:pricing'), href: '/pricing' },
    { label: t('navigation:about'), href: '/about' },
    { label: t('navigation:contact'), href: '/contact' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUserMenuOpen(false);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.email) {
      return user.email;
    }
    return t('welcome');
  };

  const getDashboardPath = () => {
    if (!user?.role) return '/dashboard';
    
    switch (user.role) {
      case 'job_seeker': 
        return '/jobseeker-tabs';
      case 'employer': 
        return '/employer-tabs';
      case 'admin': 
        return '/admin-dashboard';
      default: 
        return '/dashboard';
    }
  };

  const getQuickActions = () => {
    if (!user?.role) return [];
    
    switch (user.role) {
      case 'job_seeker':
        return [
          { icon: Briefcase, label: t('jobSeeker.findJobs'), path: '/jobseeker-tabs?tab=jobs' },
          { icon: Video, label: t('jobSeeker.myVideos'), path: '/jobseeker-tabs?tab=videos' },
        ];
      case 'employer':
        return [
          { icon: Users, label: t('employer.findCandidates'), path: '/employer-tabs?tab=candidates' },
          { icon: Briefcase, label: t('employer.myJobs'), path: '/employer-tabs?tab=jobs' },
        ];
      default:
        return [];
    }
  };

  return (
    <header className={`sticky top-0 z-50 ${homeThemeColors.backgrounds.card} backdrop-blur-md border-b ${homeThemeColors.borders.default}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavigation('/')}>
            <img 
              src={`${VITE_BASE_URL}/public/logoT.png`} 
              alt="SwipeScout Logo" 
              className="h-10 w-10"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold">
                <span className="text-indigo-600 dark:text-indigo-400">Swipe</span>
                <span className="text-blue-600 dark:text-blue-400">scout</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {t('homepage.subtitle')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          
          <nav className="hidden md:flex gap-2 lg:gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors duration-200 ${homeThemeColors.text.link}`}
              >
                {link.href === '/' ? <>{'\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0'}{link.label}</> : link.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Language Selector */}
            <LanguageSelector variant="menu" showLabel={true} />

            {/* Authentication Section */}
            {isAuthenticated && user ? (
              // User authenticated - Show Avatar with Menu
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg transition-shadow"
                >
                  {getUserInitials()}
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Dashboard */}
                    <button
                      onClick={() => handleNavigation(getDashboardPath())}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      {t('common.dashboard')}
                    </button>

                    {/* Quick Actions */}
                    {getQuickActions().map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.path}
                          onClick={() => handleNavigation(action.path)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                        >
                          <Icon size={16} />
                          {action.label}
                        </button>
                      );
                    })}

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    {/* Profile Settings */}
                    <button
                      onClick={() => handleNavigation('/profile/settings')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                    >
                      <Settings size={16} />
                      {t('profileSettings')} 
                    </button>

                    {/* Account */}
                    <button
                      onClick={() => handleNavigation('/account')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                    >
                      <UserCheck size={16} />
                      {t('account')}
                    </button>

                    {/* Help Center */}
                    <button
                      onClick={() => handleNavigation('/help')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                    >
                      <HelpCircle size={16} />
                      {t('helpCenter')}
                    </button>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not authenticated - Show Login/Register buttons
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block px-4 py-2 rounded-lg text-sm font-semibold border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-shadow"
                >
                  {t('register')}
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigation(link.href)}
                className="w-full text-left px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {link.href === '/' ? <>{'\u00A0'}{link.label}</> : link.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

