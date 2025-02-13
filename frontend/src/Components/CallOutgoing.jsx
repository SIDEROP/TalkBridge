import React, { useEffect, useRef } from "react";
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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl w-[95%] sm:w-[90%] max-w-lg p-8 z-50 animate-fadeIn border border-gray-200">
      <div className="flex flex-col items-center text-center w-full">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center mb-6 animate-pulse">
          <span className="text-3xl sm:text-4xl font-bold text-white">
            {calleeName[0]?.toUpperCase()}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent mb-8">
          Calling {calleeName}...
        </h3>

        <button
          onClick={() => {
            onCallEnd();
            if (audioRef.current) audioRef.current.pause();
          }}
          className="px-10 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-red-200/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-w-[140px] flex items-center justify-center gap-2 transform active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          End Call
        </button>
      </div>
    </div>
  );
};

export default CallOutgoing;
