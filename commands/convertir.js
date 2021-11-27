const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "convertir",
  use: "**/convertir [nombre de points de science OU 'all' pour tout convertir]**",
  description: "Convertit le nombre de points de science donné et donne la moitié en argent.",
  options: [
    {
      name: "valeur",
      description: "Montant que vous souhaitez convertir",
      type: 4,
      required: false
    }
  ],
  admin: false,
  async execute (client, message, args) {

    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if (data.science == 0) {
        return EmbedMessage.showError(
          client,
          "Erreur",
          `Vous n'avez aucun point de science actuellement ...`,
          message.author
        )
      } else {
        const sciencePoints = data.science
        let pointsTransformed = 0
        let cashUpdated = 0
        let scienceUpdated = 0

        if (args.length == 0) {
          pointsTransformed = sciencePoints
          cashUpdated = data.cash + sciencePoints / 2
          scienceUpdated = 0
        } else {
          if (data.science >= parseInt(args[0])) {
            pointsTransformed = parseInt(args[0])
            cashUpdated = data.cash + parseInt(args[0]) / 2
            scienceUpdated = sciencePoints - parseInt(args[0])
          } else {
            return EmbedMessage.showError(
              client,
              "Erreur",
              `Vous ne possedez pas autant de points de science ...`,
              message.author
            )
          }
        }
        Agence.findOneAndUpdate({ userID: message.author.id }, { cash: cashUpdated, science: scienceUpdated }).catch(err => { console.error(err) })
        return EmbedMessage.showSuccess(
          client,
          "Succès",
          `Vous avez transformé **${pointsTransformed}** points de science en **${pointsTransformed / 2}$** !`,
          message.author
        )
      }
    } else {
      message.channel.send(EmbedMessage.anyAgenceError(client, message.author));
    }
  }
}