const mongoose = require("mongoose");

const pasDeTirSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  location: String,
  name: {
    "type": String,
    "default": null,
  },
  userID: String,
  available: {
    "type": Boolean,
    "default": true
  },
  rocketID: {
    "type": String,
    "default": null
  }
});

module.exports = mongoose.model("PasDeTir", pasDeTirSchema);
