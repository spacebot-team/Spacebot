const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "xp",
  use: "**/xp**",
  description: "Permet de voir son nombre d'XP.",
  options: [],
  admin: false,
  async execute (client, message, args) {

    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      let nbxp = ((Math.exp(((data.level) + 1) / 1.7) - 0.8) * 100) - data.experience
      return new EmbedMessage(client, {
        title: "__**Xp:**__",
        description: `Vous êtes niveau ${data.level}, il vous manque ${Math.round(nbxp)} xp pour être niveau ${parseInt(data.level) + 1}`,
        author: message.author.username,
      })
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}