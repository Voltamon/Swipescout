import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  LinearProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSwipeable } from "react-swipeable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useAuth } from "../hooks/useAuth";
import { getRecommendedJobs, recordSwipe } from "../services/jobService";

// Custom Video Component
const VideoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "calc(100vh - 56px)",
  width: "100%",
  backgroundColor: "#000",
  overflow: "hidden"
}));

const VideoElement = styled("video")({
  width: "100%",
  height: "100%",
  objectFit: "cover"
});

const VideoOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
  color: "white",
  zIndex: 2
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(2),
  bottom: theme.spacing(10),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing(2),
  zIndex: 3
}));

const CircleButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.3)"
  }
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  borderRadius: 16
}));

const SwipeIndicator = styled(Box)(({ theme, direction }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor:
    direction === "right" ? "rgba(76, 175, 80, 0.3)" : "rgba(244, 67, 54, 0.3)",
  zIndex: 4,
  opacity: 0,
  transition: "opacity 0.3s ease"
}));

const VideoFeed = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [swipeIndicatorVisible, setSwipeIndicatorVisible] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getRecommendedJobs();
        const jobVideos=`[
  {
    "video_url": "https://f003.backblazeb2.com/file/appStorageBucket/employers/corporate+video+for+IT+company+_+corporate+video+for+Perfectial.mp4",
    "title": "vied1",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  },
  {
    "video_url": "",
    "title": "",
    "location": "",
    "employment_type": "",
    "salary_min": null,
    "salary_max": null,
    "skills": [],
    "company": {
      "name": "",
      "logo_url": ""
    }
  }
]
`;
        
        // setJobs(response.data.recommendations);
        setJobs(jobVideos);

      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSwipe = async direction => {
    if (jobs.length === 0 || currentIndex >= jobs.length) return;

    const currentJob = jobs[currentIndex];

    setSwipeDirection(direction);
    setSwipeIndicatorVisible(true);

    setTimeout(() => {
      setSwipeIndicatorVisible(false);
    }, 500);

    try {
      await recordSwipe({
        job_id: currentJob.job.id,
        direction,
        notes: `Swiped ${direction} on job: ${currentJob.job.title}`
      });

      // Move to the next job after recording the swipe
      setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 300);
    } catch (error) {
      console.error("Error recording swipe:", error);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    onSwipedUp: () => handleSwipe("up"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  if (loading) {
    return <LinearProgress />;
  }

  if (jobs.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 56px)"
        }}
      >
        <Typography variant="h6">No jobs available at the moment</Typography>
      </Box>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 56px)"
        }}
      >
        <Typography variant="h6">You've reached the end of the list</Typography>
      </Box>
    );
  }

  const currentJob = jobs[currentIndex].job;

  return (
    <Box sx={{ position: "relative", height: "calc(100vh - 56px)" }}>
      <VideoContainer {...swipeHandlers}>
        <VideoElement
          src={
            currentJob.video_url || "https://example.com/placeholder-video.mp4"
          }
          autoPlay
          loop
          muted
          playsInline
        />

        <VideoOverlay>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Avatar src={currentJob.company.logo_url} sx={{ mr: 1 }} />
            <Typography variant="h6">
              {currentJob.title}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 1 }}>
            {currentJob.company.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              {currentJob.location}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <WorkIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              {currentJob.employment_type}
            </Typography>

            <AttachMoneyIcon fontSize="small" sx={{ ml: 1, mr: 0.5 }} />
            <Typography variant="body2">
              {currentJob.salary_min && currentJob.salary_max
                ? `${currentJob.salary_min} - ${currentJob.salary_max}`
                : "Not specified"}
            </Typography>
          </Box>

          <Box sx={{ mt: 1 }}>
            {currentJob.skills &&
              currentJob.skills.map(skill =>
                <SkillChip key={skill.id} label={skill.name} size="small" />
              )}
          </Box>
        </VideoOverlay>

        <ActionButtons>
          <CircleButton
            aria-label="Not Interested"
            onClick={() => handleSwipe("left")}
            sx={{ backgroundColor: "rgba(244, 67, 54, 0.2)" }}
          >
            <CloseIcon />
          </CircleButton>

          <CircleButton
            aria-label="Interested"
            onClick={() => handleSwipe("right")}
            sx={{ backgroundColor: "rgba(76, 175, 80, 0.2)" }}
          >
            <FavoriteIcon />
          </CircleButton>

          <CircleButton aria-label="Save">
            <BookmarkIcon />
          </CircleButton>

          <CircleButton aria-label="Share">
            <ShareIcon />
          </CircleButton>
        </ActionButtons>

        <SwipeIndicator
          direction={swipeDirection}
          sx={{ opacity: swipeIndicatorVisible ? 1 : 0 }}
        >
          {swipeDirection === "right"
            ? <FavoriteIcon sx={{ fontSize: 80, color: "white" }} />
            : <CloseIcon sx={{ fontSize: 80, color: "white" }} />}
        </SwipeIndicator>
      </VideoContainer>
    </Box>
  );
};

export default VideoFeed;
