import React from "react";
import { cn } from "./utils";

export function DashboardSidebar({
  activeTab,
  setActiveTabAction,
  tabItems,
  userName,
  userPhotoURL,
  notificationCount,
  profileCompletion,
}) {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r min-h-screen p-4">
      <div className="flex flex-col items-center mb-8">
        <img
          src={userPhotoURL}
          alt="avatar"
          className="h-16 w-16 rounded-full border mb-2"
        />
        <div className="font-semibold text-lg">
          {userName}
        </div>
        <div className="text-xs text-muted-foreground">
          Profile Completion: {profileCompletion}%
        </div>
      </div>
      <nav className="flex-1">
        {tabItems.map(item =>
          <div
            key={item.value}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded cursor-pointer mb-1",
              activeTab === item.value
                ? "bg-primary/10 text-primary font-semibold"
                : "hover:bg-muted/40"
            )}
            onClick={() => setActiveTabAction(item.value)}
          >
            <item.icon className="h-5 w-5" />
            <span>
              {item.label}
            </span>
            {item.value === "myMatches" &&
              notificationCount > 0 &&
              <span className="ml-auto bg-red-500 text-white rounded-full px-2 text-xs">
                {notificationCount}
              </span>}
          </div>
        )}
      </nav>
    </aside>
  );
}
