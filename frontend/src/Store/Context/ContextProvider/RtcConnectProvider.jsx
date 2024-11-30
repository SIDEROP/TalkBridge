import { useState, useEffect } from "react";
import { contextStore } from "../ContextStore";
import { io } from "socket.io-client";

const RtcConnectProvider = ({ children }) => {
  // States to manage socket and connection status
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  // Function to initialize the socket connection
  const initializeSocket = () => {
    const userId = "1232weiu421"; // Example userId (can be dynamically set)

    // Initialize Socket.IO client with userId in query
    const newSocket = io("http://localhost:4000", {
      query: { userId }, // Use query to pass userId
    });

    // Set the socket instance in state
    setSocket(newSocket);

    // Handle connection events
    newSocket.on("connect", () => {
      setConnected(true);
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason) => {
      setConnected(false);
      console.log("Socket disconnected:", reason);
    });

    // Optional: Handle connection errors
    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    return newSocket;
  };

  // Effect to initialize and clean up the socket connection
  useEffect(() => {
    const socketInstance = initializeSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log("Socket instance cleaned up");
      }
    };
  }, []);

  // Provide socket-related values and functions
  const values = {
    socket,
    connected,
  };

  // Return the context provider with the defined values
  return <contextStore.Provider value={values}>{children}</contextStore.Provider>;
};

export default RtcConnectProvider;
