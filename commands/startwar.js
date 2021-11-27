const mongoose = require("mongoose");
const GuerreFroideSchema = require("../models/guerreFroide");
const GuerreFroideManager = require("../managers/GuerreManager");
const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
  name: "startwar",
  use: "**/startwar**",
  description: "Commencer une nouvelle guerre froide.",
  admin: true,
  async execute (client, message, args) {

    if (message.member.roles.cache.find(r => r.name == global.staffRole)) {
      if (await GuerreFroideManager.getCurrentGuerre() == null) {
        let dateStart = new Date()
        console.log(dateStart.toString())
        let dateStop = new Date()
        dateStop.setDate(dateStart.getDate() + 7)
        console.log(dateStop.toString())

        let result = new GuerreFroideSchema();
        result._id = mongoose.Types.ObjectId();
        result.dateStart = dateStart;
        result.dateStop = dateStop;
        result.save()

        message.channel.send({
          embeds: [new EmbedMessage(client, {
            title: "**Avis à la population**",
            description: `La guerre est déclarée du **${dateStart.toLocaleDateString("fr-FR")}** au **${dateStop.toLocaleDateString("fr-FR")}** !
                          Envoyez le plus de fusées pour que votre clan remporte la guerre !`,
            thumbnail: true
          })]
        })
      } else {
        message.channel.send({
          embeds: [EmbedMessage.showError(
            client,
            "Guerre froide - Erreur",
            "Une guerre est déjà en cours ..."
          )]
        })
      }

    } else {
      message.channel.send({
        embeds: [EmbedMessage.showError(
          client,
          "🛑 Erreur",
          "Vous n'avez pas la permission d'executer cette commande !"
        )]
      })
    }
  }
}