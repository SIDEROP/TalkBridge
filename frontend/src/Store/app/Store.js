import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "./slicess/SocketSlice";
import authReducer from "./slicess/authSlice";
import streamReducer from "./slicess/streamSlice";

const store = configureStore({
  reducer: {
    socket: socketReducer,
    auth:authReducer,
    stream: streamReducer,
  },
});

export default store;
