import User from "../models/User.js";

let userListStatus = {};

const RtcConnection = (socket, io) => {

  // Helper function to update user status in the database
  const updateUserStatus = async (userId, status, socketId = null) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        user.status = status;
        user.socketId = socketId;
        await user.save();
      }
    } catch (error) {
      console.error(`Error updating user ${userId} status:`, error);
    }
  };

  // Handle user connection
  socket.on("connect_user", async (userData) => {
    try {
      if (userListStatus[userData.userId]) {
        return;
      }
      userListStatus[userData.userId] = {
        socketId: socket.id,
        name: userData.name,
        isConnected: true,
      };

      await updateUserStatus(userData.userId, "online", socket.id);
      io.emit("userListData", userListStatus);
    } catch (error) {
      console.error("Error handling user connection:", error);
    }
  });

  socket.on("send_userlist", () => {
    io.emit("userlist_broadcast", userListStatus);
  });

  socket.on("send_offer", ({ offer, targetUserId,senderId,userName }) => {
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("offer", {offer,senderId,userName});
    }
  });

  socket.on("send_answer", ({ answer, targetUserId }) => {
    
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("answer", answer);
    }
  });

  socket.on("new_ice_candidate", ({ candidate, targetUserId }) => {
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("new_ice_candidate", candidate);
    }
  });


  // Handle declining a call
  socket.on("call_declined", ({ targetUserId }) => {
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("call_declined", {
        message: "The user declined your call.",
      });
    }
  });

  // Handle ending a call
  socket.on("end_call", ({ targetUserId }) => {
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("call_ended", {
        message: "The user has ended the call.",
      });
    }
  });

  socket.on("isMuted", ({ isMuted,targetUserId }) => {
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("isMuted", {
        isMuted
      });
    }
  });

  socket.on("isVideoStopped", ({ isVideoStopped,targetUserId }) => {
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("isVideoStopped", {
        isVideoStopped
      });
    }
  });

  socket.on("isMutedOut", ({ isMuted,targetUserId }) => {
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("isMutedOut", {
        isMuted
      });
    }
  });

  socket.on("isVideoStoppedOut", ({ isVideoStopped,targetUserId }) => {
    const targetUser = userListStatus[targetUserId];
    if (targetUser) {
      io.to(targetUser.socketId).emit("isVideoStoppedOut", {
        isVideoStopped
      });
    }
  });

  // Handle user disconnection
  socket.on("disconnect", async () => {
    try {
      const userId = Object.keys(userListStatus).find(
        (id) => userListStatus[id].socketId === socket.id
      );

      if (userId) {
        const user = userListStatus[userId];
        await updateUserStatus(userId, "offline");
        delete userListStatus[userId];

        io.emit("user_status", userListStatus);
      }
    } catch (error) {
      console.error("Error handling user disconnection:", error);
    }
  });
};

export default RtcConnection;
