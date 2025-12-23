import {
  Search,
  Briefcase,
  Film,
  Users,
  PlusCircle,
  BarChart3,
  Bell,
  Settings as SettingsIcon,
  Building2,
  Edit,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Info
} from "lucide-react";

import CandidateSearchPage from "../pages/CandidateSearchPage.jsx";
import PostJobPage from "../pages/PostJobPage";
import CompanyVideos from "../pages/CompanyVideos.jsx";
import NotificationSettingsPage from "../pages/NotificationSettingsPage.jsx";
import NotificationsPage from "../pages/NotificationsPage.jsx";
import AllVideosPage from "../pages/AllVideosPage.jsx";
import VideoEditPage from "../pages/VideoEditPage.jsx";
import JobsListingPage from "../pages/JobsListingPage.jsx";
import EmployerProfilePage from "../pages/EmployerProfilePage.jsx";
import Settings from "../pages/Settings.jsx";
import EmployerSettingsPage from "../pages/EmployerSettingsPage.jsx";
import Chat from "../pages/Chat.jsx";
import ConnectionsPage from "../pages/ConnectionsPage.jsx";
import HelpPageLinks from "../pages/HelpPageLinks.jsx";
import EmployerDashboard from "../pages/EmployerDashboard.jsx";
import VideoUpload from "../pages/VideoUpload.jsx"; // Import VideoUpload component
import VideosPage from "../pages/VideosPage.jsx"; // Import VideosPage component
import AnalyticsEmployer from "../pages/AnalyticsEmployer";
import EditEmployerProfilePage from "../pages/EditEmployerProfilePage";
import JobDetailsPage from "../pages/JobDetailsPage.jsx";
import JobApplicantsPage from "../pages/JobApplicantsPage.jsx";

const hasAccess = (userPlan, requiredPlan) => {
  const levels = { STARTER: 0, BUSINESS: 1, ENTERPRISE: 2 };
  const currentLevel = levels[userPlan?.toUpperCase()] || 0;
  const requiredLevel = levels[requiredPlan?.toUpperCase()] || 0;
  return currentLevel >= requiredLevel;
};

// Function to get translated employer tab categories
export const getEmployerTabCategories = (t, user) => {
  const userPlan = user?.subscriptionPlan || 'STARTER';

  return [
  {
    key: "dashboard",
    labelKey: "employerTabs:categories.dashboard",
    label: t("employerTabs:categories.dashboard"),
    tabs: [
      {
        labelKey: "employerTabs:tabs.overview",
        label: t("employerTabs:tabs.overview"),
        icon: { name: "Analytics" },
        component: EmployerDashboard,
        path: "overview",
        description: t("employerTabs:descriptions.overview")
      },
      {
        labelKey: "employerTabs:tabs.analytics",
        label: t("employerTabs:tabs.analytics"),
        icon: { name: "Analytics" },
        component: AnalyticsEmployer,
        context: "analytics",
        path: "analytics",
        description: t("employerTabs:descriptions.analytics"),
        locked: !hasAccess(userPlan, 'BUSINESS'),
        requiredPlan: 'BUSINESS'
      }
    ]
  },
  {
    key: "talentAcquisition",
    labelKey: "employerTabs:categories.talentAcquisition",
    label: t("employerTabs:categories.talentAcquisition"),
    tabs: [
      {
        labelKey: "employerTabs:tabs.findCandidates",
        label: t("employerTabs:tabs.findCandidates"),
        icon: { name: "Search" },
        component: CandidateSearchPage,
        path: "find-candidates",
        description: t("employerTabs:descriptions.findCandidates")
      },
      {
        labelKey: "employerTabs:tabs.candidateVideos",
        label: t("employerTabs:tabs.candidateVideos"),
        icon: { name: "VideoLibrary" },
        component: AllVideosPage, // Just the component reference
        context: "candidate-videos", // Add context as a property
        path: "candidate-videos",
        description: t("employerTabs:descriptions.candidateVideos")
      }
    ]
  },
  {
    key: "jobManagement",
    labelKey: "employerTabs:categories.jobManagement",
    label: t("employerTabs:categories.jobManagement"),
    tabs: [
      {
        labelKey: "employerTabs:tabs.postNewJob",
        label: t("employerTabs:tabs.postNewJob"),
        icon: { name: "PostAdd" },
        component: PostJobPage,
        path: "post-job",
        description: t("employerTabs:descriptions.postNewJob")
      },
      {
        labelKey: "employerTabs:tabs.myJobListings",
        label: t("employerTabs:tabs.myJobListings"),
        icon: { name: "Work" },
        component: JobsListingPage,
        path: "my-jobs",
        description: t("employerTabs:descriptions.myJobListings")
      },
      {
        labelKey: "employerTabs:tabs.jobDetails",
        label: t("employerTabs:tabs.jobDetails", "Job Details"),
        icon: { name: "DocumentText" },
        component: JobDetailsPage,
        path: "job-details",
        hideInSidebar: true,
        description: t(
          "employerTabs:descriptions.jobDetails",
          "View detailed information about a specific job"
        )
      },
      {
        labelKey: "employerTabs:tabs.jobApplicants",
        label: t("employerTabs:tabs.jobApplicants", "Job Applicants"),
        icon: { name: "FileText" },
        component: JobApplicantsPage,
        path: "job-applicants",
        hideInSidebar: true,
        description: t(
          "employerTabs:descriptions.jobApplicants",
          "View applications for a specific job"
        )
      }
    ]
  },
  {
    key: "companyContent",
    labelKey: "employerTabs:categories.companyContent",
    label: t("employerTabs:categories.companyContent"),
    tabs: [
      {
        labelKey: "employerTabs:tabs.companyProfile",
        label: t("employerTabs:tabs.companyProfile"),
        icon: { name: "Business" },
        component: EmployerProfilePage,
        path: "company-profile",
        description: t("employerTabs:descriptions.companyProfile")
      },
      {
        labelKey: "employerTabs:tabs.editCompanyProfile",
        label: t(
          "employerTabs:tabs.editCompanyProfile",
          "Edit Company Profile"
        ),
        icon: { name: "Edit" },
        component: EditEmployerProfilePage,
        path: "edit-employer-profile",
        description: t(
          "employerTabs:descriptions.editCompanyProfile",
          "Edit your company profile"
        )
      },
      {
        labelKey: "employerTabs:tabs.companyVideos",
        label: t("employerTabs:tabs.companyVideos"),
        icon: { name: "VideoLibrary" },
        component: VideosPage,
        path: "company-videos",
        description: t("employerTabs:descriptions.companyVideos")
      }
    ]
  },
  {
    key: "managementSettings",
    labelKey: "employerTabs:categories.managementSettings",
    label: t("employerTabs:categories.managementSettings"),
    tabs: [
      {
        labelKey: "employerTabs:tabs.notifications",
        label: t("employerTabs:tabs.notifications"),
        icon: { name: "Notifications" },
        component: NotificationSettingsPage,
        path: "notifications",
        description: t("employerTabs:descriptions.notifications")
      },
      {
        labelKey: "employerTabs:tabs.settings",
        label: t("employerTabs:tabs.settings"),
        icon: { name: "Settings" },
        component: EmployerSettingsPage,
        path: "settings",
        description: t("employerTabs:descriptions.settings")
      }
    ]
  },
  {
    key: "resources",
    labelKey: "employerTabs:categories.resources",
    label: t("employerTabs:categories.resources"),
    tabs: [
      {
        labelKey: "employerTabs:tabs.hiringTips",
        label: t("employerTabs:tabs.hiringTips"),
        icon: { name: "BookOpen" },
        component: null, // External link, no component needed
        path: "/blog",
        externalLink: true,
        description: t("employerTabs:descriptions.hiringTips")
      },
      {
        labelKey: "employerTabs:tabs.aboutUs",
        label: t("employerTabs:tabs.aboutUs"),
        icon: { name: "Info" },
        component: null, // External link, no component needed
        path: "/about",
        externalLink: true,
        description: t("employerTabs:descriptions.aboutUs")
      }
    ]
  },
  {
    key: "communication",
    labelKey: "employerTabs:categories.communication",
    label: t("employerTabs:categories.communication"),
    tabs: [
      {
        labelKey: "employerTabs:tabs.connections",
        label: t("employerTabs:tabs.connections"),
        icon: { name: "Users" },
        component: ConnectionsPage,
        path: "connections",
        description: t("employerTabs:descriptions.connections")
      },
      {
        labelKey: "employerTabs:tabs.chat",
        label: t("employerTabs:tabs.chat"),
        icon: { name: "ChatIcon" },
        component: Chat,
        path: "chat",
        description: t("employerTabs:descriptions.chat")
      },
      {
        labelKey: "employerTabs:tabs.helpSupport",
        label: t("employerTabs:tabs.helpSupport"),
        icon: { name: "HelpIcon" },
        component: HelpPageLinks,
        path: "help",
        description: t("employerTabs:descriptions.helpSupport")
      }
    ]
  },
  {
    key: "videoManagement",
    labelKey: "employerTabs:categories.videoManagement",
    label: t("employerTabs:categories.videoManagement"),
    tabs: [
      {
        labelKey: "employerTabs:tabs.videoUpload",
        label: t("employerTabs:tabs.videoUpload"),
        icon: { name: "Upload" },
        component: VideoUpload,
        path: "video-upload",
        description: t("employerTabs:descriptions.videoUpload")
      },
      {
        labelKey: "employerTabs:tabs.videoEditor",
        label: t("employerTabs:tabs.videoEditor"),
        icon: { name: "Edit" },
        component: VideoEditPage,
        path: "video-editor",
        description: t("employerTabs:descriptions.videoEditor"),
        locked: !hasAccess(userPlan, 'BUSINESS'),
        requiredPlan: 'BUSINESS'
      }
    ]
  }
];
};
