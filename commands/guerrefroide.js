const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const GuerreManager = require("../managers/GuerreManager");

module.exports = {
  name: "guerrefroide",
  use: "**/guerrefroide**",
  description: "Voir les statistiques de la guerre actuelle.",
  options: [],
  admin: false,
  async execute (client, message, args) {
    const guerre = await GuerreManager.getCurrentGuerre();
    if (guerre == null) {
      return EmbedMessage.showError(
        client,
        "**Guerre froide - erreur**",
        "Il semble qu'aucune guerre ne soit déclarée pour le moment..."
      )
    } else {
      let description = ''
      if (await AgenceManager.targetExists(message.author.id)) {
        let data = await AgenceManager.getOneByUserID(message.author.id)
        let equipe = null
        if (data.USAJoin == 1) { equipe = "américains" }
        if (data.RussieJoin == 1) { equipe = "russes" }
        description = `Vous avez rejoint les **${equipe}** pour cette guerre ! \n`
      }

      description = description + `Voici l'état de la guerre actuelle : \n Les USA ont gagnés **${guerre.USAQuantity}** point(s). \n
      La Russie a gagné **${guerre.RussieQuantity}** point(s). \n`;

      if (guerre.USAQuantity > 0 || guerre.RussieQuantity > 0) {
        description = description + `Les potentiels vainqueurs sont : **${guerre.RussieQuantity > guerre.USAQuantity ? 'Les russes !' : 'Les Américains !'}**`;
      } else {
        description = description + "Aucun vainqueur potentiel pour le moment ..."
      }
      return EmbedMessage.showSuccess(
        client,
        "**Guerre froide - Statistiques**",
        description,
        message.author
      )
    }
  }
}