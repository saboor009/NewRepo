import React from 'react';

// Memoized button component
const ControlButton = React.memo(({ onClick, className, children }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
));

const CallControls = ({
  isMuted,
  isVideoOff,
  muteButtonText,
  videoButtonText,
  toggleMute,
  toggleVideo,
  endCall,
  forceRefreshRemoteVideo
}) => {
  return (
    <div className="controls">
      <ControlButton 
        className={`control-button ${isMuted ? 'active' : ''}`} 
        onClick={toggleMute}
      >
        {muteButtonText}
      </ControlButton>
      
      <ControlButton 
        className={`control-button ${isVideoOff ? 'active' : ''}`} 
        onClick={toggleVideo}
      >
        {videoButtonText}
      </ControlButton>
      
      <ControlButton 
        className="control-button end-call" 
        onClick={endCall}
      >
        End Call
      </ControlButton>
      
      <ControlButton 
        className="control-button refresh-video"
        onClick={forceRefreshRemoteVideo}
      >
        Refresh Video
      </ControlButton>
    </div>
  );
};

export default React.memo(CallControls);