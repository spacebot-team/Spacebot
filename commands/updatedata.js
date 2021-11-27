const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const PasDeTir = require("../models/pasdetir");
const mongoose = require("mongoose");

module.exports = {
  name: "updatedata",
  use: "/updatedata",
  description: "Met à jour les données des joueurs pour la v3",
  admin: true,
  async execute (client, message, args) {
    if (message.member.roles.cache.find(r => r.name == global.staffRole) != null) {
      let data = await Agence.find({}).then(data => { return data }).catch(err => { console.error(err) })
      for (const agence of data) {
        // PAS DE TIR ALEATOIRE
        const data = [
          { id: 1, name: "USA" },
          { id: 2, name: "Russie" },
          { id: 3, name: "Chine" },
          { id: 4, name: "Guyane" }
        ];
        const randomIndex = Math.floor(Math.random() * (data.length - 0) + 0);

        let pdtId = mongoose.Types.ObjectId()
        const tmp = {
          name: 'Pas de tir ' + new String(pdtId).substring(new String(pdtId).length - 4, new String(pdtId).length),
          location: data[randomIndex].name,
          userID: agence.userID,
          quantity: 1
        }
        const _merged = Object.assign({ _id: pdtId }, tmp);
        const pasDeTir = new PasDeTir(_merged);
        pasDeTir.save();
        message.channel.send({embeds: [
          EmbedMessage.showSuccess(client, "**Update - Succès**", `L'agence ${agence.agenceName} a été mise à jour avec succès et a reçu un pas de tir en ${data[randomIndex].name} !`, message.author)
        ]});
      }
      message.channel.send({embeds: [
        EmbedMessage.showSuccess(
        client,
        "**Update - Succès**",
        "Toutes les agences ont été modifiées !",
        message.author
      )]})
    } else {
      message.channel.send({embeds: [
        EmbedMessage.showError(
          client,
          "🛑 Erreur",
          "Vous n'avez pas la permission d'executer cette commande !"
        )
      ]});
    }
  }
}