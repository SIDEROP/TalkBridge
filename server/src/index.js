import { Server } from "socket.io";
import app from "./app.js";
import { createServer } from "http";
import RtcConnection from "./socket/RtcConnection.js";
import { dbConnect } from "./db/DbConnect.js";

let server = createServer(app);
let io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 4000;

// Start the server
const startServer = async () => {
  try {
    await dbConnect();

    server
      .listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      })
      .on("error", (err) => {
        console.error(`Server encountered an error: ${err.message}`);
      });
  } catch (error) {
    console.error(`Error starting the server: ${error.message}`);
    process.exit(1);
  }
};
startServer();

// Socket connnection
io.on("connection", (socket) => {
  RtcConnection(socket, io);
});
