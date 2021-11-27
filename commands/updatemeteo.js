const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const { getMeteo, updateMeteo, updateMeteoAuto } = require("../managers/MeteoManager");
const MeteoManager = require("../managers/MeteoManager")
const fs = require("fs");
const meteo = require("../meteo.json");
const Meteo = require("../models/meteo");
module.exports = {
  name: "updatemeteo",
  use: "/udpatemeteo",
  description: "Permet de d'updates la météo.",
  admin: true,
  async execute (client, message, args) {
    if (message.member.roles.cache.find(r => r.name == global.staffRole) != null) {
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

      await Meteo.findOneAndUpdate({ pays: "USA" }, { libelle: meteo_USA })
      await Meteo.findOneAndUpdate({ pays: "Russie" }, { libelle: meteo_GUYANE })
      await Meteo.findOneAndUpdate({ pays: "Guyane" }, { libelle: meteo_RUSSIE })
      await Meteo.findOneAndUpdate({ pays: "Chine" }, { libelle: meteo_CHINE })

      message.channel.send({
        embeds: [EmbedMessage.showSuccess(
          client,
          "**Update météo**",
          "Vous venez de mettre à jour la météo avec succès !",
          message.author
        )]
      });
    } else {
      message.channel.send({
        embeds: [EmbedMessage.showError(
          client,
          "🛑 Erreur",
          "Vous n'avez pas la permission d'executer cette commande !"
        )]
      });
    }

  }
}