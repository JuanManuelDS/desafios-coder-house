const mongoose = require("mongoose");
const Authors = require("./authors.js").schema;

const MessageSchema = mongoose.Schema({
  author: { type: Authors, required: true },
  timestamp: { type: Date, required: true },
  message: { type: String, required: true },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
