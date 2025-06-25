import React from 'react';
import useVideoCall from './hooks/useVideoCall';
import CallHeader from './components/CallHeader';
import VideoGrid from './components/VideoGrid';
import CallControls from './components/CallControls';
import '../video_call.css';

const VideoCall = () => {
  const {
    // Video callbacks
    localVideoCallback,
    remoteVideoCallback,
    
    // State
    isMuted,
    isVideoOff,
    isCallConnected,
    isRemoteVideoPlaying,
    
    // Computed values
    connectionStatus,
    callDuration,
    muteButtonText,
    videoButtonText,
    
    // Actions
    toggleMute,
    toggleVideo,
    endCall,
    forceRefreshRemoteVideo
  } = useVideoCall();

  return (
    <div className="video-call-container">
      <CallHeader 
        connectionStatus={connectionStatus}
        callDuration={callDuration}
      />
      
      <VideoGrid
        localVideoCallback={localVideoCallback}
        remoteVideoCallback={remoteVideoCallback}
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isCallConnected={isCallConnected}
        isRemoteVideoPlaying={isRemoteVideoPlaying}
        forceRefreshRemoteVideo={forceRefreshRemoteVideo}
      />
      
      {/* Connection status indicator */}
      <div className="connection-status">
        {connectionStatus}
      </div>
      
      <CallControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        muteButtonText={muteButtonText}
        videoButtonText={videoButtonText}
        toggleMute={toggleMute}
        toggleVideo={toggleVideo}
        endCall={endCall}
        forceRefreshRemoteVideo={forceRefreshRemoteVideo}
      />
    </div>
  );
};

export default VideoCall;