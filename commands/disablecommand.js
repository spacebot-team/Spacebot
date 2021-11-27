const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
  name: "disablecommand",
  use: "**/disablecommand [nom de la commande]**",
  description: "Désactive temporairement une commande.",
  admin: true,
  async execute (client, message, args) {
    if (message.member.roles.cache.find(r => r.name == global.staffRole) != null) {
      if (args[0] != undefined) {
        let command = args[0]
        if (client.commands.has(command)) {
          if (!client.commandsDisabled.includes(command)) {
            client.commandsDisabled.push(command)
            message.channel.send({embeds: [
              EmbedMessage.showSuccess(client, "**Disable - Succès**", `La commande **${command}** a été désactivée avec succès !`, message.author)
            ]})
          } else {
            let commandIndex = client.commandsDisabled.indexOf(command)
            client.commandsDisabled.splice(commandIndex, 1)
            message.channel.send({embeds: [
              EmbedMessage.showSuccess(
                client,
                "Disable - Succès",
                `La commande **${command}** a été réactivée avec succès !`,
                message.author
              )
            ]});
          }
        } else {
          message.channel.send({embeds: [
            EmbedMessage.showError(
              client,
              "Disable - Erreur",
              "Cette commande n'existe pas ..."
            )
          ]});
        }
      } else {
        message.channel.send({embeds: [
          EmbedMessage.showError(
            client,
            "Disable - Erreur",
            "Vous devez utiliser la commande comme ceci : " + this.use
          )
        ]});
      }
    } else {
      message.channel.send({embeds: [
        EmbedMessage.showError(
          client,
          "🛑 Erreur",
          "Vous n'avez pas la permission d'executer cette commande !"
        )
      ]});
    }
  }
}