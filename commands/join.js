const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const GuerreManager = require("../managers/GuerreManager");

module.exports = {
  name: "join",
  use: "**/join [USA / Russie]**",
  description: "Permet de rejoindre une des deux équipes dans la guerre froide.",
  options: [
    {
      name: "equipe",
      description: "Equipe que vous souhaitez rejoindre",
      type: 3,
      choices: [
        { name: "USA", value: "USA" },
        { name: "Russie", value: "Russie" }
      ],
      required: true
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      if (await GuerreManager.getCurrentGuerre() != null) {
        const guerre = await GuerreManager.getCurrentGuerre()
        if (args[0] == "USA" || args[0] == "Russie") {
          const now = new Date()
          let checkJoinDate = new Date()
          checkJoinDate.setTime(guerre.dateStop.getTime() - 172800000)
          if (now.getTime() < checkJoinDate.getTime()) {
            let data = await AgenceManager.getOneByUserID(message.author.id)
            let USARole = message.guild.roles.cache.find(r => r.name === "Spacebot - USA")
            let RussieRole = message.guild.roles.cache.find(r => r.name === "Spacebot - Russie")
            if (data.USAJoin > 0 || data.RussieJoin > 0) {
              return EmbedMessage.showError(client, "**Join - Erreur**", "Vous avez déjà rejoint un clan !")
            } else {
              const joinCost = 800
              if (data.cash >= joinCost) {
                const dataToUpdate = args[0] == "USA" ? { USAJoin: 1, cash: data.cash - joinCost } : { RussieJoin: 1, cash: data.cash - joinCost }
                message.member.roles.add(args[0] == "USA" ? USARole : RussieRole)
                Agence.findOneAndUpdate({ userID: message.author.id }, dataToUpdate).catch(err => { console.error(err) })
                return EmbedMessage.showSuccess(
                  client,
                  "**Join**",
                  `Vous venez de rejoindre les **${args[0] == "USA" ? "américains" : "russes"}** contre **800$** ! 
                  Vous avez maintenant accès au channel de votre équipe pour pouvoir discuter ensemble de votre stratégie !`,
                  message.author)
              } else {
                return EmbedMessage.showError(client, "**Join - Erreur**", "Vous devez avoir au moins 800$ sur vous pour pouvoir rejoindre la Guerre froide !")
              }
            }
          } else {
            return EmbedMessage.showError(client, "**Join - Erreur**", "Impossible de rejoindre la guerre froide à 2 jours de la fin ...")
          }
        } else {
          return EmbedMessage.showError(client, "**Join - Erreur**", "Vous devez utiliser la commande comme ceci : " + this.use)
        }
      } else {
        return EmbedMessage.showError(client, "**Join - Erreur**", "Il n'y a aucune guerre de déclarée en ce moment...")
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}