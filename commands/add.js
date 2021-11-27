const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
    name: "add",
    use: "/add [@joueur] [bank/cash/pdc] [nombre]",
    description: "Ajouter de l'argent à un joueur",
    admin: true,
    async execute (client, message, args) {
        if (await AgenceManager.targetExists(message.author.id)) {
            if (message.member.roles.cache.find(r => r.name == global.staffRole) != null) {
                let member = message.mentions.users.first();
                if (!member) return;
                let argument1 = args[1]
                let argument2 = parseInt(args[2])
                let data = await AgenceManager.getOneByUserID(member.id)
                if (!argument2) {
                    message.channel.send({
                        embeds: [EmbedMessage.showError(
                            client,
                            "**Erreur**",
                            "Aucune somme n'a été saisie..."
                        )]
                    })
                } else {
                    bankUpdated = data.bank + argument2

                    if (argument1 == "ergol") {
                        let ergolUpdated = data.ergol + argument2
                        Agence.findOneAndUpdate({ userID: member.id },
                            { ergol: ergolUpdated },
                            function (err, data) {
                                if (err) {
                                    console.error(err)
                                } else {
                                    message.channel.send({
                                        embeds: [EmbedMessage.showSuccess(
                                            client,
                                            "**Staff:**",
                                            `Tu viens d'ajouter ${argument2} tonnes d'ergol à ${member}`,
                                            message.author
                                        )]
                                    })
                                }
                            }
                        )
                    }
                    if (argument1 === "bank") {
                        Agence.findOneAndUpdate({ userID: member.id },
                            { bank: bankUpdated },
                            function (err, data) {
                                if (err) {
                                    console.error(err)
                                } else {
                                    message.channel.send({
                                        embeds: [EmbedMessage.showSuccess(
                                            client,
                                            "**Staff:**",
                                            `Tu viens d'ajouter ${argument2}$ dans la bank de ${member}`,
                                            message.author
                                        )]
                                    })
                                }
                            }
                        )

                    } else {
                        if (argument1 === "cash") {
                            cashUpdated = data.cash + argument2
                            Agence.findOneAndUpdate({ userID: member.id },
                                { cash: cashUpdated },
                                function (err, data) {
                                    if (err) {
                                        console.error(err)
                                    } else {
                                        message.channel.send({
                                            embeds: [EmbedMessage.showSuccess(
                                                client,
                                                "**Staff:**",
                                                `Tu viens d'ajouter ${argument2}$ dans le cash de ${member}`,
                                                message.author
                                            )]
                                        })
                                    }
                                }
                            )
                        } else {
                            if (argument1 === "pds") {
                                scienceUpdated = data.science + argument2
                                Agence.findOneAndUpdate({ userID: member.id },
                                    { science: scienceUpdated },
                                    function (err, data) {
                                        if (err) {
                                            console.error(err)
                                        } else {
                                            message.channel.send({
                                                embeds: [EmbedMessage.showSuccess(
                                                    client,
                                                    "**Staff:**",
                                                    `Tu viens d'ajouter ${argument2} point de science a ${member}`,
                                                    message.author
                                                )]
                                            })
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            } else {
                message.channel.send({
                    embeds: [EmbedMessage.showError(
                        client,
                        "🛑 Erreur",
                        "Vous n'avez pas la permission d'executer cette commande !"
                    )]
                })
            }
        } else {
            message.channel.send({
                embeds: [EmbedMessage.anyAgenceError(client, message.author)]
            })
        }
    }
}
