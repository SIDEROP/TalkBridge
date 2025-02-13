import React, { useEffect, useRef } from "react";
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
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl w-[95%] sm:w-[90%] max-w-lg p-8 z-50 animate-fadeIn border border-gray-200">
      <div className="flex flex-col items-center text-center w-full">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mb-6 animate-pulse">
          <span className="text-3xl sm:text-4xl font-bold text-white">
            {callerName[0]?.toUpperCase()}
          </span>
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          {callerName} is calling...
        </h3>

        <div className="flex gap-6 w-full justify-center items-center flex-wrap mt-4">
          <button
            onClick={() => {
              onAnswer();
              if (audioRef.current) audioRef.current.pause();
            }}
            className="px-10 py-4 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-full shadow-lg hover:shadow-green-200/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-w-[140px] flex items-center justify-center gap-2 transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Answer
          </button>
          
          <button
            onClick={() => {
              onDecline();
              if (audioRef.current) audioRef.current.pause();
            }}
            className="px-10 py-4 bg-gradient-to-r from-red-400 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-red-200/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 min-w-[140px] flex items-center justify-center gap-2 transform active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rotate-135" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallIncoming;
