import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import CollapsibleSidebar from './CollapsibleSidebar';
import BreadcrumbNav from './BreadcrumbNav';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/UI/button.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/UI/avatar.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/UI/dropdown-menu.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '@/components/LanguageSelector';

const DashboardLayout = ({
  children,
  navigationItems = [],
  logo,
  customBreadcrumbs,
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.companyName) {
      return user.companyName.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Collapsible Sidebar */}
      <CollapsibleSidebar
        navigationItems={navigationItems}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        logo={logo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar with Breadcrumb */}
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between">
          <BreadcrumbNav customBreadcrumbs={customBreadcrumbs} />

          <div className="flex items-center gap-3">
            <LanguageSelector variant="menu" showLabel={true} />
            {/* Notifications */}
                <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                // Navigate into the tabbed dashboard / tabs route for notifications
                const roleStr = Array.isArray(user?.role) ? user?.role[0] : user?.role;
                if (roleStr === 'employer') {
                  navigate('/employer-tabs?group=communication&tab=notifications');
                } else if (roleStr === 'admin') {
                  navigate('/admin-tabs?group=dashboard&tab=notifications');
                } else {
                  // job seeker: open the 'Notifications' tab under 'communication' group (dashboard layout)
                  navigate('/jobseeker-tabs?group=communication&tab=notifications');
                }
              }}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 flex items-center justify-center p-0 bg-red-500 text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePicture} alt={user?.firstName || user?.companyName} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.companyName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  // Navigate to the dashboard settings tab using client-side navigation
                  const roleStr = Array.isArray(user?.role) ? user?.role[0] : user?.role;
                  if (roleStr === 'employer') {
                    navigate('/employer-tabs?group=managementSettings&tab=settings');
                  } else {
                    navigate('/jobseeker-tabs?group=activities&tab=settings');
                  }
                }}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  if (user?.role === 'employer') {
                    const profilePath = '/employer-tabs?group=companyContent&tab=company-profile';
                    navigate(profilePath);
                  } else {
                    // For jobseekers, use client-side navigation into the profile tab
                    navigate('/jobseeker-tabs?group=profileContent&tab=my-profile');
                  }
                }}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className={cn('container mx-auto p-6', className)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
