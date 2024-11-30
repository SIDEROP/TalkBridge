import mongoose from "mongoose";

const CallSessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true, required: true },
  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  status: {
    type: String,
    enum: ["active", "ended", "missed"],
    default: "active",
  },
});

const CallSession = mongoose.model("CallSession", CallSessionSchema);
export default CallSession;
