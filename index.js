const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOW_ORIGIN || "*", // your frontend domain
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Broadcast new lead
app.post("/broadcast-lead", (req, res) => {
  const lead = req.body;
  io.emit("new-lead", lead);
  res.json({ status: "Lead broadcasted" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
