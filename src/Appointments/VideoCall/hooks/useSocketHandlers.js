import { useCallback } from 'react';
import socket from '../../socket';

const useSocketHandlers = (state, webrtcActions) => {
  const {
    roomId,
    isInitiator,
    peerConnectionRef,
    remoteVideoRef,
    remoteStreamRef,
    iceCandidateQueueRef,
    setIsCallConnected,
    setIsRemoteVideoPlaying
  } = state;

  const { createAndSendOffer } = webrtcActions;

  // Handle user connected
  const handleUserConnected = useCallback(() => {
    console.log('User connected to room');
    if (isInitiator && peerConnectionRef.current) {
      setTimeout(() => {
        createAndSendOffer();
      }, 1000); // Small delay to ensure connection is ready
    }
  }, [isInitiator, peerConnectionRef, createAndSendOffer]);

  // Handle user disconnected
  const handleUserDisconnected = useCallback(() => {
    console.log('User disconnected from room');
    setIsCallConnected(false);
    setIsRemoteVideoPlaying(false);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    remoteStreamRef.current = null;
    
    // Show notification to user
    alert("Remote user has disconnected from the call");
  }, [setIsCallConnected, setIsRemoteVideoPlaying, remoteVideoRef, remoteStreamRef]);

  // Handle receive offer
  const handleReceiveOffer = useCallback(async ({ offer }) => {
    if (!peerConnectionRef.current) {
      console.error("Received offer but peer connection doesn't exist");
      return;
    }
    
    try {
      console.log("Received offer from peer");
      console.log("Setting remote description (offer)");
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      
      console.log("Creating answer");
      const answer = await peerConnectionRef.current.createAnswer();
      
      console.log("Setting local description (answer)");
      await peerConnectionRef.current.setLocalDescription(answer);
      
      console.log("Sending answer to peer");
      socket.emit('answer', {
        roomId,
        answer
      });
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [roomId, peerConnectionRef]);

  // Handle receive answer
  const handleReceiveAnswer = useCallback(async ({ answer }) => {
    if (!peerConnectionRef.current) {
      console.error("Received answer but peer connection doesn't exist");
      return;
    }
    
    try {
      console.log("Received answer from peer");
      console.log("Setting remote description (answer)");
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      
      // Try again after a delay (can help with timing issues)
      setTimeout(async () => {
        try {
          if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            console.log("Successfully set remote description after retry");
          }
        } catch (retryError) {
          console.error("Retry failed:", retryError);
        }
      }, 1000);
    }
  }, [peerConnectionRef]);

  // Handle receive ICE candidate
  const handleReceiveIceCandidate = useCallback(async ({ candidate }) => {
    if (!peerConnectionRef.current) {
      console.error("Received ICE candidate but peer connection doesn't exist");
      // Queue the candidate for when peer connection is created
      iceCandidateQueueRef.current.push(candidate);
      console.log("Queued ICE candidate for later processing");
      return;
    }
    
    try {
      console.log("Received ICE candidate");
      await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      // Handle timing issues with ICE candidates
      if (error.name === 'InvalidStateError') {
        console.warn("Got ICE candidate before remote description, will retry");
        
        // Queue candidate for later
        iceCandidateQueueRef.current.push(candidate);
        
        setTimeout(async () => {
          try {
            if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
              // Process all queued candidates
              while (iceCandidateQueueRef.current.length > 0) {
                const queuedCandidate = iceCandidateQueueRef.current.shift();
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(queuedCandidate));
                console.log("Added queued ICE candidate");
              }
            }
          } catch (e) {
            console.error("Failed to process queued ICE candidates:", e);
          }
        }, 1000);
      } else {
        console.error('Error adding ICE candidate:', error);
      }
    }
  }, [peerConnectionRef, iceCandidateQueueRef]);

  return {
    handleUserConnected,
    handleUserDisconnected,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleReceiveIceCandidate
  };
};

export default useSocketHandlers;