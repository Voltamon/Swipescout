import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/UI/button.jsx';
import { ScrollArea } from '@/components/UI/scroll-area.jsx';
import { Separator } from '@/components/UI/separator.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/UI/tooltip.jsx';

const CollapsibleSidebar = ({ navigationItems = [], isCollapsed, setIsCollapsed, logo }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    // Defensive guards: path must be a non-empty string and location must be available
    if (!path || typeof path !== 'string' || !location || typeof location.pathname !== 'string') return false;

    // Handle query params in path
    const pathWithoutQuery = path.split('?')[0];
    const currentPathWithoutQuery = location.pathname;

    // Check if the current path matches exactly
    if (currentPathWithoutQuery === pathWithoutQuery) return true;

    // Check if query params match (only when a query is present in the configured path)
    if (path.includes('?') && typeof location.search === 'string' && location.search.length > 0) {
      const parts = path.split('?');
      if (parts.length > 1) {
        const params = new URLSearchParams(parts[1]);
        const currentParams = new URLSearchParams(location.search);
        const tab = params.get('tab');
        const currentTab = currentParams.get('tab');
        if (tab && currentTab === tab) return true;
      }
    }

    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            {logo || (
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                SwipeScout
              </span>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 py-4">
        <TooltipProvider delayDuration={0}>
          <nav className="space-y-1 px-2">
            {navigationItems.map((item, index) => {
              const active = isActive(item.path);
              
              if (item.type === 'separator') {
                return (
                  <div key={index} className="py-2">
                    {!isCollapsed && item.label && (
                      <p className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        {item.label}
                      </p>
                    )}
                    <Separator className="my-2" />
                  </div>
                );
              }

              const navButton = (
                <Button
                  variant={active ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start transition-all',
                    isCollapsed ? 'px-2' : 'px-3',
                    active
                      ? 'bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-950/30 dark:to-cyan-950/30 text-purple-700 dark:text-purple-400 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  )}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className={cn('h-5 w-5 flex-shrink-0', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span className="ml-auto text-xs bg-purple-600 text-white rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Button>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <span className="text-xs bg-purple-600 text-white rounded-full px-2 py-0.5">
                          {item.badge}
                        </span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={index}>{navButton}</div>;
            })}
          </nav>
        </TooltipProvider>
      </ScrollArea>
    </div>
  );
};

export default CollapsibleSidebar;
