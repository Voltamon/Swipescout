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
import ConnectionsPage from "../pages/ConnectionsPage.jsx";
import VideoUpload from "../pages/VideoUpload.jsx";
import VideoEditPage from "../pages/VideoEditPage.jsx";
import VideosPage from "../pages/VideosPage.jsx";
import CareerAdvicePage from "../pages/CareerAdvicePage.jsx";
import PersonalityTestPage from "../pages/PersonalityTestPage.jsx";
import SkillGapAnalysisPage from "../pages/SkillGapAnalysisPage.jsx";

import { useTranslation } from "react-i18next";

const hasAccess = (userPlan, requiredPlan) => {
  const levels = { BASIC: 0, PROFESSIONAL: 1, PREMIUM: 2, ENTERPRISE: 3 };
  const currentLevel = levels[userPlan?.toUpperCase()] || 0;
  const requiredLevel = levels[requiredPlan?.toUpperCase()] || 0;
  return currentLevel >= requiredLevel;
};

export const jobseekerTabCategories = (user) => {
  const { t } = useTranslation();
  const userPlan = user?.subscriptionPlan || 'BASIC';

  return [
    {
      key: "dashboard",
        labelKey: "jobseekerTabs:categories.dashboard",
        label: t("jobseekerTabs:categories.dashboard"),
      tabs: [
        {
          labelKey: "jobseekerTabs:tabs.overview",
          label: t("jobseekerTabs:tabs.overview"),
          icon: { name: "Dashboard" },
          component: JobSeekerDashboard,
          path: "overview",
          description: t("jobseekerTabs:descriptions.overview")
        },
        {
          labelKey: "jobseekerTabs:tabs.analytics",
          label: t("jobseekerTabs:tabs.analytics"),
          icon: { name: "AnalyticsIcon" },
          component: AnalyticsJobseeker,
          context: "analytics",
          path: "analytics",
          description: t("jobseekerTabs:descriptions.analytics"),
          locked: !hasAccess(userPlan, 'PROFESSIONAL'),
          requiredPlan: 'PROFESSIONAL'
        }
      ]
    },
    {
      key: "jobSearch",
      labelKey: "jobseekerTabs:categories.jobSearch",
      label: t("jobseekerTabs:categories.jobSearch"),
      tabs: [
        {
          labelKey: "jobseekerTabs:tabs.findJobs",
          label: t("jobseekerTabs:tabs.findJobs"),
          icon: { name: "Search" },
          component: JobSearchPage,
          path: "find-jobs",
          description: t("jobseekerTabs:descriptions.findJobs")
        },
        {
          labelKey: "jobseekerTabs:tabs.videoFeed",
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
      labelKey: "jobseekerTabs:categories.profileContent",
      label: t("jobseekerTabs:categories.profileContent"),
      tabs: [
        {
          labelKey: "jobseekerTabs:tabs.myProfile",
          label: t("jobseekerTabs:tabs.myProfile"),
          icon: { name: "Person" },
          component: JobSeekerProfile,
          path: "my-profile",
          description: t("jobseekerTabs:descriptions.myProfile")
        },
        {
          labelKey: "jobseekerTabs:tabs.resumeBuilder",
          label: t("jobseekerTabs:tabs.resumeBuilder"),
          icon: { name: "Work" },
          component: ResumeBuilderPage,
          path: "resume-builder",
          description: t("jobseekerTabs:descriptions.resumeBuilder")
        },
        {
          labelKey: "jobseekerTabs:tabs.videoUpload",
          label: t("jobseekerTabs:tabs.videoUpload"),
          icon: { name: "VideoLibrary" },
          component: VideoUpload,
          path: "video-upload",
          description: t("jobseekerTabs:descriptions.videoUpload")
        },
        {
          labelKey: "jobseekerTabs:tabs.myVideos",
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
      labelKey: "jobseekerTabs:categories.savedLiked",
      label: t("jobseekerTabs:categories.savedLiked"),
      tabs: [
        {
          labelKey: "jobseekerTabs:tabs.savedVideos",
          label: t("jobseekerTabs:tabs.savedVideos"),
          icon: { name: "Bookmark" },
          component: SavedVideosPage,
          path: "saved-videos",
          description: t("jobseekerTabs:descriptions.savedVideos")
        },
        {
          labelKey: "jobseekerTabs:tabs.likedVideos",
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
      labelKey: "jobseekerTabs:categories.activities",
      label: t("jobseekerTabs:categories.activities"),
      tabs: [
        {
          labelKey: "jobseekerTabs:tabs.settings",
          label: t("jobseekerTabs:tabs.settings"),
          icon: { name: "Settings" },
          component: Settings,
          path: "settings",
          description: t("jobseekerTabs:descriptions.settings")
        },
        {
          labelKey: "jobseekerTabs:tabs.notificationSettings",
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
      labelKey: "jobseekerTabs:categories.resources",
      label: t("jobseekerTabs:categories.resources"),
      tabs: [
        {
          labelKey: "jobseekerTabs:tabs.careerAdvice",
          label: t("jobseekerTabs:tabs.careerAdvice"),
          icon: { name: "BookOpen" },
          component: CareerAdvicePage,
          path: "career-advice",
          description: t("jobseekerTabs:descriptions.careerAdvice"),
          locked: !hasAccess(userPlan, 'PREMIUM'),
          requiredPlan: 'PREMIUM'
        },
        {
          labelKey: "jobseekerTabs:tabs.personalityTest",
          label: t("jobseekerTabs:tabs.personalityTest"),
          icon: { name: "Psychology" },
          component: PersonalityTestPage,
          path: "personality-test",
          description: t("jobseekerTabs:descriptions.personalityTest"),
          locked: !hasAccess(userPlan, 'PREMIUM'),
          requiredPlan: 'PREMIUM'
        },
        {
          labelKey: "jobseekerTabs:tabs.skillGap",
          label: t("jobseekerTabs:tabs.skillGap"),
          icon: { name: "TrendingUp" },
          component: SkillGapAnalysisPage,
          path: "skill-gap-analysis",
          description: t("jobseekerTabs:descriptions.skillGap"),
          locked: !hasAccess(userPlan, 'PREMIUM'),
          requiredPlan: 'PREMIUM'
        }
      ]
    },
    {
      key: "communication",
      labelKey: "jobseekerTabs:categories.communication",
      label: t("jobseekerTabs:categories.communication"),
      tabs: [
        {
          labelKey: "jobseekerTabs:tabs.interviews",
          label: t("jobseekerTabs:tabs.interviews"),
          icon: { name: "CalendarToday" },
          component: InterviewPage,
          path: "interviews",
          description: t("jobseekerTabs:descriptions.interviews")
        },
        {
          labelKey: "jobseekerTabs:tabs.notifications",
          label: t("jobseekerTabs:tabs.notifications"),
          icon: { name: "Notifications" },
          component: NotificationsPage,
          path: "notifications",
          description: t("jobseekerTabs:descriptions.notifications")
        },
        {
          labelKey: "jobseekerTabs:tabs.connections",
          label: t("jobseekerTabs:tabs.connections"),
          icon: { name: "Person" },
          component: ConnectionsPage,
          path: "connections",
          description: t("jobseekerTabs:descriptions.connections")
        },
        {
          labelKey: "jobseekerTabs:tabs.chat",
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
      labelKey: "jobseekerTabs:categories.videoManagement",
      label: t("jobseekerTabs:categories.videoManagement"),
      tabs: [
        {
          labelKey: "jobseekerTabs:tabs.videoUpload",
          label: t("jobseekerTabs:tabs.videoUpload"),
          icon: { name: "VideoLibrary" },
          component: VideoUpload,
          path: "video-upload",
          description: t("jobseekerTabs:descriptions.videoUpload")
        },
        {
          labelKey: "jobseekerTabs:tabs.videoEditor",
          label: t("jobseekerTabs:tabs.videoEditor"),
          icon: { name: "VideoLibrary" },
          component: VideoEditPage,
          path: "video-editor",
          description: t("jobseekerTabs:descriptions.videoEditor"),
          locked: !hasAccess(userPlan, 'PROFESSIONAL'),
          requiredPlan: 'PROFESSIONAL'
        }
      ]
    }
  ];
};
