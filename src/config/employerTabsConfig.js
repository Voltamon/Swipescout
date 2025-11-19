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
  HelpCircle
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
import HelpPageLinks from "../pages/HelpPageLinks.jsx";
import EmployerDashboard from "../pages/EmployerDashboard.jsx";
import VideoUpload from "../pages/VideoUpload.jsx"; // Import VideoUpload component
import AnalyticsEmployer from "../pages/AnalyticsEmployer";

// Function to get translated employer tab categories
export const getEmployerTabCategories = t => [
  {
    key: "dashboard",
    label: t("employerTabs:categories.dashboard"),
    tabs: [
      {
        label: t("employerTabs:tabs.overview"),
        icon: { name: "Analytics" },
        component: EmployerDashboard,
        path: "overview",
        description: t("employerTabs:descriptions.overview")
      },
      {
        label: t("employerTabs:tabs.analytics"),
        icon: { name: "Analytics" },
        component: AnalyticsEmployer,
        context: "analytics",
        path: "analytics",
        description: t("employerTabs:descriptions.analytics")
      }
    ]
  },
  {
    key: "talentAcquisition",
    label: t("employerTabs:categories.talentAcquisition"),
    tabs: [
      {
        label: t("employerTabs:tabs.findCandidates"),
        icon: { name: "Search" },
        component: CandidateSearchPage,
        path: "find-candidates",
        description: t("employerTabs:descriptions.findCandidates")
      },
      {
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
    label: t("employerTabs:categories.jobManagement"),
    tabs: [
      {
        label: t("employerTabs:tabs.postNewJob"),
        icon: { name: "PostAdd" },
        component: PostJobPage,
        path: "post-job",
        description: t("employerTabs:descriptions.postNewJob")
      },
      {
        label: t("employerTabs:tabs.myJobListings"),
        icon: { name: "Work" },
        component: JobsListingPage,
        path: "my-jobs",
        description: t("employerTabs:descriptions.myJobListings")
      }
    ]
  },
  {
    key: "companyContent",
    label: t("employerTabs:categories.companyContent"),
    tabs: [
      {
        label: t("employerTabs:tabs.companyProfile"),
        icon: { name: "Business" },
        component: EmployerProfilePage,
        path: "company-profile",
        description: t("employerTabs:descriptions.companyProfile")
      },
      {
        label: t("employerTabs:tabs.companyVideos"),
        icon: { name: "VideoLibrary" },
        component: CompanyVideos,
        path: "company-videos",
        description: t("employerTabs:descriptions.companyVideos")
      },
      {
        label: t("employerTabs:tabs.videoEditor"),
        icon: { name: "Edit" },
        component: VideoEditPage,
        path: "video-editor",
        description: t("employerTabs:descriptions.videoEditor")
      }
    ]
  },
  {
    key: "managementSettings",
    label: t("employerTabs:categories.managementSettings"),
    tabs: [
      {
        label: t("employerTabs:tabs.analytics"),
        icon: { name: "Analytics" },
        component: AllVideosPage, // Just the component reference
        context: "analytics", // Add context as a property
        path: "analytics",
        description: t("employerTabs:descriptions.analytics")
      },
      {
        label: t("employerTabs:tabs.notifications"),
        icon: { name: "Notifications" },
        component: NotificationSettingsPage,
        path: "notifications",
        description: t("employerTabs:descriptions.notifications")
      },
      {
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
    label: t("employerTabs:categories.resources"),
    tabs: [
      {
        label: t("employerTabs:tabs.hiringTips"),
        icon: { name: "BookOpen" },
        path: "/blog",
        externalLink: true,
        description: t("employerTabs:descriptions.hiringTips")
      },
      {
        label: t("employerTabs:tabs.aboutUs"),
        icon: { name: "Info" },
        path: "/about",
        externalLink: true,
        description: t("employerTabs:descriptions.aboutUs")
      }
    ]
  },
  {
    key: "communication",
    label: t("employerTabs:categories.communication"),
    tabs: [
      {
        label: t("employerTabs:tabs.notifications"),
        icon: { name: "Notifications" },
        component: NotificationsPage,
        path: "notifications",
        description: t("employerTabs:descriptions.notifications")
      },
      {
        label: t("employerTabs:tabs.chat"),
        icon: { name: "ChatIcon" },
        component: Chat,
        path: "chat",
        description: t("employerTabs:descriptions.chat")
      },
      {
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
    label: t("employerTabs:categories.videoManagement"),
    tabs: [
      {
        label: t("employerTabs:tabs.videoUpload"),
        icon: { name: "VideoLibrary" },
        component: VideoUpload,
        path: "video-upload",
        description: t("employerTabs:descriptions.videoUpload")
      },
      {
        label: t("employerTabs:tabs.videoEditor"),
        icon: { name: "Edit" },
        component: VideoEditPage,
        path: "video-editor",
        description: t("employerTabs:descriptions.videoEditor")
      }
    ]
  }
];
