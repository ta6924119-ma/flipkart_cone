const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ SAME event name as frontend
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // ✅ SAME event name as frontend
  socket.on("send-message", (data) => {
    io.to(data.roomId).emit("received-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
