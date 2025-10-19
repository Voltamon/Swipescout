import {
  Search,
  Work,
  VideoLibrary,
  Person,
  PostAdd,
  Analytics,
  Notifications,
  Settings as SettingsIcon,
  Business,
  Edit,
  Chat as ChatIcon,
  Help as HelpIcon
} from "@mui/icons-material";

import CandidateSearchPage from "../pages/CandidateSearchPage";
import JobPostingForm from "../pages/JobPostingForm";
import CompanyVideos from "../pages/CompanyVideos";
import NotificationSettingsPage from "../pages/NotificationSettingsPage";
import AllVideosPage from "../pages/AllVideosPage";
import VideoEditPage from "../pages/VideoEditPage";
import JobsListingPage from "../pages/JobsListingPage";
import EmployerProfilePage from "../pages/EmployerProfilePage";
import Settings from "../pages/Settings";
import Chat from "../pages/Chat";
import HelpPageLinks from "../pages/HelpPageLinks";
import EmployerDashboard from "../pages/EmployerDashboard";
import VideoUpload from "../pages/VideoUpload"; // Import VideoUpload component

// Function to get translated employer tab categories
export const getEmployerTabCategories = (t) => [
  {
    key: "dashboard",
    label: t("employerTabs.categories.dashboard", "Dashboard"),
    tabs: [
      {
        label: t("employerTabs.tabs.overview", "Overview"),
        icon: Analytics,
        component: EmployerDashboard,
        path: "overview",
        description: t("employerTabs.descriptions.overview", "Your employer dashboard overview.")
      },
      {
        label: t("employerTabs.tabs.analytics", "Analytics"),
        icon: Analytics,
        component: AllVideosPage,
        context: "analytics",
        path: "analytics",
        description: t("employerTabs.descriptions.analytics", "View analytics and reports.")
      }
    ]
  },
  {
    key: "talentAcquisition",
    label: t("employerTabs.categories.talentAcquisition", "Talent Acquisition"),
    tabs: [
      {
        label: t("employerTabs.tabs.findCandidates", "Find Candidates"),
        icon: Search,
        component: CandidateSearchPage,
        path: "find-candidates",
        description: t("employerTabs.descriptions.findCandidates", "Search and discover candidates.")
      },
      {
        label: t("employerTabs.tabs.candidateVideos", "Candidate Videos"),
        icon: VideoLibrary,
        component: AllVideosPage, // Just the component reference
        context: "candidate-videos", // Add context as a property
        path: "candidate-videos",
        description: t("employerTabs.descriptions.candidateVideos", "Browse candidate video profiles.")
      }
    ]
  },
  {
    key: "jobManagement",
    label: t("employerTabs.categories.jobManagement", "Job Management"),
    tabs: [
      {
        label: t("employerTabs.tabs.postNewJob", "Post New Job"),
        icon: PostAdd,
        component: JobPostingForm,
        path: "post-job",
        description: t("employerTabs.descriptions.postNewJob", "Create and post new job openings.")
      },
      {
        label: t("employerTabs.tabs.myJobListings", "My Job Listings"),
        icon: Work,
        component: JobsListingPage,
        path: "my-jobs",
        description: t("employerTabs.descriptions.myJobListings", "View and manage your job listings.")
      }
    ]
  },
  {
    key: "companyContent",
    label: t("employerTabs.categories.companyContent", "Company Content"),
    tabs: [
      {
        label: t("employerTabs.tabs.companyProfile", "Company Profile"),
        icon: Business,
        component: EmployerProfilePage,
        path: "company-profile",
        description: t("employerTabs.descriptions.companyProfile", "Edit and view your company profile.")
      },
      {
        label: t("employerTabs.tabs.companyVideos", "Company Videos"),
        icon: VideoLibrary,
        component: CompanyVideos,
        path: "company-videos",
        description: t("employerTabs.descriptions.companyVideos", "Manage your company videos.")
      },
      {
        label: t("employerTabs.tabs.videoEditor", "Video Editor"),
        icon: Edit,
        component: VideoEditPage,
        path: "video-editor",
        description: t("employerTabs.descriptions.videoEditor", "Edit your company videos.")
      }
    ]
  },
  {
    key: "managementSettings",
    label: t("employerTabs.categories.managementSettings", "Management & Settings"),
    tabs: [
      {
        label: t("employerTabs.tabs.analytics", "Analytics"),
        icon: Analytics,
        component: AllVideosPage, // Just the component reference
        context: "analytics", // Add context as a property
        path: "analytics",
        description: t("employerTabs.descriptions.analytics", "View analytics and reports.")
      },
      {
        label: t("employerTabs.tabs.notifications", "Notifications"),
        icon: Notifications,
        component: NotificationSettingsPage,
        path: "notifications",
        description: t("employerTabs.descriptions.notifications", "Manage notification settings.")
      },
      {
        label: t("employerTabs.tabs.settings", "Settings"),
        icon: SettingsIcon,
        component: Settings,
        path: "settings",
        description: t("employerTabs.descriptions.settings", "Configure your account and company settings.")
      }
    ]
  },
  {
    key: "communication",
    label: t("employerTabs.categories.communication", "Communication"),
    tabs: [
      {
        label: t("employerTabs.tabs.chat", "Chat"),
        icon: ChatIcon,
        component: Chat,
        path: "chat",
        description: t("employerTabs.descriptions.chat", "Chat with candidates and team.")
      },
      {
        label: t("employerTabs.tabs.helpSupport", "Help & Support"),
        icon: HelpIcon,
        component: HelpPageLinks,
        path: "help",
        description: t("employerTabs.descriptions.helpSupport", "Get help and support.")
      }
    ]
  },
  {
    key: "videoManagement",
    label: t("employerTabs.categories.videoManagement", "Video Management"),
    tabs: [
      {
        label: t("employerTabs.tabs.videoUpload", "Video Upload"),
        icon: VideoLibrary,
        component: VideoUpload,
        path: "video-upload",
        description: t("employerTabs.descriptions.videoUpload", "Upload new videos to your account.")
      },
      {
        label: t("employerTabs.tabs.videoEditor", "Video Editor"),
        icon: Edit,
        component: VideoEditPage,
        path: "video-editor",
        description: t("employerTabs.descriptions.videoEditor", "Edit your uploaded videos.")
      }
    ]
  }
];
