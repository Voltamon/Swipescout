import {
  Search,
  Work,
  VideoLibrary,
  Person,
  CalendarToday,
  Notifications,
  Settings as SettingsIcon,
  Bookmark,
  Favorite,
  Dashboard,
  Chat as ChatIcon,
  Analytics as AnalyticsIcon
} from "@mui/icons-material";

import JobSearchPage from "../pages/JobSearchPage";
import ResumeBuilderPage from "../pages/ResumeBuilderPage";
import InterviewPage from "../pages/InterviewPage";
import NotificationSettingsPage from "../pages/NotificationSettingsPage";
import AllVideosPage from "../pages/AllVideosPage";
import SavedVideosPage from "../pages/SavedVideosPage";
import LikedVideosPage from "../pages/LikedVideosPage";
import JobSeekerProfile from "../pages/JobSeekerProfile";
import Settings from "../pages/Settings";
import JobSeekerDashboard from "../pages/JobSeekerDashboard";
import Chat from "../pages/Chat";
import NotificationsPage from "../pages/NotificationsPage";
import VideoUpload from "../pages/VideoUpload";
import VideoEditPage from "../pages/VideoEditPage";
import VideosPage from "../pages/VideosPage";

import { useTranslation } from "react-i18next";

export const jobseekerTabCategories = () => {
  const { t } = useTranslation(); // Moved inside the function

  return [
    {
      key: "dashboard",
      label: t("jobseekerTabs.dashboard", "Dashboard"),
      tabs: [
        {
          label: t("jobseekerTabs.overview", "Overview"),
          icon: Dashboard,
          component: JobSeekerDashboard,
          path: "overview",
          description: "Your job seeker dashboard overview."
        },
        {
          label: t("jobseekerTabs.analytics", "Analytics"),
          icon: AnalyticsIcon,
          component: AllVideosPage,
          context: "analytics",
          path: "analytics",
          description: "View analytics and insights."
        }
      ]
    },
    {
      key: "jobSearch",
      label: t("jobseekerTabs.jobSearch", "Job Search"),
      tabs: [
        {
          label: t("jobseekerTabs.findJobs", "Find Jobs"),
          icon: Search,
          component: JobSearchPage,
          path: "find-jobs",
          description: "Search for job opportunities."
        },
        {
          label: t("jobseekerTabs.videoFeed", "Video Feed"),
          icon: VideoLibrary,
          component: AllVideosPage,
          context: "jobseeker-feed",
          path: "video-feed",
          description: "Browse job-related videos."
        }
      ]
    },
    {
      key: "profileContent",
      label: t("jobseekerTabs.profileContent", "Profile & Content"),
      tabs: [
        {
          label: t("jobseekerTabs.myProfile", "My Profile"),
          icon: Person,
          component: JobSeekerProfile,
          path: "my-profile",
          description: "Manage your profile."
        },
        {
          label: t("jobseekerTabs.resumeBuilder", "Resume Builder"),
          icon: Work,
          component: ResumeBuilderPage,
          path: "resume-builder",
          description: "Build your resume."
        },
        {
          label: t("jobseekerTabs.videoUpload", "Video Upload"),
          icon: VideoLibrary,
          component: VideoUpload,
          path: "video-upload",
          description: "Upload a new video."
        },
        {
          label: t("jobseekerTabs.myVideos", "My Videos"),
          icon: VideoLibrary,
          component: VideosPage,
          context: "my-videos",
          path: "my-videos",
          description: "Your uploaded videos."
        }
      ]
    },
    {
      key: "savedLiked",
      label: t("jobseekerTabs.savedLiked", "Saved & Liked"),
      tabs: [
        {
          label: t("jobseekerTabs.savedVideos", "Saved Videos"),
          icon: Bookmark,
          component: SavedVideosPage,
          path: "saved-videos",
          description: "Your saved videos."
        },
        {
          label: t("jobseekerTabs.likedVideos", "Liked Videos"),
          icon: Favorite,
          component: LikedVideosPage,
          path: "liked-videos",
          description: "Videos you liked."
        }
      ]
    },
    {
      key: "activities",
      label: t("jobseekerTabs.activities", "Activities"),
      tabs: [
        {
          label: t("jobseekerTabs.settings", "Settings"),
          icon: SettingsIcon,
          component: Settings,
          path: "settings",
          description: "Account settings."
        },
        {
          label: t(
            "jobseekerTabs.notificationSettings",
            "Notification Settings"
          ),
          icon: Notifications,
          component: NotificationSettingsPage,
          path: "notification-settings",
          description: "Manage notification settings."
        }
      ]
    },
    {
      key: "communication",
      label: t("jobseekerTabs.communication", "Communication"),
      tabs: [
        {
          label: t("jobseekerTabs.interviews", "Interviews"),
          icon: CalendarToday,
          component: InterviewPage,
          path: "interviews",
          description: "Manage interviews."
        },
        {
          label: t("jobseekerTabs.notifications", "Notifications"),
          icon: Notifications,
          component: NotificationsPage,
          path: "notifications",
          description: "Check notifications."
        },
        {
          label: t("jobseekerTabs.chat", "Chat"),
          icon: ChatIcon,
          component: Chat,
          path: "chat",
          description: "Chat with employers and support."
        }
      ]
    },
    {
      key: "videoManagement",
      label: "Video Management",
      tabs: [
        {
          label: "Video Upload",
          icon: VideoLibrary,
          component: VideoUpload,
          path: "video-upload",
          description: "Upload new videos to your account."
        },
        {
          label: "Video Editor",
          icon: VideoLibrary,
          component: VideoEditPage,
          path: "video-editor",
          description: "Edit your uploaded videos."
        }
      ]
    }
  ];
};
