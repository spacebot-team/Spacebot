const mongoose = require("mongoose");
const Agence = require("../models/agence");
const PasDeTir = require("../models/pasdetir");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
    name: "create",
    use: "**/create [nomAgence (optionnel)]**",
    description: "Créer votre agence spatiale.",
    options: [
        {
            name: "nom",
            description: "Nom de l'entreprise que vous souhaitez créer",
            type: 3,
            required: false
        }
    ],
    admin: false,
    async execute (client, message, args) {
        require("../managers/functions")(client);
        if (!await AgenceManager.targetExists(message.author.id)) {
            const newAgence = {
                userID: message.author.id,
                username: message.author.username,
                agenceName: args[0] ? args[0] : "Aucun nom",
                bank: 5000,
                science: 500,
                ergol: 10
            };
            const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, newAgence);
            const createAgence = new Agence(merged);
            createAgence.save();

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
                userID: message.author.id,
                quantity: 1
            }
            const _merged = Object.assign({ _id: pdtId }, tmp);
            const pasDeTir = new PasDeTir(_merged);
            pasDeTir.save();
            return new EmbedMessage(client, {
                title: "Agence",
                description: `Vous venez de créer votre agence !\n Le nom de votre agence est : **${newAgence.agenceName}** ! Vous avez également obtenu un premier pas de tir localisé à '${tmp.location}' !`,
                author: message.author.username,
                image: "https://media1.tenor.com/images/dea6617e951cfba51bc1acfe1171cea9/tenor.gif?itemid=5220607"
            })
        } else {
            return new EmbedMessage(client, {
                title: "Agence",
                description: "Vous possédez déjà une agence",
                author: message.author.username,
                image: "https://media1.tenor.com/images/dde3636969953dcb33f333e32d07cb80/tenor.gif?itemid=11143983"
            })
        }
    }
}
