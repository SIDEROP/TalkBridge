import React, { useState } from "react";
import "./css/SideMenu.css";
import { useSelector, useDispatch } from "react-redux";
import { setCallId, setOutgoingCall } from "../Store/app/slicess/streamSlice";
import Profile from "./Profile";

const SideMenu = () => {
  let [step, setStep] = useState(1);
  const { allUsers } = useSelector((state) => state.auth);
  const { incomingCall, outgoingCall } = useSelector((state) => state.stream);
  const dispatch = useDispatch();

  // Function to handle initiating a call
  const handleCallUser = (userId, userName) => {
    if (incomingCall?.show) {
      return null;
    }
    if (outgoingCall?.action == "outgoing") {
      return null;
    }
    if (incomingCall.action == "answer") {
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
    <div id="SideMenuBox">
      <div className="menMenu">
        <menu>
          <i onClick={() => setStep(1)}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb9EzKnJiLunrAsbZI4eW573FBGd9RGqz53A&s"
              alt="Step 1"
            />
          </i>
          <i onClick={() => setStep(2)}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjHZanAhh49NAqgmmVYH-YH4GDLRIVF90pdUCsX8-OnVXwsPRHCZ2-Q3LJjJ0Br6RALRQ&usqp=CAU"
              alt="Step 2"
            />
          </i>
          <i onClick={() => setStep(3)}>
            <img
              src="https://static.thenounproject.com/png/1275974-200.png"
              alt="Step 3"
            />
          </i>
          {/* <i onClick={() => setStep(4)}>
            <img
              src="https://thumbs.dreamstime.com/b/people-circle-group-users-flat-icon-round-colorful-button-circular-vector-sign-long-shadow-effect-style-design-94223223.jpg"
              alt="Step 4"
            />
          </i> */}
        </menu>
      </div>
      {step === 1 && null}
      {step === 2 && (
        <div className="useMenu">
          {!allUsers?.users?.length > 0 && (
            <h3 style={{ color: "white" }}>no user online</h3>
          )}
          {allUsers?.users &&
            allUsers?.users.map((user) => (
              <div key={user.id} className="user-item">
                <div className="nameUsers">{user?.name?.toUpperCase()}</div>
                <button
                  className="call-button"
                  onClick={() => handleCallUser(user.id, user.name)}
                >
                  {outgoingCall?.action === "outgoing"
                    ? "calling"
                    : incomingCall.action === "answer"
                    ? "calling"
                    : "call"}
                </button>
              </div>
            ))}
        </div>
      )}

      {step === 3 && (
        <div className="useMenu">
          <Profile />
        </div>
      )}
      {step === 4 && <div className="useMenu">Hello</div>}
    </div>
  );
};

export default SideMenu;
