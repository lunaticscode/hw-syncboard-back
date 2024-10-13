require("dotenv").config();
const app = require("express")();
const cors = require("cors");
const { Server } = require("socket.io");

const WAS = require("http").createServer(app);
const DEV_PORT = 8080;
app.use(cors());
const io = new Server(WAS, { cors: { origin: process.env.WS_CLIENT_URL } });
app.get("/test", (req, res) => {
  return res.json({ result: true, message: "Testing Http request" });
});
io.on("connection", (socket) => {
  const role = socket.request.headers.role;
  socket.join(role);
  socket.on("disconnect", (reason) => {});
  socket.on("draw", (msg) => {
    socket.to("viewer").emit("paint-offset", msg);
  });
  socket.on("client-connect", (msg) => {});
});

WAS.listen(DEV_PORT, () => {
  console.log(`Express running on ${DEV_PORT}`);
});

// module.exports = WAS;
