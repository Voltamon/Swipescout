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
import CareerAdvicePage from "../pages/CareerAdvicePage";
import PersonalityTestPage from "../pages/PersonalityTestPage";
import SkillGapAnalysisPage from "../pages/SkillGapAnalysisPage";

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
          icon: { name: "Dashboard" },
          component: JobSeekerDashboard,
          path: "overview",
          description: "Your job seeker dashboard overview."
        },
        {
          label: t("jobseekerTabs.analytics", "Analytics"),
          icon: { name: "AnalyticsIcon" },
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
          icon: { name: "Search" },
          component: JobSearchPage,
          path: "find-jobs",
          description: "Search for job opportunities."
        },
        {
          label: t("jobseekerTabs.videoFeed", "Video Feed"),
          icon: { name: "VideoLibrary" },
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
          icon: { name: "Person" },
          component: JobSeekerProfile,
          path: "my-profile",
          description: "Manage your profile."
        },
        {
          label: t("jobseekerTabs.resumeBuilder", "Resume Builder"),
          icon: { name: "Work" },
          component: ResumeBuilderPage,
          path: "resume-builder",
          description: "Build your resume."
        },
        {
          label: t("jobseekerTabs.videoUpload", "Video Upload"),
          icon: { name: "VideoLibrary" },
          component: VideoUpload,
          path: "video-upload",
          description: "Upload a new video."
        },
        {
          label: t("jobseekerTabs.myVideos", "My Videos"),
          icon: { name: "VideoLibrary" },
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
          icon: { name: "Bookmark" },
          component: SavedVideosPage,
          path: "saved-videos",
          description: "Your saved videos."
        },
        {
          label: t("jobseekerTabs.likedVideos", "Liked Videos"),
          icon: { name: "Favorite" },
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
          icon: { name: "Settings" },
          component: Settings,
          path: "settings",
          description: "Account settings."
        },
        {
          label: t(
            "jobseekerTabs.notificationSettings",
            "Notification Settings"
          ),
          icon: { name: "Notifications" },
          component: NotificationSettingsPage,
          path: "notification-settings",
          description: "Manage notification settings."
        }
      ]
    },
    {
      key: "resources",
      label: t("jobseekerTabs.resources", "Resources"),
      tabs: [
        {
          label: t("jobseekerTabs.careerAdvice", "Career Advice"),
          icon: { name: "BookOpen" },
          component: CareerAdvicePage,
          path: "career-advice",
          description: "Browse career tips and advice."
        },
        {
          label: t("jobseekerTabs.personalityTest", "Personality Test"),
          icon: { name: "Psychology" },
          component: PersonalityTestPage,
          path: "personality-test",
          description: "Discover your personality type and ideal career match."
        },
        {
          label: t("jobseekerTabs.skillGap", "Skill Gap Analysis"),
          icon: { name: "TrendingUp" },
          component: SkillGapAnalysisPage,
          path: "skill-gap-analysis",
          description: "Identify and bridge your skills gaps."
        }
      ]
    },
    {
      key: "communication",
      label: t("jobseekerTabs.communication", "Communication"),
      tabs: [
        {
          label: t("jobseekerTabs.interviews", "Interviews"),
          icon: { name: "CalendarToday" },
          component: InterviewPage,
          path: "interviews",
          description: "Manage interviews."
        },
        {
          label: t("jobseekerTabs.notifications", "Notifications"),
          icon: { name: "Notifications" },
          component: NotificationsPage,
          path: "notifications",
          description: "Check notifications."
        },
        {
          label: t("jobseekerTabs.chat", "Chat"),
          icon: { name: "ChatIcon" },
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
          icon: { name: "VideoLibrary" },
          component: VideoUpload,
          path: "video-upload",
          description: "Upload new videos to your account."
        },
        {
          label: "Video Editor",
          icon: { name: "VideoLibrary" },
          component: VideoEditPage,
          path: "video-editor",
          description: "Edit your uploaded videos."
        }
      ]
    }
  ];
};
