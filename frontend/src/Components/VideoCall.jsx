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
import "./css/VideoCall.css";
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
    dispatch(startTimer()); // Start timer
    const answer = await peerConnect.createAnswer();
    await peerConnect.setLocalDescription(answer);
    socket.emit("send_answer", { answer, targetUserId: incomingCall?.userId });

  };

  // Handle declining a call
  const handleDecline = () => {
    dispatch(stopTimer()); // Stop timer
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

  // Attach the local stream to the local video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach the remote stream to the remote video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="VideoCall">
      {/* Outgoing Call Popup */}
      {outgoingCall?.show && (
        <CallOutgoing
          calleeName={outgoingCall?.callerName}
          onCallEnd={handleCallEnd}
        />
      )}

      {/* Incoming Call Popup */}
      {incomingCall?.show && (
        <CallIncoming
          callerName={incomingCall?.callerName}
          onAnswer={handleAnswer}
          onDecline={handleDecline}
        />
      )}

      <div className="remote-video">
        <video ref={remoteVideoRef} autoPlay muted />
        {incomingCall?.action && (
          <div className="call-end-message" >
            <h4>
              {incomingCall.action === "decline"
                ? "Call Decline.."
                : incomingCall.action === "puse"
                ? "Call Paused.."
                : incomingCall.action === "mute"
                ? "Call Muted.."
                : ""}
            </h4>
          </div>
        )}
        {outgoingCall?.action && (
          <div className="call-end-message">
            <h4>
              {outgoingCall.action === "callend"
                ? "Call Ended.."
                : outgoingCall.action === "puse"
                ? "Call Paused.."
                : outgoingCall.action === "mute"
                ? "Call Muted.."
                : ""}
            </h4>
          </div>
        )}
      </div>

      <div className="local-video">
        <video ref={localVideoRef} autoPlay muted />
        {(isMuted || isVideoStopped) && (
          <div className="call-end-message">
            <h4>
              {isMuted && isVideoStopped ? (
                "stope video"
              ) : (
                <>
                  {isMuted && "Call Muted.. "}
                  {isVideoStopped && "Call Paused.."}
                </>
              )}
            </h4>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="controls">
        {outgoingCall?.show ? null : outgoingCall?.action === "outgoing" ||
          incomingCall?.action === "answer" ? (
          <>
            {/* Timer */}
            <div className="call-timer" style={{ color: "green" }}>
              {Math.floor(callDuration / 60)}:
              {String(callDuration % 60).padStart(2, "0")}
            </div>
          </>
        ) : null}

        {/* outgoingCall btn */}
        {outgoingCall?.show ? null : outgoingCall?.action === "outgoing" ? (
          <i onClick={() => handleCallEnd()}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLZ_cZ6cdJ5D3Eq1euwXiqPpYLdLBzuPvw_g&s" />
          </i>
        ) : null}

        {/* outgoingCall btn */}
        {incomingCall?.show ? null : incomingCall?.action === "answer" ? (
          <i onClick={() => handleDecline()}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLZ_cZ6cdJ5D3Eq1euwXiqPpYLdLBzuPvw_g&s" />
          </i>
        ) : null}

        <i
          onClick={() => {
            dispatch(toggleMute());
            socket.emit("isMuted", { isMuted, targetUserId: isCallId });
            socket.emit("isMutedOut", { isMuted, targetUserId: incomingCall?.userId });
          }}
        >
          {isMuted ? (
            <img
              src="https://w7.pngwing.com/pngs/627/94/png-transparent-microphone-icon-symbol-sign-design-mic-music-muted-muffled-sound-thumbnail.png"
              alt="Mute"
            />
          ) : (
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_BZcUpDC4QhQsv42rnLddItuaJM1hJuhADQ&s"
              alt="Unmute"
            />
          )}
        </i>
        <i
          onClick={() => {
            socket.emit("isVideoStopped", {
              isVideoStopped,
              targetUserId: isCallId,
            });
            socket.emit("isVideoStoppedOut", { isMuted, targetUserId: incomingCall?.userId });

            dispatch(toggleVideo());
          }}
        >
          {isVideoStopped ? (
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKx5dOaGnOCUQxYXozyhrgEjAWyEoreM9hUaZyMLm3jIniwGIdVUxygg7I4ev_MouI40g&usqp=CAU"
              alt="Start Video"
            />
          ) : (
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190523.png"
              alt="Stop Video"
            />
          )}
        </i>
      </div>
    </div>
  );
};

export default VideoCall;
