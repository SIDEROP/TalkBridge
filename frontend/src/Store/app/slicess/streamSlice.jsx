import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  peerConnect:null,
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isVideoStopped: false,
  isCallId: null,
  incomingCall: {
    callerName: null,
    userId: null,
    show: false,
    action: "normal"
  },
  outgoingCall: {
    callerName: null,
    userId: null,
    show: false,
    action: "normal"
  },
  callDuration: 0,
  isCallTimerRunning: false, 
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setPeerConnect:(state, action) => {
      state.peerConnect = action.payload;
    },
    setLocalStream: (state, action) => {
      state.localStream = action.payload;
    },
    setRemoteStream: (state, action) => {
      state.remoteStream = action.payload;
    },
    setCallId: (state, action) => {
      state.isCallId = action.payload;
    },
    toggleMute: (state) => {
      if (state.localStream) {
        state.localStream.getAudioTracks().forEach((track) => {
          track.enabled = !state.isMuted;
        });
        state.isMuted = !state.isMuted;
      }
    },
    setOutgoingCall: (state, action) => {
      state.outgoingCall = action.payload;
    },
    setIncoming: (state, action) => {
      state.incomingCall = action.payload;
    },
    toggleVideo: (state) => {
      if (state.localStream) {
        state.localStream.getVideoTracks().forEach((track) => {
          track.enabled = !state.isVideoStopped;
        });
        state.isVideoStopped = !state.isVideoStopped;
      }
    },
    startTimer: (state) => {
      state.isCallTimerRunning = true;
      state.callDuration = 0; // Reset call duration when starting
    },
    incrementTimer: (state) => {
      if (state.isCallTimerRunning) {
        state.callDuration += 1; // Increment the call duration by 1 second
      }
    },
    stopTimer: (state) => {
      state.isCallTimerRunning = false;
    },
    mute: (state,action) => {
      state.isMuted = action.payload;
    },
    videoPuse: (state,action) => {
      state.isVideoStopped = action.payload;
    },
  },
});

export const {
  setLocalStream,
  setRemoteStream,
  toggleMute,
  toggleVideo,
  setCallId,
  setIncoming,
  setOutgoingCall,
  setPeerConnect,
  stopTimer,
  incrementTimer,
  startTimer,
  videoPuse,
  mute
} = streamSlice.actions;

export default streamSlice.reducer;
