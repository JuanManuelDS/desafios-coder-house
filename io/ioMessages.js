async function ioMessages(io, socket) {
  const MongoDaos = require("../daos/MongoDaos.js");
  const { normalizeMessages } = require("../normalizr/functions.js");

  const mongoDB = new MongoDaos();
  let messages = await mongoDB.getAll();
  let normalizedMessages = normalizeMessages(messages);

  socket.emit("chat-actualizado", { messages, normalizedMessages });

  socket.on("chat", async (message) => {
    const addMessage = await mongoDB.save(message);
    messages = await mongoDB.getAll();
    normalizedMessages = normalizeMessages(messages);
    if (addMessage) {
      io.sockets.emit("chat-actualizado", { messages, normalizedMessages });
    } else {
      console.log("Ha ocurrido un problema al agregar el mensaje al chat");
    }
  });
}

module.exports = ioMessages;
