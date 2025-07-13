import React from "react";
import { Button } from "./Button";

export function AppHeader({
  isAuthenticated,
  userName,
  userPhotoURL,
  searchTerm,
  onSearchTermChange,
  className,
}) {
  return (
    <div
      className={`flex w-full items-center justify-between ${className || ""}`}
    >
      <div className="flex items-center gap-3">
        <img
          src={userPhotoURL}
          alt="avatar"
          className="h-9 w-9 rounded-full border"
        />
        <span className="font-semibold text-lg">
          {userName}
        </span>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => onSearchTermChange(e.target.value)}
        className="ml-4 rounded border px-3 py-1 text-base focus:outline-none focus:ring"
        style={{ minWidth: 180 }}
      />
      <Button variant="outline" className="ml-4">
        Logout
      </Button>
    </div>
  );
}
