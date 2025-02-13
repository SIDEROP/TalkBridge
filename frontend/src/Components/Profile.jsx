import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { userData } = useSelector((state) => state.auth?.auth);
  return (
    <div className="relative h-full w-full bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="w-full h-fit bg-[#2c2c2c] flex flex-col items-center p-4 md:p-6 shadow-lg gap-4">
        <div className="w-full max-w-md h-full text-white p-4 md:p-6 rounded-lg text-center mb-4 md:mb-6 shadow-md bg-gray-800/50 backdrop-blur">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-3xl md:text-4xl flex items-center justify-center mx-auto mb-4 md:mb-5 shadow-xl transform hover:scale-110 transition-transform duration-300">
            {userData?.name[0]}
          </div>
          <h2 className="text-xl md:text-2xl font-bold my-3 md:my-4">{userData?.name}</h2>
          <p className="text-base md:text-lg py-2 md:py-2.5 px-4 md:px-5 mt-2 md:mt-3 rounded-full inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:from-green-600 hover:to-emerald-600 transition-all duration-300">
            {userData?.status || "online"}
          </p>
          <p className="mt-4 text-base md:text-lg space-x-2">
            <strong>Email:</strong> <span className="text-gray-300">{userData?.email}</span>
          </p>
          <hr className="my-4 md:my-5 border-gray-600" />
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
        <button className="w-full text-base md:text-lg bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm12.293 4.293a1 1 0 0 1-1.414 1.414L12 6.414V13a1 1 0 1 1-2 0V6.414L8.121 8.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
