import React, { useEffect, useRef } from "react";
import "./css/CallIncoming.css";
import notificationSound from "../assets/notif.wav";

const CallIncoming = ({ callerName, onAnswer, onDecline }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(notificationSound);
    audioRef.current.loop = true; 
    audioRef.current.play();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className={`call-incoming-box show`}>
      <div className="call-incoming-content">
        <h3>{callerName} is calling...</h3>
        <div className="call-buttons">
          <button
            onClick={() => {
              onAnswer();
              if (audioRef.current) audioRef.current.pause();
            }}
            className="answer-btn"
          >
            Answer
          </button>
          <button
            onClick={() => {
              onDecline();
              if (audioRef.current) audioRef.current.pause();
            }}
            className="decline-btn"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallIncoming;
