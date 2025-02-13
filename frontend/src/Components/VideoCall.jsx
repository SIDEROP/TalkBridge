import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleMute,
  toggleVideo,
  setIncoming,
  setOutgoingCall,
  setCallId,
  startTimer,
  stopTimer,
  incrementTimer,
} from "../Store/app/slicess/streamSlice";
import CallIncoming from "./CallIncoming";
import CallOutgoing from "./CallOutgoing";

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);

  const {
    peerConnect,
    localStream,
    remoteStream,
    isCallId,
    isMuted,
    isVideoStopped,
    incomingCall,
    outgoingCall,
    callDuration,
    isCallTimerRunning,
  } = useSelector((state) => state.stream);

  // Timer effect for incrementing call duration
  useEffect(() => {
    if (isCallTimerRunning) {
      const intervalId = setInterval(() => {
        dispatch(incrementTimer());
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isCallTimerRunning, dispatch]);

  // Handle answering a call
  const handleAnswer = async () => {
    dispatch(
      setIncoming({
        callerName: incomingCall?.callerName,
        userId: incomingCall?.userId,
        show: false,
        action: "answer",
      })
    );

    dispatch(
      setOutgoingCall({
        callerName: null,
        userId: null,
        show: false,
        action: "normal",
      })
    );
    dispatch(startTimer());
    const answer = await peerConnect.createAnswer();
    await peerConnect.setLocalDescription(answer);
    socket.emit("send_answer", { answer, targetUserId: incomingCall?.userId });
  };

  // Handle declining a call
  const handleDecline = () => {
    dispatch(stopTimer());
    dispatch(
      setIncoming({
        callerName: null,
        userId: null,
        show: false,
        action: "decline",
      })
    );
    dispatch(
      setOutgoingCall({
        callerName: null,
        userId: null,
        show: false,
        action: "normal",
      })
    );
    socket.emit("call_declined", { targetUserId: incomingCall?.userId });
  };

  // Handle ending a call
  const handleCallEnd = () => {
    dispatch(stopTimer());
    dispatch(setCallId(null));
    dispatch(
      setOutgoingCall({
        callerName: null,
        userId: null,
        show: false,
        action: "callend",
      })
    );
    dispatch(
      setIncoming({
        callerName: null,
        userId: null,
        show: false,
        action: "normal",
      })
    );
    socket.emit("end_call", { targetUserId: outgoingCall?.userId });
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {outgoingCall?.show && (
        <CallOutgoing
          calleeName={outgoingCall?.callerName}
          onCallEnd={handleCallEnd}
        />
      )}

      {incomingCall?.show && (
        <CallIncoming
          callerName={incomingCall?.callerName}
          onAnswer={handleAnswer}
          onDecline={handleDecline}
        />
      )}

      {/* Remote Video */}
      <div className="w-full relative">
        <video ref={remoteVideoRef} autoPlay muted className="w-full h-full object-cover" />
        
        {incomingCall?.action && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <h4 className="text-white text-2xl font-semibold">
              {incomingCall.action === "decline"
                ? "Call Declined"
                : incomingCall.action === "puse"
                ? "Call Paused"
                : incomingCall.action === "mute"
                ? "Call Muted"
                : ""}
            </h4>
          </div>
        )}
        
        {outgoingCall?.action && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <h4 className="text-white text-2xl font-semibold">
              {outgoingCall.action === "callend"
                ? "Call Ended"
                : outgoingCall.action === "puse"
                ? "Call Paused"
                : outgoingCall.action === "mute"
                ? "Call Muted"
                : ""}
            </h4>
          </div>
        )}
      </div>

      {/* Local Video */}
      <div className="absolute top-4 right-4 w-32 h-48 sm:w-48 sm:h-64 rounded-2xl overflow-hidden shadow-lg">
        <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover" />
        {(isMuted || isVideoStopped) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <h4 className="text-white text-sm sm:text-base font-medium text-center px-2">
              {isMuted && isVideoStopped
                ? "Video Stopped"
                : <>
                    {isMuted && "Muted"}
                    {isVideoStopped && "Video Paused"}
                  </>
              }
            </h4>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 bg-black/30 backdrop-blur-md px-6 py-4 rounded-full">
        {outgoingCall?.show ? null : outgoingCall?.action === "outgoing" ||
          incomingCall?.action === "answer" ? (
          <div className="text-green-400 font-semibold">
            {Math.floor(callDuration / 60)}:{String(callDuration % 60).padStart(2, "0")}
          </div>
        ) : null}

        {outgoingCall?.show ? null : outgoingCall?.action === "outgoing" && (
          <button onClick={handleCallEnd} className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {incomingCall?.show ? null : incomingCall?.action === "answer" && (
          <button onClick={handleDecline} className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          onClick={() => {
            dispatch(toggleMute());
            socket.emit("isMuted", { isMuted, targetUserId: isCallId });
            socket.emit("isMutedOut", { isMuted, targetUserId: incomingCall?.userId });
          }}
          className={`p-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-600'} hover:opacity-90 transition-opacity`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button
          onClick={() => {
            socket.emit("isVideoStopped", { isVideoStopped, targetUserId: isCallId });
            socket.emit("isVideoStoppedOut", { isMuted, targetUserId: incomingCall?.userId });
            dispatch(toggleVideo());
          }}
          className={`p-3 rounded-full ${isVideoStopped ? 'bg-red-500' : 'bg-gray-600'} hover:opacity-90 transition-opacity`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
