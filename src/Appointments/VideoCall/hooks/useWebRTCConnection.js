import { useCallback } from 'react';
import socket from '../../socket';
import { getIceServers } from '../utils/webrtcConfig';

const useWebRTCConnection = (state) => {
  const {
    roomId,
    isInitiator,
    peerConnectionRef,
    remoteVideoRef,
    remoteStreamRef,
    iceConnectionStateTimerRef,
    iceCandidateQueueRef,
    setConnectionState,
    setIsCallConnected,
    setIsRemoteVideoPlaying
  } = state;

  const iceServers = getIceServers();

  // Create peer connection
  const createPeerConnection = useCallback((stream) => {
    console.log("Creating peer connection");
    
    try {
      const pc = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = pc;
      
      // Add local stream tracks to the peer connection
      if (stream) {
        console.log("Adding local tracks to peer connection");
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
      } else {
        console.warn("No local stream available when creating peer connection");
      }
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Generated ICE candidate");
          socket.emit('ice-candidate', {
            roomId,
            candidate: event.candidate
          });
        }
      };
      
      // Handle ICE gathering state changes
      pc.onicegatheringstatechange = () => {
        console.log("ICE gathering state:", pc.iceGatheringState);
      };

      // Handle ICE connection state changes
      pc.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", pc.iceConnectionState);
        
        // Try to restart ICE if it fails
        if (pc.iceConnectionState === 'failed') {
          console.log("ICE connection failed, attempting to restart ICE");
          
          if (iceConnectionStateTimerRef.current) {
            clearTimeout(iceConnectionStateTimerRef.current);
          }
          
          iceConnectionStateTimerRef.current = setTimeout(() => {
            if (isInitiator && pc.connectionState !== 'closed') {
              createAndSendOffer({ iceRestart: true });
            }
          }, 1000);
        }
        
        // Handle disconnect/checking states with timeout recovery
        if (pc.iceConnectionState === 'disconnected') {
          console.log("ICE connection disconnected, waiting for recovery");
          
          if (iceConnectionStateTimerRef.current) {
            clearTimeout(iceConnectionStateTimerRef.current);
          }
          
          iceConnectionStateTimerRef.current = setTimeout(() => {
            if (pc.iceConnectionState === 'disconnected' && isInitiator) {
              console.log("Connection still disconnected after timeout, attempting ICE restart");
              createAndSendOffer({ iceRestart: true });
            }
          }, 5000); // 5 seconds timeout for recovery
        }
      };
      
      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        setConnectionState(pc.connectionState);
        
        if (pc.connectionState === 'connected') {
          setIsCallConnected(true);
          console.log("Peer connection established successfully!");
        } else if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
          setIsCallConnected(false);
          setIsRemoteVideoPlaying(false);
          console.log("Peer connection is no longer active");
        }
      };
      
      // Enhanced track handling
      pc.ontrack = (event) => {
        console.log("Received remote track");
        
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          console.log("Setting remote video stream");
          
          // Store reference to remote stream for future refreshes
          remoteStreamRef.current = event.streams[0];
          
          // Log stream tracks for debugging
          const videoTracks = event.streams[0].getVideoTracks();
          const audioTracks = event.streams[0].getAudioTracks();
          console.log(`Remote stream has ${videoTracks.length} video tracks and ${audioTracks.length} audio tracks`);
          
          // Add track event listeners
          if (videoTracks.length > 0) {
            const videoTrack = videoTracks[0];
            console.log(`Video track: ${videoTrack.label}, enabled=${videoTrack.enabled}`);
            
            videoTrack.onended = () => console.log("Remote video track ended");
            videoTrack.onmute = () => console.log("Remote video track muted");
            videoTrack.onunmute = () => console.log("Remote video track unmuted");
          }
          
          // Force a re-render of the video element
          remoteVideoRef.current.srcObject = null;
          
          // Small delay before attaching stream
          setTimeout(() => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = event.streams[0];
              
              // Attempt to play the video and handle any autoplay policy issues
              remoteVideoRef.current.play()
                .then(() => {
                  console.log("Remote video started playing automatically");
                  setIsRemoteVideoPlaying(true);
                })
                .catch(err => {
                  console.warn("Autoplay was prevented:", err);
                  alert("Click OK to enable video playback");
                  
                  // Try again after user interaction
                  remoteVideoRef.current.play()
                    .then(() => {
                      console.log("Remote video started after user interaction");
                      setIsRemoteVideoPlaying(true);
                    })
                    .catch(e => console.error("Failed to play video after interaction:", e));
                });
            }
          }, 200);
        } else {
          console.warn("Could not set remote video stream", {
            videoRef: !!remoteVideoRef.current,
            hasStreams: !!event.streams,
            hasFirstStream: event.streams && event.streams.length > 0
          });
        }
      };
      
      console.log("Peer connection created");
      
      // Process any queued ICE candidates
      if (iceCandidateQueueRef.current.length > 0) {
        console.log(`Processing ${iceCandidateQueueRef.current.length} queued ICE candidates`);
        
        iceCandidateQueueRef.current.forEach(async (candidate) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
            console.log("Added queued ICE candidate");
          } catch (e) {
            console.error("Failed to add queued ICE candidate:", e);
          }
        });
        
        iceCandidateQueueRef.current = [];
      }
    } catch (err) {
      console.error("Failed to create peer connection:", err);
      alert("Failed to setup call connection. Please check your network and try again.");
    }
  }, [iceServers, roomId, isInitiator, peerConnectionRef, remoteVideoRef, remoteStreamRef, iceConnectionStateTimerRef, iceCandidateQueueRef, setConnectionState, setIsCallConnected, setIsRemoteVideoPlaying]);

  // Create and send offer
  const createAndSendOffer = useCallback(async (options = {}) => {
    if (!peerConnectionRef.current) {
      console.error("Tried to create offer but peer connection doesn't exist");
      return;
    }
    
    try {
      console.log("Creating offer", options);
      const offerOptions = {
        offerToReceiveAudio: true, 
        offerToReceiveVideo: true,
        ...options // Allow passing iceRestart:true
      };
      
      const offer = await peerConnectionRef.current.createOffer(offerOptions);
      
      console.log("Setting local description (offer)");
      await peerConnectionRef.current.setLocalDescription(offer);
      
      console.log("Sending offer to peer");
      socket.emit('offer', {
        roomId,
        offer
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, [roomId, peerConnectionRef]);

  return {
    createPeerConnection,
    createAndSendOffer
  };
};

export default useWebRTCConnection;