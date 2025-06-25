// Video utility functions

// Calculate call duration from start time
export const calculateCallDuration = (callStartTime) => {
  if (!callStartTime) return '00:00';
  
  const duration = Math.floor((Date.now() - callStartTime) / 1000);
  const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
  const seconds = (duration % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

// Get connection status text for display
export const getConnectionStatusText = (connectionState, peerConnectionRef) => {
  if (!peerConnectionRef.current) return 'Initializing...';
  
  switch (connectionState) {
    case 'connected': return 'Connected';
    case 'connecting': return 'Connecting...';
    case 'disconnected': return 'Disconnected - trying to reconnect...';
    case 'failed': return 'Connection failed - please try again';
    case 'closed': return 'Call ended';
    default: return 'Preparing connection...';
  }
};

// Get button text for mute control
export const getMuteButtonText = (isMuted) => isMuted ? 'Unmute' : 'Mute';

// Get button text for video control
export const getVideoButtonText = (isVideoOff) => isVideoOff ? 'Turn Video On' : 'Turn Video Off';