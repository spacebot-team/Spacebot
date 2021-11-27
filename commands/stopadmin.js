const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
  name: "stopadmin",
  use: "**/stopadmin**",
  description: "Arrête le bot à distance.",
  admin: true,
  async execute (client, message, args) {
    if (message.member.roles.cache.find(r => r.name == global.staffRole) != null) {
      message.channel.send("**MAINTENANCE: le bot va revenir dans quels que minutes!!**")
      setTimeout(() => {

        message.channel.send("Le bot a été arrêté avec succès !")
      }, 500)
      setTimeout(() => {
        process.exit()
      }, 1000)
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
