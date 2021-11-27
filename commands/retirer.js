const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "retirer",
  use: '**/retirer all ou /retirer [suivi du nombre que vous voulez retirer]**',
  description: "Retire de la banque le montant d'argent indiqué.",
  options: [
    {
      name: "valeur",
      description: "Montant que vous souhaitez retirer",
      type: 4,
      required: false
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if (data.bank == 0) {
        return EmbedMessage.showError(
          client,
          "Erreur",
          `Vous n'avez pas d'argent en banque...`,
          message.author
        )
      } else {
        let moneyTransfered = 0
        let bankUpdated = 0
        let cashUpdated = 0

        if (args.length == 0) {
          moneyTransfered = data.bank
          bankUpdated = 0
          cashUpdated = data.cash + moneyTransfered
        } else {
          moneyTransfered = parseInt(args[0]) > data.bank ? data.bank : parseInt(args[0])
          bankUpdated = data.bank - moneyTransfered
          cashUpdated = data.cash + moneyTransfered
        }

        Agence.findOneAndUpdate({ userID: message.author.id },
          { cash: cashUpdated, bank: bankUpdated }).catch(err => { console.error(err) })
        return EmbedMessage.showSuccess(
          client,
          "Succès",
          `Vous avez retiré **${moneyTransfered}$** de votre banque !`,
          message.author
        )
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}
