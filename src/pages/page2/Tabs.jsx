import React from "react";

export function Tabs({ value, onValueChange, className, children }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function TabsContent({ value, className, children }) {
  // Always render, parent controls visibility
  return (
    <div className={className}>
      {children}
    </div>
  );
}
