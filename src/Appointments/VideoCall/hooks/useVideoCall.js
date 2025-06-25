import { useEffect, useCallback } from 'react';
import socket from '../../socket';
import useVideoCallState from './useVideoCallState';
import useMediaControls from './useMediaControls';
import useWebRTCConnection from './useWebRTCConnection';
import useSocketHandlers from './useSocketHandlers';

const useVideoCall = () => {
  const state = useVideoCallState();
  const mediaControls = useMediaControls(state);
  const webrtcActions = useWebRTCConnection(state);
  const socketHandlers = useSocketHandlers(state, webrtcActions);

  const {
    roomId,
    isInitiator,
    navigate,
    videoElementsReady,
    setCallStartTime,
    isCallConnected,
    remoteVideoRef,
    remoteStreamRef,
    setIsRemoteVideoPlaying,
    localStream,
    peerConnectionRef,
    iceConnectionStateTimerRef
  } = state;

  const { startMedia } = mediaControls;
  const { createPeerConnection, createAndSendOffer } = webrtcActions;
  const { 
    handleUserConnected, 
    handleUserDisconnected, 
    handleReceiveOffer, 
    handleReceiveAnswer, 
    handleReceiveIceCandidate 
  } = socketHandlers;

  // Force refresh remote video
  const forceRefreshRemoteVideo = useCallback(() => {
    console.log("Forcing refresh of remote video...");
    
    if (!remoteVideoRef.current || !remoteVideoRef.current.srcObject) {
      console.log("No remote video stream to refresh");
      return;
    }
    
    // Store reference to remote stream if not already stored
    if (!remoteStreamRef.current) {
      remoteStreamRef.current = remoteVideoRef.current.srcObject;
    }
    
    // Multi-step approach to fix the remote video:
    
    // 1. Remove the stream
    remoteVideoRef.current.srcObject = null;
    
    // 2. Force a style change to trigger browser redraw
    remoteVideoRef.current.style.display = 'none';
    
    // Force browser reflow
    void remoteVideoRef.current.offsetHeight;
    
    // 3. Re-add the stream and restore display
    setTimeout(() => {
      if (remoteVideoRef.current && remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
        remoteVideoRef.current.style.display = 'block';
        
        // 4. Explicitly try to play
        remoteVideoRef.current.play()
          .then(() => {
            console.log("Remote video playback started after refresh");
            setIsRemoteVideoPlaying(true);
          })
          .catch(err => {
            console.warn("Autoplay prevented after refresh:", err);
            alert("Click OK to enable remote video");
            
            // Try again after user interaction
            remoteVideoRef.current.play()
              .then(() => setIsRemoteVideoPlaying(true))
              .catch(e => console.error("Failed to play video after interaction:", e));
          });
      }
    }, 300);
  }, [remoteVideoRef, remoteStreamRef, setIsRemoteVideoPlaying]);

  // Initialize WebRTC after video elements are in the DOM
  useEffect(() => {
    if (videoElementsReady && roomId) {
      console.log("Video elements are ready, initializing WebRTC...");
      initializeWebRTC();
    }
  }, [videoElementsReady, roomId]);

  // Separated WebRTC initialization from component mount
  const initializeWebRTC = useCallback(() => {
    if (!roomId) {
      console.error("Cannot initialize WebRTC without a room ID");
      alert("Missing room ID. Redirecting to appointments.");
      navigate('/appointments');
      return;
    }

    console.log(`Joining room ${roomId} as ${isInitiator ? 'initiator' : 'receiver'}`);

    // Join the room
    socket.emit('join-room', { roomId });

    // Set up socket event listeners with debug logging
    const setupSocketListeners = () => {
      socket.on('user-connected', () => {
        console.log('EVENT: user-connected received');
        handleUserConnected();
      });
      
      socket.on('user-disconnected', () => {
        console.log('EVENT: user-disconnected received');
        handleUserDisconnected();
      });
      
      socket.on('offer', (data) => {
        console.log('EVENT: offer received');
        handleReceiveOffer(data);
      });
      
      socket.on('answer', (data) => {
        console.log('EVENT: answer received');
        handleReceiveAnswer(data);
      });
      
      socket.on('ice-candidate', (data) => {
        console.log('EVENT: ice-candidate received');
        handleReceiveIceCandidate(data);
      });
    };

    setupSocketListeners();

    // Start the media
    startMedia().then(stream => {
      if (stream) {
        createPeerConnection(stream);
        
        // If initiator, create and send offer
        if (isInitiator) {
          console.log("I am the initiator, creating offer");
          setTimeout(() => {
            createAndSendOffer();
          }, 1000); // Small delay to ensure connection is ready
        } else {
          console.log("I am the receiver, waiting for offer");
        }
      }
    });

    // Monitor network connectivity
    const monitorNetwork = () => {
      const checkConnection = () => {
        if (navigator.onLine) {
          console.log("Network is online");
        } else {
          console.log("Network is offline");
          alert("Network connection lost. Call quality may be affected.");
        }
      };

      window.addEventListener('online', checkConnection);
      window.addEventListener('offline', checkConnection);

      return () => {
        window.removeEventListener('online', checkConnection);
        window.removeEventListener('offline', checkConnection);
      };
    };

    const cleanupNetworkMonitor = monitorNetwork();

    // Cleanup function
    return () => {
      // Clean up all socket listeners
      socket.off('user-connected');
      socket.off('user-disconnected');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      
      // Stop all tracks and clean up peer connection
      if (localStream) {
        localStream.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopping local track: ${track.kind}`);
        });
      }
      
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        console.log("Peer connection closed");
      }
      
      // Clear any pending timers
      if (iceConnectionStateTimerRef.current) {
        clearTimeout(iceConnectionStateTimerRef.current);
      }
      
      // Leave the room
      socket.emit('leave-room', { roomId });
      console.log(`Left room: ${roomId}`);
      
      // Clean up network monitor
      cleanupNetworkMonitor();
    };
  }, [roomId, isInitiator, navigate, startMedia, createPeerConnection, createAndSendOffer, handleUserConnected, handleUserDisconnected, handleReceiveOffer, handleReceiveAnswer, handleReceiveIceCandidate]);

  // Update call duration timer
  useEffect(() => {
    let durationTimer;
    if (isCallConnected) {
      setCallStartTime(prev => prev || Date.now());
      durationTimer = setInterval(() => {
        // Force re-render for duration update
        setCallStartTime(prev => prev);
      }, 1000);
    }
    
    return () => {
      if (durationTimer) clearInterval(durationTimer);
    };
  }, [isCallConnected, setCallStartTime]);

  // Monitor video playback and health
  useEffect(() => {
    if (isCallConnected && remoteVideoRef.current && remoteVideoRef.current.srcObject) {
      console.log("Call connected, setting up video monitoring");
      
      // Check every second if the video is actually playing
      const videoCheckTimer = setInterval(() => {
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
          const videoTracks = remoteVideoRef.current.srcObject.getVideoTracks();
          
          if (videoTracks.length > 0) {
            const videoTrack = videoTracks[0];
            console.log(`Remote video track: enabled=${videoTrack.enabled}, readyState=${videoTrack.readyState}`);
            
            // If the track looks good but we still have a black screen, try forcing a redraw
            if (videoTrack.enabled && videoTrack.readyState === 'live') {
              const video = remoteVideoRef.current;
              
              if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.log("Video track appears live but dimensions are 0, trying to refresh");
                forceRefreshRemoteVideo();
              } else {
                // Video has dimensions, should be playing
                setIsRemoteVideoPlaying(true);
              }
            }
          }
        }
      }, 1000);
      
      return () => clearInterval(videoCheckTimer);
    }
  }, [isCallConnected, forceRefreshRemoteVideo, remoteVideoRef, setIsRemoteVideoPlaying]);

  return {
    ...state,
    ...mediaControls,
    forceRefreshRemoteVideo
  };
};

export default useVideoCall;