"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Card,
  Avatar,
  Badge,
  List,
  ListItem,
  Drawer,
  InputBase,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Chip,
  styled,
} from "@mui/material"
import { ArrowBack, Settings, Send, Videocam, Message, Person } from "@mui/icons-material"

// Custom styled components
const StatusBadge = styled(Badge)(({ theme, status }) => ({
  "& .MuiBadge-badge": {
    backgroundColor:
      status === "active"
        ? "#10B981"
        : status === "pending"
          ? "#F59E0B"
          : status === "interview"
            ? "#4F46E5"
            : "#E5E7EB",
    color: "#FFFFFF",
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: "2px solid white",
    right: 3,
    bottom: 3,
    padding: 0,
  },
}))

const StatusChip = styled(Chip)(({ theme, variant }) => ({
  borderRadius: 12,
  height: 24,
  fontSize: "0.75rem",
  fontWeight: 500,
  ...(variant === "interview" && {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "#10B981",
  }),
  ...(variant === "pending" && {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    color: "#F59E0B",
  }),
}))

const MessagePreview = styled(Typography)({
  color: "#6B7280",
  fontSize: "0.9rem",
  marginTop: 8,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  lineHeight: 1.4,
})

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  padding: "12px 16px",
  borderRadius: 18,
  fontSize: "0.95rem",
  lineHeight: 1.4,
  maxWidth: "80%",
  marginBottom: 16,
  alignSelf: isUser ? "flex-end" : "flex-start",
  backgroundColor: isUser ? "#4F46E5" : "#E5E7EB",
  color: isUser ? "#FFFFFF" : "#111827",
  borderBottomRightRadius: isUser ? 4 : 18,
  borderBottomLeftRadius: isUser ? 18 : 4,
}))

const MessageTime = styled(Typography)({
  fontSize: "0.75rem",
  color: "#6B7280",
  marginTop: 4,
  textAlign: "right",
})

// Mock data
const matches = [
  {
    id: 1,
    company: "TechCorp",
    jobTitle: "Senior UX Designer",
    status: "active",
    statusLabel: "Interview Scheduled",
    statusVariant: "interview",
    message: "Hi Alex, let's schedule the second round interview for Wednesday at 2pm?",
    unreadCount: 3,
    avatar: "/placeholder.svg?height=56&width=56",
  },
  {
    id: 2,
    company: "DesignHub",
    jobTitle: "Product Designer",
    status: "pending",
    statusLabel: "Pending Response",
    statusVariant: "pending",
    message: "We reviewed your portfolio and would love to set up a call to discuss the position...",
    unreadCount: 0,
    avatar: "/placeholder.svg?height=56&width=56",
  },
  {
    id: 3,
    company: "CreativeStudio",
    jobTitle: "UI Designer",
    status: "",
    message: "Thanks for applying! We'll review your application and get back to you soon.",
    unreadCount: 0,
    avatar: "/placeholder.svg?height=56&width=56",
  },
]

const messages = [
  { id: 1, text: "Hi Alex, we were impressed by your video resume!", isUser: false, time: "10:30 AM" },
  { id: 2, text: "Thank you! I'm really excited about this opportunity.", isUser: true, time: "10:32 AM" },
  { id: 3, text: "Let's schedule the second round interview for Wednesday at 2pm?", isUser: false, time: "10:33 AM" },
  { id: 4, text: "Wednesday at 2pm works perfectly for me.", isUser: true, time: "10:35 AM" },
  { id: 5, text: "Great! We'll send you a calendar invite with the Zoom link.", isUser: false, time: "10:36 AM" },
]

export default function Inbox() {
  const [tabValue, setTabValue] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [currentMatch, setCurrentMatch] = useState(null)
  const [bottomNavValue, setBottomNavValue] = useState(1)
  const [newMessage, setNewMessage] = useState("")

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleOpenChat = (match) => {
    setCurrentMatch(match)
    setChatOpen(true)
  }

  const handleCloseChat = () => {
    setChatOpen(false)
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, you would send the message to an API
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <Box sx={{ pb: 7, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Top Navigation */}
      <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: "white" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center", fontWeight: 600 }}>
            Inbox
          </Typography>
          <IconButton color="inherit" aria-label="settings">
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 13 }}>
        {/* Tabs */}
        <Box sx={{ bgcolor: "white", position: "sticky", top: 99, zIndex: 90 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Matches" />
            <Tab label="Messages" />
          </Tabs>
        </Box>

        {/* Match List */}
        <List sx={{ p: 2 }}>
          {matches.map((match) => (
            <Card
              key={match.id}
              sx={{
                mb: 1.5,
                borderRadius: 3,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                },
                cursor: "pointer",
              }}
              onClick={() => handleOpenChat(match)}
            >
              <ListItem sx={{ gap: 2, p: 2 }}>
                <StatusBadge
                  status={match.status}
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar src={match.avatar} alt={match.company} sx={{ width: 56, height: 56 }} />
                </StatusBadge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {match.company}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#6B7280", mb: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {match.jobTitle}
                  </Typography>
                  {match.statusLabel && (
                    <StatusChip label={match.statusLabel} variant={match.statusVariant} size="small" />
                  )}
                  <MessagePreview variant="body2">{match.message}</MessagePreview>
                </Box>
                {match.unreadCount > 0 && (
                  <Badge
                    badgeContent={match.unreadCount}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: "#4F46E5",
                        minWidth: 22,
                        height: 22,
                        borderRadius: "50%",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      },
                    }}
                  />
                )}
              </ListItem>
            </Card>
          ))}
        </List>
      </Box>

      {/* Bottom Navigation */}
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
        <BottomNavigation
          value={bottomNavValue}
          onChange={(event, newValue) => {
            setBottomNavValue(newValue)
          }}
          showLabels
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          <BottomNavigationAction label="Feed" icon={<Videocam />} />
          <BottomNavigationAction label="Inbox" icon={<Message />} />
          <BottomNavigationAction label="Profile" icon={<Person />} />
        </BottomNavigation>
      </Paper>

      {/* Chat Modal */}
      <Drawer
        anchor="right"
        open={chatOpen}
        onClose={handleCloseChat}
        sx={{
          "& .MuiDrawer-paper": {
            width: "100%",
            maxWidth: 600,
            mx: "auto",
            height: "100%",
          },
        }}
      >
        {currentMatch && (
          <>
            {/* Chat Header */}
            <AppBar position="static" color="default" elevation={1}>
              <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="back" onClick={handleCloseChat}>
                  <ArrowBack />
                </IconButton>
                <Avatar src={currentMatch.avatar} alt={currentMatch.company} sx={{ width: 40, height: 40, mr: 1.5 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {currentMatch.company}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280" }}>
                    {currentMatch.jobTitle}
                  </Typography>
                </Box>
              </Toolbar>
            </AppBar>

            {/* Chat Body */}
            <Box
              sx={{
                p: 2,
                height: "calc(100vh - 128px)",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: message.isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <MessageBubble isUser={message.isUser}>{message.text}</MessageBubble>
                  <MessageTime>{message.time}</MessageTime>
                </Box>
              ))}
            </Box>

            {/* Chat Footer */}
            <Paper
              sx={{
                p: 2,
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                maxWidth: 600,
                mx: "auto",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              elevation={3}
            >
              <InputBase
                sx={{
                  flex: 1,
                  p: "10px 16px",
                  borderRadius: 24,
                  border: "1px solid #E5E7EB",
                  "&:focus-within": {
                    border: "1px solid #4F46E5",
                  },
                }}
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <IconButton
                color="primary"
                sx={{
                  bgcolor: "#4F46E5",
                  color: "white",
                  width: 48,
                  height: 48,
                  "&:hover": {
                    bgcolor: "#6366F1",
                  },
                }}
                onClick={handleSendMessage}
              >
                <Send />
              </IconButton>
            </Paper>
          </>
        )}
      </Drawer>
    </Box>
  )
}
