import { useState, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calculateCallDuration, getConnectionStatusText, getMuteButtonText, getVideoButtonText } from '../utils/videoUtils';

const useVideoCallState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract roomId and isInitiator from location state with default fallback
  const { roomId, isInitiator } = location.state || {};
  
  // Refs for video elements and connection
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const iceConnectionStateTimerRef = useRef(null);
  const iceCandidateQueueRef = useRef([]);
  
  // State management for UI and connection
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [videoElementsReady, setVideoElementsReady] = useState(false);
  const [isRemoteVideoPlaying, setIsRemoteVideoPlaying] = useState(false);
  const [connectionState, setConnectionState] = useState('new');
  const [callStartTime, setCallStartTime] = useState(null);

  // Use ref callbacks to confirm DOM elements are ready
  const localVideoCallback = useCallback(node => {
    localVideoRef.current = node;
    checkVideoElementsReady();
  }, []);

  const remoteVideoCallback = useCallback(node => {
    remoteVideoRef.current = node;
    checkVideoElementsReady();
  }, []);

  // Check if both video elements are mounted in the DOM
  const checkVideoElementsReady = useCallback(() => {
    if (localVideoRef.current && remoteVideoRef.current && !videoElementsReady) {
      console.log("Both video elements are now in the DOM");
      setVideoElementsReady(true);
    }
  }, [videoElementsReady]);

  // Calculate call duration
  const callDuration = useMemo(() => calculateCallDuration(callStartTime), [callStartTime]);

  // Status string for display
  const connectionStatus = useMemo(() => 
    getConnectionStatusText(connectionState, peerConnectionRef), 
    [connectionState]
  );

  // Memoized button texts
  const muteButtonText = useMemo(() => getMuteButtonText(isMuted), [isMuted]);
  const videoButtonText = useMemo(() => getVideoButtonText(isVideoOff), [isVideoOff]);

  return {
    // Location and navigation
    roomId,
    isInitiator,
    navigate,
    
    // Refs
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
    remoteStreamRef,
    iceConnectionStateTimerRef,
    iceCandidateQueueRef,
    
    // State
    isMuted,
    setIsMuted,
    isVideoOff,
    setIsVideoOff,
    isCallConnected,
    setIsCallConnected,
    localStream,
    setLocalStream,
    videoElementsReady,
    setVideoElementsReady,
    isRemoteVideoPlaying,
    setIsRemoteVideoPlaying,
    connectionState,
    setConnectionState,
    callStartTime,
    setCallStartTime,
    
    // Callbacks
    localVideoCallback,
    remoteVideoCallback,
    checkVideoElementsReady,
    
    // Computed values
    callDuration,
    connectionStatus,
    muteButtonText,
    videoButtonText
  };
};

export default useVideoCallState;