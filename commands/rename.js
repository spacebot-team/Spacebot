const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const RocketManager = require("../managers/RocketManager");
const PasDeTirManager = require("../managers/PasDeTirManager");

module.exports = {
  name: "rename",
  use: "**/rename [entite] [valeur]**",
  description: "Modifie le nom de votre agence",
  options: [
    {
      name: "entité",
      description: "Entité à renommer",
      type: 3,
      choices: [
        { name: "Agence", value: "agence" },
        { name: "Fusée", value: "fusee" },
        { name: "Pas de tir", value: "pdt" }
      ],
      required: true
    },
    {
      name: "ancien",
      description: "Ancien nom de l'entité",
      type: 3,
      required: true
    },
    {
      name: "nouveau",
      description: "Nouveau nom de l'entité",
      type: 3,
      required: true
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (await AgenceManager.targetExists(message.author.id)) {

      let entite = args[0]
      let oldName = args[1]
      let newName = args[2]

      switch (entite) {
        case "agence":
          Agence.findOneAndUpdate({ userID: message.author.id },
            { agenceName: newName }).catch(err => { console.error(err) })
          return EmbedMessage.showSuccess(
            client,
            "**Rename - Succès**",
            `Votre agence a été renommée par **${newName}** !`,
            message.author
          )
        case "fusee":
          if (await RocketManager.rocketExists(message.author.id, oldName)) {
            RocketManager.updateRocketName(message.author.id, oldName, newName)
            return EmbedMessage.showSuccess(
              client,
              "**Rename - Succès**",
              `Votre fusée **${oldName}** a été renommée par **${newName}** !`,
              message.author
            )
          } else {
            return EmbedMessage.showError(client, "**Rename - Erreur**", `Vous ne possédez aucune fusée au nom de **${oldName}** !`)
          }
        case "pdt":
          if (await PasDeTirManager.getPdtByUserIdAndName(message.author.id, oldName)) {
            PasDeTirManager.updatePdtName(message.author.id, oldName, newName)
            return EmbedMessage.showSuccess(
              client,
              "**Rename - Succès**",
              `Votre pas de tir **${oldName}** a été renommé par **${newName}** !`,
              message.author
            )
          } else {
            return EmbedMessage.showError(client, "**Rename - Erreur**", `Vous ne possédez aucun pas de tir au nom de **${oldName}** !`)
          }
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}