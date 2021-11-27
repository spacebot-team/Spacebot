const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "description",
  use: "**/description [texte]**",
  description: "Modifie la description de votre agence.",
  options: [],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      let dataToUpdate = null
      if (data.level < 1) {
        dataToUpdate = { experience: data.experience + 110, description: args.join(' ') };
      } else {
        dataToUpdate = { description: args.join(' ') };
      }
      AgenceManager.waitDescriptionMessage(client, message)
      AgenceManager.evaluateLevel(data, client, message)

      return EmbedMessage.showSuccess(
        client,
        "**Description - En attente**",
        `Vous avez maintenant 10 secondes pour transmettre votre description...`,
        message.author
      )
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}
