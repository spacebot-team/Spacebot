const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const GuerreManager = require("../managers/GuerreManager");

module.exports = {
  name: "stopwar",
  use: "**/stopwar**",
  description: "Terminer la guerre froide.",
  admin: true,
  async execute (client, message, args) {

    if (message.member.roles.cache.find(r => r.name == global.staffRole)) {
      const guerre = await GuerreManager.getCurrentGuerre();
      if (guerre != null) {
        GuerreManager.terminerGuerre();
        //On retire les rôles des utilisateurs
        const USARole = message.guild.roles.cache.find(r => r.name === "Spacebot - USA")
        const RussieRole = message.guild.roles.cache.find(r => r.name === "Spacebot - Russie")
        RussieRole.members.forEach(member => {
          member.roles.remove(RussieRole)
        });
        USARole.members.forEach(member => {
          member.roles.remove(USARole)
        });

        let description = "La guerre est terminée ! "
        const vainqueurs = guerre.USAQuantity > guerre.RussieQuantity ? "américains" : "russes"
        let reward = 0

        //On va chercher toutes les agences ayant rejoint les USA ou la Russie
        Agence.find({ $or: [{ USAJoin: 1 }, { RussieJoin: 1 }] })
          .then(data => {

            //on détermine le nombre de vainqueurs
            let nbVainqueurs = 0
            if (guerre.USAQuantity > guerre.RussieQuantity) {
              nbVainqueurs = data.filter(agence => agence.USAJoin == 1).length
              reward = ((guerre.USAQuantity * 1000) / 2) / nbVainqueurs
            } else if (guerre.RussieQuantity > guerre.USAQuantity) {
              nbVainqueurs = data.filter(agence => agence.RussieJoin == 1).length
              reward = ((guerre.RussieQuantity * 1000) / 2) / nbVainqueurs
            } else {
              nbVainqueurs = 0
            }

            //Pour chaque agence ayant rejoint les USA ou la Russie,
            //on réinitialise leur propriété et on leur ajoute la récompense si ils font parti des vainqueurs
            for (const agence of data) {
              let dataToUpdate = null
              if (guerre.USAQuantity > guerre.RussieQuantity && agence.USAJoin == 1) {
                dataToUpdate = { USAJoin: 0, RussieJoin: 0, bank: agence.bank + reward }
              } else if (guerre.RussieQuantity > guerre.USAQuantity && agence.RussieJoin == 1) {
                dataToUpdate = { USAJoin: 0, RussieJoin: 0, bank: agence.bank + reward }
              } else {
                dataToUpdate = { USAJoin: 0, RussieJoin: 0 }
              }
              Agence.findOneAndUpdate({ userID: agence.userID }, dataToUpdate).catch(err => console.log(err));
            }

            if (guerre.USAQuantity > 0 || guerre.RussieQuantity > 0 && nbVainqueurs > 0) {
              const quantity = guerre.USAQuantity > guerre.RussieQuantity ? guerre.USAQuantity : guerre.RussieQuantity;
              description = description + `Les vainqueurs sont les **${vainqueurs}** ! Après avoir lancé ${quantity} fusées, ils remportent chacun la somme de ${reward}$ !`;
            } else {
              description = description + "Aucun des deux camps n'a su prendre l'avantage, repliez bagage et tentez votre chance plus tard !"
            }
            message.channel.send({
              embeds: [new EmbedMessage(client, {
                title: "**Avis à la population**",
                description,
                thumbnail: true
              })]
            });
          })
          .catch(err => console.error(err))
      } else {
        message.channel.send({
          embeds: [EmbedMessage.showError(
            client,
            "Guerre froide - Erreur",
            "Aucune guerre n'est déclarée pour le moment ..."
          )]
        });
      }
    } else {
      message.channel.send({
        embeds: [EmbedMessage.showError(
          client,
          "🛑 Erreur",
          "Vous n'avez pas la permission d'executer cette commande !"
        )]
      });
    }
  }
}