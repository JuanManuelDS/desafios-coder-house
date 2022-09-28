function ioStarter(io) {
  const ioMessages = require("./ioMessages.js");

  io.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado: " + socket.id);
    ioMessages(io, socket);
  });
}

module.exports = ioStarter;
