const mongoose = require("mongoose");
const Agence = require("../models/agence");
const PasDeTir = require("../models/pasdetir");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
    name: "buypdt",
    use: '**/buypdt [Pays]**',
    description: 'Acheter un pas de tir dans pays spécifique.',
    options: [
        {
            name: "pays",
            description: "Pays dans lequel vous voulez le pas de tir",
            type: 3,
            choices: [
                { name: "USA", value: "USA" },
                { name: "Russie", value: "Russie" },
                { name: "Chine", value: "Chine" },
                { name: "Guyane", value: "Guyane" }
            ],
            required: true
        },
        {
            name: "nom",
            description: "Nom du pas de tir que vous allez acquérir",
            type: 3,
            required: false
        }
    ],
    admin: false,
    async execute (client, message, args) {
        if (await AgenceManager.targetExists(message.author.id)) {
            let data = await AgenceManager.getOneByUserID(message.author.id)
            const localisations = ["USA", "Russie", "Chine", "Guyane"]
            const localisationPrice = {
                USA: 7000,
                Russie: 7000,
                Chine: 6000,
                Guyane: 5500
            }

            if (localisations.includes(args[0])) {
                if (data.cash < localisationPrice[args[0]]) {
                    return this.notEnoughMoneyError(client, message)
                } else {
                    let cashUpdated = data.cash - localisationPrice[args[0]]
                    let error = false

                    var tmp = null
                    let pdtId = mongoose.Types.ObjectId()
                    let pdtName = null
                    if (args[1] != undefined) {
                        pdtName = args[1]
                        tmp = { location: args[0], userID: message.author.id, name: pdtName }
                    } else {
                        pdtName = 'Pas de tir ' + new String(pdtId).substring(new String(pdtId).length - 4, new String(pdtId).length)
                        tmp = { location: args[0], userID: message.author.id, name: pdtName }
                    }

                    const _merged = Object.assign({ _id: pdtId }, tmp);
                    const createPdt = new PasDeTir(_merged);
                    createPdt.save();

                    if (!error) {
                        let description = null
                        if (args[1] != undefined) {
                            description = `Vous venez d'acheter un pas de tir du nom de **${args[1]}** contre **${localisationPrice[args[0]]}$** à l'endroit suivant : ${args[0]}.`
                        } else {
                            description = `Vous venez d'acheter un pas de tir contre **${localisationPrice[args[0]]}$** à l'endroit suivant : ${args[0]}.`
                        }
                        Agence.findOneAndUpdate({ userID: message.author.id }, { cash: cashUpdated }).catch(err => { console.error(err) })
                        return new EmbedMessage(client, {
                            title: "**Succès - Pas de tir**",
                            description,
                            author: message.author.username,
                            thumbnail: true
                        })
                    }
                }
            } else {
                return new EmbedMessage(client, {
                    title: "**Achat pas de tir - Erreur**",
                    description: `Le pays que vous avez ciblé n'a pas de pas de tir. Choisissez un des pays suivants : ${localisations.join(", ")}`,
                    author: message.author.username,
                })
            }
        } else {
            return EmbedMessage.anyAgenceError(client, message.author)
        }
    },
    notEnoughMoneyError (client, message) {
        return new EmbedMessage(client, {
            title: "**Buy pas de tir:**",
            description: `Vous n'avez pas l'agrent nécessaire pour acheter ce pas de tir...`,
            author: message.author.username,
        })
    }
}