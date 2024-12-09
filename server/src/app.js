import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

let app = express();

app
  .use(express.json({ limit: "30kb" }))
  .use(express.urlencoded({ limit: "20kb", extended: true }))
  .use(
    cors({
      origin: `http://localhost:5173`,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: [
        "Authenticate",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin",
        "Access-Control-Allow-Headers",
      ],
    })
  )
  .options("*", cors())
  .use(cookieParser())
  .use(express.static('dist'));

// import routes
import authRoutes from "./routes/auth.routes.js";

// use routes
app.use("/api/v1", authRoutes);

export default app;
