const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "sabotage",
  use: '**/sabotage [@unjoueur]**',
  description: "Permet de saboter la fusée du joueur mentionné.",
  options: [
    {
      name: "joueur",
      description: "Joueur que vous voulez saboter",
      type: 6,
      required: true
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      if (message.mention != undefined) {
        let member = message.mention;
        if (await AgenceManager.targetExists(member.id)) {
          let targetData = await AgenceManager.getOneByUserID(member.id)
          const counterUpdated = targetData.sabotage + 1
          let data = await AgenceManager.getOneByUserID(message.author.id)
          if (data.cash < 1500) {
            return EmbedMessage.showError(
              client,
              "Erreur",
              `Vous devez avoir au moins 1500$ en cash pour saboter une agence.`,
              message.author
            )
          } else {
            Agence.findOneAndUpdate({ userID: member.id },
              { sabotage: counterUpdated }).catch(err => { console.error(err) })

            Agence.findOneAndUpdate({ userID: message.author.id },
              { cash: data.cash - 1500 }).catch(err => { console.error(err) })

            return EmbedMessage.showSuccess(
              client,
              "Succès",
              `L'agence **${data.agenceName}** a saboté le lancement de la prochaine fusée de **${targetData.agenceName}** contre 1500$ !`,
              message.author
            )
          }
        } else {
          return EmbedMessage.showError(
            client,
            "Erreur",
            `Cette personne n'a pas d'agence ...`,
            message.author
          )
        }
      } else {
        return EmbedMessage.showError(
          client,
          "Erreur",
          `Vous devez mentionner la personne que vous voulez saboter dans votre commande ...`,
          message.author
        )
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}

