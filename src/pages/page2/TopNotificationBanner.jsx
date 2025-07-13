import React from "react";

export function TopNotificationBanner({ notification }) {
  if (!notification) return null;
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-blue-100 text-blue-800 text-center py-2 border-b border-blue-200">
      {notification.message}
    </div>
  );
}
