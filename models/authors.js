const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String },
    age: { type: String, required: true },
    alias: { type: String, required: true },
    avatar: { type: String },
  },
  { _id: false }
);

const Authors = mongoose.model("Authors", AuthorSchema);

module.exports = Authors;
