const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const agence = require("../models/agence");

module.exports = {
    name: "economie",
    use: "**/economie**",
    description: "Permet de connaître le nombre d'argent, de point de science en circulation sur le serveur.",
    admin: true,
    async execute (client, message, args) {
        if (await AgenceManager.targetExists(message.author.id)) {
            let data = await AgenceManager.getOneByUserID(message.author.id)
            if (message.member.roles.cache.find(r => r.name == global.staffRole) != null) {
                Agence.find({}).then(data => {
                    let bank = 0;
                    data.forEach(agence => {
                        bank = bank + agence.bank
                    });
                    let cash = 0;
                    data.forEach(agence => {
                        cash = cash + agence.cash
                    });
                    let money = cash + bank
                    let pdc = 0;
                    data.forEach(agence => {
                        pdc = pdc + agence.science
                    });
                    let nbfuseelance = 0;
                    data.forEach(agence => {
                        nbfuseelance = nbfuseelance + agence.Launch
                    });
                    message.channel.send(EmbedMessage.showSuccess(
                        client,
                        "**Economie:**",
                        `Il y a ${money}$ sur le serveur.\n
                        Il y a ${pdc} points de science sur le serveur.\n
                        Il y a eu ${nbfuseelance} lancés au total.`,
                        message.author
                    ));
                })
            } else {
                message.channel.send(EmbedMessage.showError(
                    client,
                    "🛑 Erreur",
                    "Vous n'avez pas la permission d'executer cette commande !"
                ));
            }
        }
    },
}