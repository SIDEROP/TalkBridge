import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCallId, setOutgoingCall } from "../Store/app/slicess/streamSlice";
import Profile from "./Profile";

const SideMenu = () => {
  let [step, setStep] = useState(1);
  const { allUsers } = useSelector((state) => state.auth);
  const { incomingCall, outgoingCall } = useSelector((state) => state.stream);
  const dispatch = useDispatch();

  const handleCallUser = (userId, userName) => {
    if (incomingCall?.show || outgoingCall?.action === "outgoing" || incomingCall.action === "answer") {
      return null;
    }
    dispatch(setCallId(userId));
    dispatch(
      setOutgoingCall({
        callerName: userName,
        userId: userId,
        show: true,
        action: "outgoing",
      })
    );
  };

  return (
    <div className="w-[400px] h-full w-fit flex items-center justify-center select-none z-[99] absolute">
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 h-fit py-[35px] pr-[10px] rounded-tr-[40px] rounded-br-[40px] flex items-center justify-center shadow-xl opacity-70 hover:opacity-100 transition-opacity duration-300">
        <menu className="flex flex-col p-[5px] gap-4">
          <i onClick={() => setStep(1)} className="cursor-pointer transform hover:scale-110 transition-all duration-300">
            <img
              className="w-[45px] h-[45px] rounded-full border-2 border-white shadow-lg hover:border-yellow-400"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb9EzKnJiLunrAsbZI4eW573FBGd9RGqz53A&s"
              alt="Camera"
            />
          </i>
          <i onClick={() => setStep(2)} className="cursor-pointer transform hover:scale-110 transition-all duration-300">
            <img
              className="w-[45px] h-[45px] rounded-full border-2 border-white shadow-lg hover:border-yellow-400"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjHZanAhh49NAqgmmVYH-YH4GDLRIVF90pdUCsX8-OnVXwsPRHCZ2-Q3LJjJ0Br6RALRQ&usqp=CAU"
              alt="Chat"
            />
          </i>
          <i onClick={() => setStep(3)} className="cursor-pointer transform hover:scale-110 transition-all duration-300">
            <img
              className="w-[45px] h-[45px] rounded-full border-2 border-white shadow-lg hover:border-yellow-400"
              src="https://static.thenounproject.com/png/1275974-200.png"
              alt="Profile"
            />
          </i>
        </menu>
      </div>

      {step === 1 && null}
      
      {step === 2 && (
        <div className="absolute left-0 -z-[1] w-[340px] h-full flex flex-col items-center gap-4 p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-tr-2xl rounded-br-2xl shadow-2xl overflow-x-auto scrollbar-hide">
          {!allUsers?.users?.length > 0 && (
            <h3 className="text-yellow-400 font-bold text-xl">No Friends Online</h3>
          )}
          {allUsers?.users && allUsers?.users?.length > 0 &&
            allUsers?.users?.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm p-4 w-full max-w-[400px] text-white rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-xl font-bold">
                    {user?.name[0]?.toUpperCase()}
                  </div>
                  <span className="text-lg font-semibold">{user?.name?.toUpperCase()}</span>
                </div>
                <button
                  className="px-6 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg transition-all duration-300 hover:bg-yellow-300 active:bg-yellow-500 hover:shadow-xl"
                  onClick={() => handleCallUser(user.id, user.name)}
                >
                  {outgoingCall?.action === "outgoing" || incomingCall.action === "answer" ? "Calling..." : "Call"}
                </button>
              </div>
            ))}
        </div>
      )}

      {step === 3 && (
        <div className="absolute left-0 -z-[1] w-[340px] h-full flex flex-col items-center gap-4 p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-tr-2xl rounded-br-2xl shadow-2xl overflow-x-auto scrollbar-hide">
          <Profile />
        </div>
      )}
      
      {step === 4 && (
        <div className="absolute left-0 -z-[1] w-[340px] h-full flex flex-col items-center gap-4 p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-tr-2xl rounded-br-2xl shadow-2xl overflow-x-auto scrollbar-hide">
          Hello
        </div>
      )}
    </div>
  );
};

export default SideMenu;