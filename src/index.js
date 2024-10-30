import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// ESモジュールの形式で__dirnameを設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 静的ファイルのサービング
app.use(express.static(path.join(__dirname, "public")));

// サーバーの作成
const server = http.createServer(app);
const PORT = 8080;

server.listen(PORT, () => {
  console.log(`server start!!: ${PORT}`);
});

// Socket.IOの設定
const io = new Server(server);

io.on("connection", (socket) => {
  socket.emit("mylogin", socket.id.substring(0, 6));
  io.emit("login", socket.id.substring(0, 6));

  socket.on("disconnect", () => {
    io.emit("logout", socket.id.substring(0, 6));
  });

  socket.on("post", (data) => {
    const regexp = /角野卓造/;
    io.emit("post", { id: socket.id.substring(0, 6), post: data });
    if (regexp.test(data)) {
      data = "角野卓造じゃねーよ";
      io.emit("post", { id: "Computer", post: data });
    }
  });

  socket.on("stamp", (data) => {
    io.emit("stamp", { id: socket.id.substring(0, 6), stamp: data });
  });

  socket.on("icon", (data) => {
    io.emit("icon", { id: socket.id.substring(0, 6), icon: data });
  });

  socket.on("img", (data) => {
    io.emit("img", { id: socket.id.substring(0, 6), img: data });
  });

  socket.on("sound", (data) => {
    io.emit("sound", { id: socket.id.substring(0, 6), sound: data });
  });

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`New room(${room}) created.`);
  });

  socket.on("sensor", (data) => {
    io.to(data.room).emit("sensor", data);
  });

  socket.on("sensor-toall", (data) => {
    io.emit("sensor", data);
  });
});
