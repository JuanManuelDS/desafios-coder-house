const Message = require("../models/messages.js");
const moment = require("moment");

class MongoDaos {
  async save({ author, message }) {
    const newMessage = new Message({
      timestamp: moment().format("YYYY/MM/D hh:mm:ss"),
      message,
      author,
    });
    try {
      await newMessage.save();
      return true;
    } catch (err) {
      console.log(err);
    }
  }

  async getAll() {
    const messages = await Message.find({});
    return messages;
  }
}

module.exports = MongoDaos;
