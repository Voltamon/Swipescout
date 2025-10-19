import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Avatar,
  Divider
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  ScreenShare,
  StopScreenShare,
  Chat,
  Settings,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';

const VideoCallInterface = ({ 
  interviewId, 
  roomName, 
  meetingLink, 
  onCallEnd, 
  interviewDetails 
}) => {
  const { user } = useAuth();
  const jitsiContainerRef = useRef(null);
  const [api, setApi] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);

  useEffect(() => {
    // Load Jitsi Meet External API script
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        const jitsiDomain = process.env.REACT_APP_JITSI_DOMAIN || 'meet.jit.si';
        script.src = `https://${jitsiDomain}/external_api.js`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        await loadJitsiScript();
        
        const jitsiDomain = process.env.REACT_APP_JITSI_DOMAIN || 'meet.jit.si';
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            enableClosePage: false,
            prejoinPageEnabled: false,
            disableInviteFunctions: true,
            toolbarButtons: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'profile',
              'chat',
              'recording',
              'livestreaming',
              'etherpad',
              'sharedvideo',
              'settings',
              'raisehand',
              'videoquality',
              'filmstrip',
              'invite',
              'feedback',
              'stats',
              'shortcuts',
              'tileview',
              'videobackgroundblur',
              'download',
              'help',
              'mute-everyone',
              'security'
            ]
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
            APP_NAME: 'Interview Call',
            NATIVE_APP_NAME: 'Interview Call',
            DEFAULT_BACKGROUND: '#1a1a1a',
            DISABLE_VIDEO_BACKGROUND: false,
            INITIAL_TOOLBAR_TIMEOUT: 20000,
            TOOLBAR_TIMEOUT: 4000,
            TOOLBAR_ALWAYS_VISIBLE: false,
            DEFAULT_REMOTE_displayName: 'Participant',
            DEFAULT_LOCAL_displayName: 'You',
            SHOW_CHROME_EXTENSION_BANNER: false,
            HIDE_INVITE_MORE_HEADER: true,
            DISABLE_PRESENCE_STATUS: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false
          },
          userInfo: {
            displayName: user?.displayName || user?.email || 'User',
            email: user?.email || ''
          }
        };

        const jitsiApi = new window.JitsiMeetExternalAPI(jitsiDomain, options);
        setApi(jitsiApi);

        // Event listeners
        jitsiApi.addEventListener('videoConferenceJoined', (event) => {
          console.log('Conference joined:', event);
          setIsLoading(false);
          setCallStartTime(new Date());
        });

        jitsiApi.addEventListener('videoConferenceLeft', (event) => {
          console.log('Conference left:', event);
          if (onCallEnd) {
            onCallEnd();
          }
        });

        jitsiApi.addEventListener('participantJoined', (event) => {
          console.log('Participant joined:', event);
          setParticipants(prev => [...prev, event.participant]);
        });

        jitsiApi.addEventListener('participantLeft', (event) => {
          console.log('Participant left:', event);
          setParticipants(prev => prev.filter(p => p.id !== event.participant.id));
        });

        jitsiApi.addEventListener('audioMuteStatusChanged', (event) => {
          setIsAudioEnabled(!event.muted);
        });

        jitsiApi.addEventListener('videoMuteStatusChanged', (event) => {
          setIsVideoEnabled(!event.muted);
        });

        jitsiApi.addEventListener('screenSharingStatusChanged', (event) => {
          setIsScreenSharing(event.on);
        });

        jitsiApi.addEventListener('readyToClose', () => {
          if (onCallEnd) {
            onCallEnd();
          }
        });

      } catch (error) {
        console.error('Failed to initialize Jitsi:', error);
        setError('Failed to initialize video call. Please try again.');
        setIsLoading(false);
      }
    };

    initializeJitsi();

    return () => {
      if (api) {
        api.dispose();
      }
    };
  }, [roomName, user, onCallEnd]);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (callStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now - callStartTime) / 1000);
        setCallDuration(duration);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [callStartTime]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleAudio = () => {
    if (api) {
      if (isAudioEnabled) {
        api.executeCommand('toggleAudio');
      } else {
        api.executeCommand('toggleAudio');
      }
    }
  };

  const toggleVideo = () => {
    if (api) {
      if (isVideoEnabled) {
        api.executeCommand('toggleVideo');
      } else {
        api.executeCommand('toggleVideo');
      }
    }
  };

  const toggleScreenShare = () => {
    if (api) {
      api.executeCommand('toggleShareScreen');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      jitsiContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const endCall = () => {
    if (api) {
      api.executeCommand('hangup');
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'background.paper', 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h6">
            Interview Call
          </Typography>
          {interviewDetails && (
            <Typography variant="body2" color="text.secondary">
              {interviewDetails.job?.title} • {interviewDetails.candidate?.name || interviewDetails.employer?.name}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {callStartTime && (
            <Chip 
              label={formatDuration(callDuration)} 
              color="primary" 
              variant="outlined"
            />
          )}
          <Chip 
            label={`${participants.length + 1} participant${participants.length !== 0 ? 's' : ''}`}
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Video Container */}
      <Box sx={{ flex: 1, position: 'relative', bgcolor: '#000' }}>
        {isLoading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            zIndex: 1000
          }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Connecting to video call...</Typography>
            <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
              Please allow camera and microphone access
            </Typography>
          </Box>
        )}
        
        <div 
          ref={jitsiContainerRef} 
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '400px'
          }} 
        />
      </Box>

      {/* Control Bar */}
      <Box sx={{ 
        p: 2, 
        bgcolor: 'background.paper', 
        borderTop: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'center',
        gap: 1
      }}>
        <IconButton 
          onClick={toggleAudio}
          color={isAudioEnabled ? 'primary' : 'error'}
          sx={{ 
            bgcolor: isAudioEnabled ? 'primary.light' : 'error.light',
            '&:hover': {
              bgcolor: isAudioEnabled ? 'primary.main' : 'error.main'
            }
          }}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </IconButton>

        <IconButton 
          onClick={toggleVideo}
          color={isVideoEnabled ? 'primary' : 'error'}
          sx={{ 
            bgcolor: isVideoEnabled ? 'primary.light' : 'error.light',
            '&:hover': {
              bgcolor: isVideoEnabled ? 'primary.main' : 'error.main'
            }
          }}
        >
          {isVideoEnabled ? <Videocam /> : <VideocamOff />}
        </IconButton>

        <IconButton 
          onClick={toggleScreenShare}
          color={isScreenSharing ? 'secondary' : 'default'}
        >
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
        </IconButton>

        <IconButton onClick={toggleFullscreen}>
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>

        <IconButton 
          onClick={endCall}
          color="error"
          sx={{ 
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'error.dark'
            }
          }}
        >
          <CallEnd />
        </IconButton>
      </Box>
    </Box>
  );
};

export default VideoCallInterface;

