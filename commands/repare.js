const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "repare",
  use: '**/repare**',
  description: "Permet de réparer une fusée sabotée.",
  options: [],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if (data.sabotage >= 1) {
        if (data.cash >= 500 && data.science >= 20) {
          cashUpdated = parseInt(data.cash) - 500;
          scienceUpdated = parseInt(data.science) - 20;
          sabotageUpdated = parseInt(data.sabotage) - 1;
          Agence.findOneAndUpdate({ userID: message.author.id },
            { cash: cashUpdated, science: scienceUpdated, sabotage: sabotageUpdated }).catch(err => { console.error(err) })
          return EmbedMessage.showSuccess(
            client,
            "**Repare:**",
            `Vous venez de réparer votre fusée qui était sabotée.`,
            message.author
          )
        } else {
          return new EmbedMessage(client, {
            title: "**Repare:**",
            description: `Vous n'avez pas l'argent ou les points de science nécessaire pour réparer votre fusée sabotée.`,
            author: message.author.username
          })
        }
      } else {
        return new EmbedMessage(client, {
          title: "**Repare:**",
          description: `Vous n'avez pas de fusée sabotée`,
          author: message.author.username
        })
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}