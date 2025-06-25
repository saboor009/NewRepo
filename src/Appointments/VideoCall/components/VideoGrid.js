import React from 'react';

// Memoized button component
const RefreshButton = React.memo(({ onClick, className, children }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
));

const VideoGrid = ({
  localVideoCallback,
  remoteVideoCallback,
  isMuted,
  isVideoOff,
  isCallConnected,
  isRemoteVideoPlaying,
  forceRefreshRemoteVideo
}) => {
  return (
    <div className="video-grid">
      <div className="video-wrapper local-video-wrapper">
        <video 
          ref={localVideoCallback} 
          autoPlay 
          playsInline 
          muted 
          className="local-video"
          style={{ objectFit: 'cover' }}
        />
        <div className="video-label">You {isMuted ? '(Muted)' : ''}</div>
        {isVideoOff && (
          <div className="video-off-overlay">
            <span>Camera Off</span>
          </div>
        )}
      </div>
      
      <div className="video-wrapper remote-video-wrapper">
        <video 
          ref={remoteVideoCallback}
          autoPlay 
          playsInline 
          className="remote-video"    
          controls
          style={{ backgroundColor: "#000", objectFit: 'cover' }}
        />
        <div className="video-label">
          {isCallConnected ? 
            (isRemoteVideoPlaying ? 'Remote User' : 'Connected (No Video)') : 
            'Waiting for connection...'}
        </div>
        
        {/* Add loading indicator when connected but video not playing */}
        {isCallConnected && !isRemoteVideoPlaying && (
          <div className="video-loading-overlay">
            <div>Video stream loading...</div>
            <RefreshButton 
              onClick={forceRefreshRemoteVideo}
              className="refresh-button"
            >
              Click to refresh
            </RefreshButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(VideoGrid);