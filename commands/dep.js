const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "dep",
  use: '**/dep all ou /dep [suivi du nombre que vous voulez déposer]**',
  description: "Dépose en banque le montant d'argent indiqué.",
  options: [
    {
      name: "valeur",
      description: "Montant que vous souhaitez déposer",
      type: 4,
      required: false
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if (data.cash == 0) {
        return EmbedMessage.showError(
          client,
          "Erreur",
          `Vous n'avez pas d'argent en poche...`,
          message.author
        )
      } else {
        let moneyTransfered = 0
        let bankUpdated = 0
        let cashUpdated = 0
        if (args.length == 0) {
          moneyTransfered = data.cash
          bankUpdated = data.bank + data.cash
          cashUpdated = 0
        } else {
          moneyTransfered = parseInt(args[0]) > data.cash ? data.cash : parseInt(args[0])
          bankUpdated = data.bank + moneyTransfered
          cashUpdated = data.cash - moneyTransfered
        }

        Agence.findOneAndUpdate({ userID: message.author.id },
          { cash: cashUpdated, bank: bankUpdated }).catch(err => { console.error(err) })

        return EmbedMessage.showSuccess(
          client,
          "Succès",
          `Vous avez déposé **${moneyTransfered}$** dans votre banque !`,
          message.author
        )
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}
