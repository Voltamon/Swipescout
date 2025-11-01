import {
  Search,
  Briefcase,
  Film,
  User,
  Calendar,
  Bell,
  Settings as SettingsIcon,
  Bookmark,
  Heart,
  LayoutDashboard,
  MessageSquare,
  BarChart3
} from "lucide-react";

import JobSearchPage from "../pages/JobSearchPage.jsx";
import ResumeBuilderPage from "../pages/ResumeBuilderPage.jsx";
import InterviewPage from "../pages/InterviewPage.jsx";
import NotificationSettingsPage from "../pages/NotificationSettingsPage.jsx";
import AllVideosPage from "../pages/AllVideosPage.jsx";
import AnalyticsJobseeker from "../pages/AnalyticsJobseeker.jsx";
import SavedVideosPage from "../pages/SavedVideosPage.jsx";
import LikedVideosPage from "../pages/LikedVideosPage.jsx";
import JobSeekerProfile from "../pages/JobSeekerProfile.jsx";
import Settings from "../pages/Settings.jsx";
import JobSeekerDashboard from "../pages/JobSeekerDashboard.jsx";
import Chat from "../pages/Chat.jsx";
import NotificationsPage from "../pages/NotificationsPage.jsx";
import VideoUpload from "../pages/VideoUpload.jsx";
import VideoEditPage from "../pages/VideoEditPage.jsx";
import VideosPage from "../pages/VideosPage.jsx";
import CareerAdvicePage from "../pages/CareerAdvicePage.jsx";
import PersonalityTestPage from "../pages/PersonalityTestPage.jsx";
import SkillGapAnalysisPage from "../pages/SkillGapAnalysisPage.jsx";

import { useTranslation } from "react-i18next";

export const jobseekerTabCategories = () => {
  const { t } = useTranslation();

  return [
    {
      key: "dashboard",
      label: t("jobseekerTabs:categories.dashboard"),
      tabs: [
        {
          label: t("jobseekerTabs:tabs.overview"),
          icon: { name: "Dashboard" },
          component: JobSeekerDashboard,
          path: "overview",
          description: t("jobseekerTabs:descriptions.overview")
        },
        {
          label: t("jobseekerTabs:tabs.analytics"),
          icon: { name: "AnalyticsIcon" },
          component: AnalyticsJobseeker,
          context: "analytics",
          path: "analytics",
          description: t("jobseekerTabs:descriptions.analytics")
        }
      ]
    },
    {
      key: "jobSearch",
      label: t("jobseekerTabs:categories.jobSearch"),
      tabs: [
        {
          label: t("jobseekerTabs:tabs.findJobs"),
          icon: { name: "Search" },
          component: JobSearchPage,
          path: "find-jobs",
          description: t("jobseekerTabs:descriptions.findJobs")
        },
        {
          label: t("jobseekerTabs:tabs.videoFeed"),
          icon: { name: "VideoLibrary" },
          component: AllVideosPage,
          context: "jobseeker-feed",
          path: "video-feed",
          description: t("jobseekerTabs:descriptions.videoFeed")
        }
      ]
    },
    {
      key: "profileContent",
      label: t("jobseekerTabs:categories.profileContent"),
      tabs: [
        {
          label: t("jobseekerTabs:tabs.myProfile"),
          icon: { name: "Person" },
          component: JobSeekerProfile,
          path: "my-profile",
          description: t("jobseekerTabs:descriptions.myProfile")
        },
        {
          label: t("jobseekerTabs:tabs.resumeBuilder"),
          icon: { name: "Work" },
          component: ResumeBuilderPage,
          path: "resume-builder",
          description: t("jobseekerTabs:descriptions.resumeBuilder")
        },
        {
          label: t("jobseekerTabs:tabs.videoUpload"),
          icon: { name: "VideoLibrary" },
          component: VideoUpload,
          path: "video-upload",
          description: t("jobseekerTabs:descriptions.videoUpload")
        },
        {
          label: t("jobseekerTabs:tabs.myVideos"),
          icon: { name: "VideoLibrary" },
          component: VideosPage,
          context: "my-videos",
          path: "my-videos",
          description: t("jobseekerTabs:descriptions.myVideos")
        }
      ]
    },
    {
      key: "savedLiked",
      label: t("jobseekerTabs:categories.savedLiked"),
      tabs: [
        {
          label: t("jobseekerTabs:tabs.savedVideos"),
          icon: { name: "Bookmark" },
          component: SavedVideosPage,
          path: "saved-videos",
          description: t("jobseekerTabs:descriptions.savedVideos")
        },
        {
          label: t("jobseekerTabs:tabs.likedVideos"),
          icon: { name: "Favorite" },
          component: LikedVideosPage,
          path: "liked-videos",
          description: t("jobseekerTabs:descriptions.likedVideos")
        }
      ]
    },
    {
      key: "activities",
      label: t("jobseekerTabs:categories.activities"),
      tabs: [
        {
          label: t("jobseekerTabs:tabs.settings"),
          icon: { name: "Settings" },
          component: Settings,
          path: "settings",
          description: t("jobseekerTabs:descriptions.settings")
        },
        {
          label: t("jobseekerTabs:tabs.notificationSettings"),
          icon: { name: "Notifications" },
          component: NotificationSettingsPage,
          path: "notification-settings",
          description: t("jobseekerTabs:descriptions.notificationSettings")
        }
      ]
    },
    {
      key: "resources",
      label: t("jobseekerTabs:categories.resources"),
      tabs: [
        {
          label: t("jobseekerTabs:tabs.careerAdvice"),
          icon: { name: "BookOpen" },
          component: CareerAdvicePage,
          path: "career-advice",
          description: t("jobseekerTabs:descriptions.careerAdvice")
        },
        {
          label: t("jobseekerTabs:tabs.personalityTest"),
          icon: { name: "Psychology" },
          component: PersonalityTestPage,
          path: "personality-test",
          description: t("jobseekerTabs:descriptions.personalityTest")
        },
        {
          label: t("jobseekerTabs:tabs.skillGap"),
          icon: { name: "TrendingUp" },
          component: SkillGapAnalysisPage,
          path: "skill-gap-analysis",
          description: t("jobseekerTabs:descriptions.skillGap")
        }
      ]
    },
    {
      key: "communication",
      label: t("jobseekerTabs:categories.communication"),
      tabs: [
        {
          label: t("jobseekerTabs:tabs.interviews"),
          icon: { name: "CalendarToday" },
          component: InterviewPage,
          path: "interviews",
          description: t("jobseekerTabs:descriptions.interviews")
        },
        {
          label: t("jobseekerTabs:tabs.notifications"),
          icon: { name: "Notifications" },
          component: NotificationsPage,
          path: "notifications",
          description: t("jobseekerTabs:descriptions.notifications")
        },
        {
          label: t("jobseekerTabs:tabs.chat"),
          icon: { name: "ChatIcon" },
          component: Chat,
          path: "chat",
          description: t("jobseekerTabs:descriptions.chat")
        }
      ]
    },
    {
      key: "videoManagement",
      label: t("jobseekerTabs:categories.videoManagement"),
      tabs: [
        {
          label: t("jobseekerTabs:tabs.videoUpload"),
          icon: { name: "VideoLibrary" },
          component: VideoUpload,
          path: "video-upload",
          description: t("jobseekerTabs:descriptions.videoUpload")
        },
        {
          label: t("jobseekerTabs:tabs.videoEditor"),
          icon: { name: "VideoLibrary" },
          component: VideoEditPage,
          path: "video-editor",
          description: t("jobseekerTabs:descriptions.videoEditor")
        }
      ]
    }
  ];
};
