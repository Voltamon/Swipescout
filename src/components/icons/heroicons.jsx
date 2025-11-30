import * as React from 'react'

export const BuildingOfficeIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 21h18" />
    <path d="M7 21V9a2 2 0 012-2h6a2 2 0 012 2v12" />
    <path d="M9 21V12h6v9" />
    <path d="M8 7h.01M12 7h.01M16 7h.01" />
  </svg>
)

export const MapPinIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10c0 6-9 13-9 13S3 16 3 10a9 9 0 1118 0z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const PlayIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5 3v18l15-9L5 3z" />
  </svg>
)

export const PauseIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
)

export const SpeakerWaveIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <path d="M19 8a5 5 0 010 8" />
    <path d="M19 3a9 9 0 010 18" />
  </svg>
)

export const SpeakerXIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <path d="M19 8l-4 4m0-4l4 4" />
  </svg>
)

export const DocumentTextIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h8M8 9h4" />
  </svg>
)

export const CalendarIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

export const ClockIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
)

export const BriefcaseIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3M12 12v0M8 12v0M16 12v0" />
  </svg>
)

export const CurrencyDollarIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
)

export const AcademicCapIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
)

export const ArrowLeftIcon = ({ className = 'w-5 h-5', ...props }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export default {
  BuildingOfficeIcon,
  MapPinIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
}
