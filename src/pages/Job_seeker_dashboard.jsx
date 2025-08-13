import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Tabs,
  Tab,
  Button,
  Chip,
  Badge,
  IconButton,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  LayoutDashboard,
  Briefcase,
  Video,
  MessageSquareText,
  User,
  Settings,
  LogOut,
  Menu,
  Bell,
  TrendingUp,
  Calendar,
  Search,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Demo data for Analytics
const viewsData = [
  { day: "Mon", views: 320 },
  { day: "Tue", views: 450 },
  { day: "Wed", views: 380 },
  { day: "Thu", views: 520 },
  { day: "Fri", views: 610 },
  { day: "Sat", views: 480 },
  { day: "Sun", views: 700 },
];

const engagementData = [
  { label: "Views", value: 3200 },
  { label: "Watch Time", value: 1450 },
  { label: "Completions", value: 890 },
];

const funnelData = [
  { name: "Profile Views", value: 1200 },
  { name: "Video Plays", value: 950 },
  { name: "Saves", value: 260 },
  { name: "Contacted", value: 80 },
];

const COLORS = ["#8B5CF6", "#22D3EE", "#F59E0B", "#10B981"];

function SidebarItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all select-none hover:bg-white/5 ${
        active ? "bg-white/10 border border-white/10" : ""
      }`}
    >
      <Icon className="h-5 w-5 opacity-90" />
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
  );
}

function KeyNumber({ label, value, hint }) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="pb-2">
        <Typography
          variant="caption"
          sx={{ textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.7)" }}
        >
          {label}
        </Typography>
      </CardHeader>
      <CardContent className="pt-0">
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
        {hint ? (
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)", mt: 1 }}>
            {hint}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function JobSeekerDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabValue, setTabValue] = useState("overview");

  return (
    <div className="min-h-screen bg-[#0b0c12] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed z-30 h-screen w-72 shrink-0 border-r border-white/10 bg-[#0b0c12]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0b0c12]/80 p-4 flex flex-col gap-4 transition-transform md:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between px-2">
            <div>
              <div className="text-sm font-semibold">Tareq Alsharif</div>
              <div className="text-xs text-white/70">Job Seeker</div>
            </div>
            <Chip
              label="Beta"
              size="small"
              sx={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>

          <div className="h-px bg-white/10 my-2" />

          <nav className="flex flex-col gap-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={Briefcase} label="Find Jobs" />
            <SidebarItem icon={Video} label="My Videos" />
            <SidebarItem icon={MessageSquareText} label="Messages" />
            <SidebarItem icon={User} label="Profile" />
          </nav>

          <div className="mt-auto">
            <div className="h-px bg-white/10 mb-2" />
            <nav className="flex flex-col gap-1">
              <SidebarItem icon={Settings} label="Settings" />
              <SidebarItem icon={LogOut} label="Logout" />
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="md:ml-72 w-full">
          {/* Top bar */}
          <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0c12]/85 backdrop-blur">
            <div className="flex items-center gap-3 p-3">
              <Button
                variant="text"
                sx={{ minWidth: "auto", padding: "6px" }}
                className="md:hidden"
                onClick={() => setMobileOpen((v) => !v)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 px-1 text-sm text-white/80">
                <Search className="h-4 w-4" />
                Quick search
              </div>
              <div className="ml-auto flex items-center gap-2 pr-1">
                <IconButton color="inherit">
                  <Badge badgeContent={3} color="primary">
                    <Bell className="h-5 w-5" />
                  </Badge>
                </IconButton>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 py-6 max-w-7xl mx-auto">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
              <div className="hidden md:flex gap-2">
                <Button variant="contained" sx={{ backgroundColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9" } }}>
                  Start the search
                </Button>
                <Button variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.15)", color: "white" }}>
                  Upload video
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <Tab value="overview" label="Overview" />
              <Tab value="analytics" label="Analytics" />
            </Tabs>

            {/* Overview */}
            {tabValue === "overview" && (
              <div className="mt-5">
                {/* ... same content from your overview section ... */}
              </div>
            )}

            {/* Analytics */}
            {tabValue === "analytics" && (
              <div className="mt-5">
                {/* ... same content from your analytics section ... */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
