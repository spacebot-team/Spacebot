const mongoose = require("mongoose");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const RocketManager = require("../managers/RocketManager");
const PasDeTirManager = require("../managers/PasDeTirManager");
const Rocket = require("../models/rocket");
const Agence = require("../models/agence");

module.exports = {
    name: "buy",
    use: '**/buy [tiers] [pays]**',
    description: "Permet d'acheter une fusée d'un tiers spécifique dans un pays ciblé.",
    options: [
        {
            name: "tiers",
            description: "Type de tiers de fusée",
            type: 3,
            choices: [
                { name: "tiers1", value: "tiers1" },
                { name: "tiers2", value: "tiers2" },
                { name: "tiers3", value: "tiers3" },
                { name: "tiers4", value: "tiers4" },
                { name: "tiers5", value: "tiers5" },
                { name: "tiers6", value: "tiers6" },
            ],
            required: true
        },
        {
            name: "pays",
            description: "Pays dans lequel vous souhaitez acheter la fusée",
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
            description: "Nom de votre fusée",
            type: 3,
            required: false
        },
    ],
    admin: false,
    async execute (client, message, args) {
        const allTiers = ["tiers1", "tiers2", "tiers3", "tiers4", "tiers5", "tiers6"]
        const reusableTiers = ["tiers4", "tiers5", "tiers6"]
        const tiersInfo = {
            "t1": { price: 5000, pds: 500 },
            "t2": { price: 30000, pds: 3000 },
            "t3": { price: 70000, pds: 5000 },
            "t4": { price: 160000, pds: 80000 },
            "t5": { price: 250000, pds: 125000 },
            "t6": { price: 400000, pds: 200000 }
        }
        const localisations = ["USA", "Chine", "Russie", "Guyane"]

        if (await AgenceManager.targetExists(message.author.id)) {
            let data = await AgenceManager.getOneByUserID(message.author.id)
            let typeTiers = args[0]
            let localisation = args[1]
            let tiers = typeTiers.replace("tiers", "");
            if(tiers <= data.tiersdebloquer){
                if (allTiers.includes(typeTiers)) {
                    if (localisations.includes(localisation)) {
                        typeTiers = typeTiers.replace("tiers", "t")
                        if (args[2] && !await RocketManager.rocketExists(message.author.id, args[2])) {
                            if (data.cash >= tiersInfo[typeTiers].price && data.science >= tiersInfo[typeTiers].pds) {
                                let dataToUpdate = []
                                dataToUpdate["cash"] = data.cash - tiersInfo[typeTiers].price
                                dataToUpdate["science"] = data.science - tiersInfo[typeTiers].pds
                                Agence.findOneAndUpdate({ userID: message.author.id },
                                    Object.assign({}, dataToUpdate)
                                ).catch(err => console.error(err))

                                let desc = null
                                let rocketName = null
                                let rocketId = mongoose.Types.ObjectId()
                                if (args[2]) {
                                    desc = `Tu viens d'acheter une fusée du nom de **${args[2]}** et du type **${typeTiers.replace("t", "tiers ")}** à l'endroit suivant : **${localisation}**`
                                    rocketName = args[2]
                                    if (await RocketManager.rocketExists(message.author.id, args[2])) {
                                        return EmbedMessage.showError(client, "**Buy - Erreur**", "Une fusée avec le même nom existe déjà !")
                                    }
                                } else {
                                    rocketName = "Fusée " + new String(rocketId).substring(new String(rocketId).length - 4, new String(rocketId).length)
                                    desc = `Tu viens d'acheter une fusée de type **${typeTiers.replace("t", "tiers ")}** à l'endroit suivant : **${localisation}**`
                                }

                                if (!await PasDeTirManager.hasPdtInLocation(message.author.id, localisation)) {
                                    desc = desc + `\nAttention, vous n'avez pas de pas de tir en **${localisation}**, pensez à en acheter un avant de lancer votre fusée !`
                                }
                                const _merged = Object.assign({ _id: rocketId }, {
                                    name: rocketName,
                                    userID: message.author.id,
                                    type: typeTiers.replace("t", "tiers"),
                                    location: localisation,
                                    image: null,
                                    successLaunches: 0,
                                    reusable: reusableTiers.includes(typeTiers.replace("t", "tiers")) ? true : false,
                                });
                                if(_merged.reusable){
                                    _merged.lastLaunch = 0
                                }
                                const rocket = new Rocket(_merged);
                                rocket.save();
                                return EmbedMessage.showSuccess(client, "Buy - Succès", desc, message.author)
                            } else {
                                return EmbedMessage.showError(client, "**Buy - Erreur**", `Tu n'as pas de pas assez d'argent pour acheter ce type de fusée** !`)
                            }
                        } else {
                            return EmbedMessage.showError(client, "**Buy - Erreur**", `Vous possédez déjà une fusée au nom de **${args[2]}** !`)
                        }
                    } else {
                        return EmbedMessage.showError(client, "**Buy - Erreur**", `Tu dois acheter ta fusée sur un de ces pays : ${localisations.join(", ")}`)
                    }
                } else {
                    return EmbedMessage.showError(client, "**Buy - Erreur**", `Tu ne peux acheter que ces types de fusée : ${allTiers.join(", ")}`)
                }
            }else{
                return EmbedMessage.showError(client, "**Buy - Erreur**", `Tu n'a pas débloquer cette technologie: fussée de tiers ${tiers}`)
            }
        } else {
            return EmbedMessage.anyAgenceError(client, message.author)
        }
    }
}
