const mongoose = require("mongoose");

const GuerreFroideSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  USAQuantity: {
    "type": Number,
    "default": 0
  },
  RussieQuantity: {
    "type": Number,
    "default": 0
  },
  dateStart: {
    "type": Date,
    "default": Date.now
  },
  dateStop: {
    "type": Date,
    "default": Date.now
  },
  archive: {
    "type": Number,
    "default": 0
  }
});

module.exports = mongoose.model("GuerreFroides", GuerreFroideSchema);
