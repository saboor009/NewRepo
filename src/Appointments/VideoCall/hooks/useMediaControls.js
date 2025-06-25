import { useCallback, useEffect } from 'react';
import { getMediaConstraints } from '../utils/webrtcConfig';

const useMediaControls = (state) => {
  const {
    localStream,
    setLocalStream,
    isMuted,
    setIsMuted,
    isVideoOff,
    setIsVideoOff,
    localVideoRef,
    navigate
  } = state;

  const mediaConstraints = getMediaConstraints();

  // Start media capture
  const startMedia = useCallback(async () => {
    try {
      console.log("Requesting camera and microphone access");
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      
      setLocalStream(stream);
      console.log("Local stream obtained successfully");
      
      if (localVideoRef.current) {
        console.log("Setting local video stream to video element");
        localVideoRef.current.srcObject = stream;
      } else {
        console.warn("Local video element not ready yet");
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Could not access camera or microphone. Please check permissions.');
      return null;
    }
  }, [mediaConstraints, setLocalStream, localVideoRef]);

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      const newMuteState = !isMuted;
      
      audioTracks.forEach(track => {
        track.enabled = !newMuteState;
        console.log(`Audio ${newMuteState ? 'muted' : 'unmuted'}`);
      });
      
      setIsMuted(newMuteState);
    }
  }, [isMuted, localStream, setIsMuted]);

  // Toggle video on/off
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      const newVideoState = !isVideoOff;
      
      videoTracks.forEach(track => {
        track.enabled = !newVideoState;
        console.log(`Video ${newVideoState ? 'turned off' : 'turned on'}`);
      });
      
      setIsVideoOff(newVideoState);
    }
  }, [isVideoOff, localStream, setIsVideoOff]);

  // End call and navigate back
  const endCall = useCallback(() => {
    // Explicitly clean up before navigation
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (state.peerConnectionRef.current) {
      state.peerConnectionRef.current.close();
      state.peerConnectionRef.current = null;
    }
    
    // Navigate back to appointments
    navigate('/appointments');
  }, [navigate, localStream, state.peerConnectionRef]);

  return {
    startMedia,
    toggleMute,
    toggleVideo,
    endCall
  };
};

export default useMediaControls;