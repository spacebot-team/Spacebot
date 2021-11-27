const mongoose = require("mongoose");

const MeteoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  pays: String,
  libelle: String,
  lastUpdate: {
    "type": Number,
    "default": 0
  }
});

module.exports = mongoose.model("Meteo", MeteoSchema);
