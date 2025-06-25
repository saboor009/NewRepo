// WebRTC configuration constants
export const getIceServers = () => ({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    // Free TURN server from Twilio (more reliable)
    {
      urls: 'turn:global.turn.twilio.com:3478?transport=udp',
      username: 'f4b4035eaa76f77e3ffae85f5089490bef8425cdc2e1fab9be0545666758e56a',
      credential: 'W1VFAcLBmCjhwpNk88DmEKCxiWs='
    }
  ],
  iceCandidatePoolSize: 10
});

// Media constraints for getUserMedia
export const getMediaConstraints = () => ({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
});