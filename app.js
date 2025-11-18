import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/app.html");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("userName", (name) => {
    socket.userName = name;
    console.log(`Set UserName: ${name}`);
  });

  socket.on("chat message", (msg) => {
    const name = socket.userName || "Anonymous";
    const fullMessage = `${name}: ${msg}`;
    io.emit("chat message", fullMessage);
  });

  socket.on("file upload", (data) => {
    const name = socket.userName || "Anonymous";
    io.emit("file upload", {
      fileName: data.fileName,
      fileData: data.fileData,
      sender: name,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
