import React, { useEffect, useRef } from "react";
import "./css/CallOutgoing.css";
import callingSound from "../assets/outgoingCall.mp3";

const CallOutgoing = ({ calleeName, onCallEnd }) => {
  const audioRef = useRef(null);

  useEffect(() => {

    audioRef.current = new Audio(callingSound);
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
    <div className="outgoing-call-box">
      <div className="outgoing-call-content">
        <h3>Calling {calleeName}...</h3>
        <button
          className="call-cut-btn"
          onClick={() => {
            onCallEnd();
            if (audioRef.current) audioRef.current.pause(); // Stop sound on call end
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3917/3917232.png"
            alt="End Call"
          />
        </button>
      </div>
    </div>
  );
};

export default CallOutgoing;
