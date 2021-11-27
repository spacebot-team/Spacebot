const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager")

module.exports = {
  name: "voler",
  use: "**/voler [@joueur]**",
  description: "Permet de voler de l'argent de poche à un joueur.",
  options: [
    {
      name: "joueur",
      description: "Joueur que vous voulez voler",
      type: 6,
      required: true
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      let mention = message.mention;
      const time = new Date().getTime();
      if (time - data.lastSteal < 21600000) {
        let remainingTime = data.lastSteal - time + 21600000;
        let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        let secondes = Math.floor((remainingTime % (1000 * 60)) / (1000));
        return new EmbedMessage(client, {
          title: "**Steal**",
          description: `Il faut attendre ${hours} heures ${minutes} minutes ${secondes} secondes avant de pouvoir executer la commande de nouveau.`,
          author: message.author.username
        })
      } else {
        if (!mention) {
          return new EmbedMessage(client, {
            title: "**Steal**",
            description: `Vous devez mentionner une personne à voler!`,
            author: message.author.username
          })
        } else {
          if (await AgenceManager.targetExists(mention.id)) {
            let targetData = await AgenceManager.getOneByUserID(mention.id)
            let percent = Math.floor(Math.random() * 29 + 1)
            let stolen = parseInt(targetData.cash * (parseInt(percent) / 100))
            console.log("percent" + percent)
            console.log("stolen" + stolen)

            Agence.findOneAndUpdate({ userID: mention.id },
              { cash: targetData.cash - stolen }).catch(err => { console.error(err) })

            Agence.findOneAndUpdate({ userID: message.author.id }, {
              cash: data.cash + stolen,
              lastSteal: time
            }).catch(err => console.error(err))
            return EmbedMessage.showSuccess(
              client,
              "Succès",
              `Tu viens de voler ${stolen}$ a ${mention}.`,
              message.author
            )
          } else {
            return EmbedMessage.anyAgenceError(client, message.author)
          }
        }
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}
