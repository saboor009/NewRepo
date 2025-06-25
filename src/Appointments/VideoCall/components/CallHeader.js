import React from 'react';

const CallHeader = ({ connectionStatus, callDuration }) => {
  return (
    <div className="call-header">
      <div className="call-status">{connectionStatus}</div>
      <div className="call-timer">{callDuration}</div>
    </div>
  );
};

export default React.memo(CallHeader);