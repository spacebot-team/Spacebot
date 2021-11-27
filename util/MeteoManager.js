const Meteo = require("../models/meteo");
const mongoose = require("mongoose");
const meteo = require("../meteo.json");
const time = new Date().getTime();

class MeteoManager {

  static async initAllMeteos () {
    const pays = ["USA", "Chine", "Russie", "Guyane"]
    for (const element of pays) {
      if (await MeteoManager.getMeteo(element) == null) {
        MeteoManager.createMeteo(element, "Temps clair")
      }
    }
  }

  static async getAllMeteos () {
    let meteos = await Meteo.find({}).then(data => {
      return data
    }).catch(err => console.log(err))
    return meteos
  }

  static createMeteo (pays, libelle) {
    console.log("Météo - création de la météo du pays " + pays)
    let result = new Meteo();
    result._id = mongoose.Types.ObjectId();
    result.pays = pays;
    result.libelle = libelle != undefined ? libelle : "Temps clair";
    result.lastUpdate = new Date().getTime();
    result.save();
  }

  static async getMeteo (pays) {
    let result = Meteo.findOne({ pays: pays })
      .then(meteo => { return meteo })
      .catch(err => { console.error(err) })
    return result;
  }

  static async updateMeteo (pays, libelle) {
    await Meteo.findOneAndUpdate({ pays: pays }, { libelle: libelle })
      .catch(err => { console.error(err) })
  }

  static async updateMeteoAuto () {
    let data = await MeteoManager.getMeteo("USA");
    if (time - data.lastUpdate > 14400000) {
      await MeteoManager.initAllMeteos()
      let rmu = "m" + parseInt(Math.random() * 100 + 1)
      let rmg = "m" + parseInt(Math.random() * 100 + 1)
      let rmr = "m" + parseInt(Math.random() * 100 + 1)
      let rmc = "m" + parseInt(Math.random() * 100 + 1)

      if (rmc === "m81" || rmc === "m66" || rmc === "m64" || rmc === "m61" || rmc === "m32" || rmc === "m35" || rmc === "m6" || rmc === "m31" || rmc === "m57" || rmc === "m58") {
        rmc = "m13"
      }

      let meteo_USA = meteo["ilfaitqu'elletemps?"][rmu]
      let meteo_GUYANE = meteo["ilfaitqu'elletemps?"][rmg]
      let meteo_RUSSIE = meteo["ilfaitqu'elletemps?"][rmr]
      let meteo_CHINE = meteo["ilfaitqu'elletemps?"][rmc]

      await Meteo.findOneAndUpdate({ pays: "USA" }, { libelle: meteo_USA }).catch(err => { console.error(err) })
      await Meteo.findOneAndUpdate({ pays: "Russie" }, { libelle: meteo_GUYANE }).catch(err => { console.error(err) })
      await Meteo.findOneAndUpdate({ pays: "Guyane" }, { libelle: meteo_RUSSIE }).catch(err => { console.error(err) })
      await Meteo.findOneAndUpdate({ pays: "Chine" }, { libelle: meteo_CHINE }).catch(err => { console.error(err) })
      await Meteo.findOneAndUpdate({ pays: "USA" }, { lastUpdate: time })
    }
  }

}

module.exports = MeteoManager;
