const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
    name: "work",
    use: "**/work**",
    description: "Vous permet toutes les 4 heures de gagner de l'argent et des points de science.",
    alias: ["travail"],
    options: [],
    admin: false,
    async execute (client, message, args) {
        if (await AgenceManager.targetExists(message.author.id)) {
            let data = await AgenceManager.getOneByUserID(message.author.id)
            const time = new Date().getTime();
            if (time - data.lastWork < 14400000) {
                let remainingTime = data.lastWork - time + 14400000;
                let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                let secondes = Math.floor((remainingTime % (1000 * 60)) / (1000));
                return new EmbedMessage(client, {
                    title: "**Work :**",
                    description: `Il faut attendre ${hours} heures ${minutes} minutes ${secondes} secondes avant de pouvoir executer la commande de nouveau.`,
                    author: message.author.username
                })
            } else {
                const sciencePoints = parseInt(Math.random() *(150 - 50)+ 50);
                const money = parseInt(Math.random() * ((data.workmax) - (data.workmin)) + (data.workmin));
                const xp = parseInt(Math.random()* (100 -  10) + 10);
                
                Agence.findOneAndUpdate({ userID: message.author.id }, {
                    cash: data.cash + money,
                    science: data.science + sciencePoints,
                    experience: data.experience + xp,
                    lastWork: time
                }).catch(err => { console.error(err) })
                return EmbedMessage.showSuccess(
                    client,
                    "Succès",
                    `Vous venez de gagner **${money}$** et **${sciencePoints}** points de science !`,
                    message.author
                )
            }
        } else {
            return EmbedMessage.anyAgenceError(client, message.author)
        }
    }
}
