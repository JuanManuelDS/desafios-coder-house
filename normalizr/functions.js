const { normalize, schema } = require("normalizr");

const debugChat = (messages) => {
  const debugedChat = { id: "mensajes", chats: [] };
  debugedChat.chats = messages.map((item) => {
    return {
      id: item._id,
      author: item.author,
      text: item.text,
      timestamp: item.timestamp,
    };
  });
  return debugedChat;
};

function normalizeMessages(chat) {
  const debuggedChat = debugChat(chat);
  const author = new schema.Entity("authors");
  const messages = new schema.Entity("messages", { author });
  const chatEntity = new schema.Entity("chats", { chats: [messages] });
  const normalizedMessages = normalize(debuggedChat, chatEntity);
  return normalizedMessages;
}

function denormalizeMessages(messages) {
  const author = new normalizr.schema.Entity("authors");
  const mensajes = new normalizr.schema.Entity("mensajes", {
    author: author,
  });
  const chats = new normalizr.schema.Entity("chats", { chats: [mensajes] });

  const denormalizedMessages = normalizr.denormalize(
    messages.result,
    chats,
    messages.entities
  );

  return denormalizedMessages;
}

module.exports = { normalizeMessages, denormalizeMessages };
