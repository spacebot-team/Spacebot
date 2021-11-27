const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const rockets = require("./rockets");
const RocketManager = require("../managers/RocketManager");

module.exports = {
  name: "logo",
  use: "**/logo [lien de l'image]**",
  description: "Définit le logo de votre agence selon le lien de l'image que vous avez mis.",
  options: [
    {
      name: "entité",
      description: "Entité dont le logo sera modifié",
      type: 2,
      options: [
        {
          name: "agence",
          description: "Changer le logo de votre agence",
          type: 1,
          options: [
            {
              name: "lien",
              description: "Lien du nouveau logo de votre agence",
              type: 3,
              required: true
            }
          ]
        },
        {
          name: "fusée",
          description: "Changer le logo de votre fusée",
          type: 1,
          options: [
            {
              name: "nom",
              description: "Nom de la fusée dont le logo sera modifié",
              type: 3,
              required: true
            },
            {
              name: "lien",
              description: "Lien du nouveau logo de la fusée",
              type: 3,
              required: true
            }
          ]
        }
      ]
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {
      switch (args.length) {
        case 1:
          if (this.validURL(args[0])) {
            Agence.findOneAndUpdate({ userID: message.author.id },
              { logo: args[0] }).catch(err => { console.error(err) })
            return EmbedMessage.showSuccess(
              client,
              "Succès",
              `Le logo de votre agence a été mis à jour !`,
              message.author
            )
          } else {
            return EmbedMessage.showError(
              client,
              "Erreur",
              `L'argument après /logo doit être un lien !`
            )
          }
        case 2:
          if (await RocketManager.rocketExists(message.author.id, args[0])) {
            if (this.validURL(args[1])) {
              RocketManager.updateRocketImage(message.author.id, args[0], args[1])
              return EmbedMessage.showSuccess(
                client,
                "Succès",
                `Le logo de votre fusée **${args[0]}** a été mis à jour !`,
                message.author
              )
            } else {
              return EmbedMessage.showError(
                client,
                "Erreur",
                `L'argument après /logo doit être un lien !`
              )
            }
          } else {
            return EmbedMessage.showError(client, "**Rename - Erreur**", `Vous ne possédez aucune fusée au nom de **${args[0]}** !`)
          }
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  },
  validURL (str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }
}