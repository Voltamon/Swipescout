import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Build a readable display name from a user-like object with many possible keys
export function getDisplayName(obj) {
  if (!obj) return null;
  const fullNameCandidates = ['displayName', 'display_name', 'name', 'fullName', 'full_name', 'ownerName', 'owner_name', 'createdByName', 'created_by_name'];
  for (const k of fullNameCandidates) {
    const val = obj[k];
    if (typeof val === 'string' && val.trim()) return val.trim();
  }
  const first = obj.firstName || obj.first_name || obj.first || obj.givenName || obj.given_name;
  const last = obj.lastName || obj.last_name || obj.last || obj.familyName || obj.family_name;
  if ((first && typeof first === 'string' && first.trim()) || (last && typeof last === 'string' && last.trim())) {
    return `${String(first || '').trim()} ${String(last || '').trim()}`.trim();
  }
  return null;
}
