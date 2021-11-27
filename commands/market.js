const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
    name: "market",
    use: "**/market**",
    description: "Vous permet de savoir le prix des choses que vous pouvez acheter.",
    options: [],
    admin: false,
    async execute (client, message, args) {
        const items = [
            { nom: "Sabotage d'une fusée", prix: 1500 },
            { nom: "Réparation d'une fusée", prix: 500, pds: 20 },
            { nom: "Fusée de tiers 1", prix: 5000, pds: 500 },
            { nom: "Fusée de tiers 2", prix: 30000, pds: 3000 },
            { nom: "Fusée de tiers 3", prix: 70000, pds: 5000 },
            { nom: "**NEW**  Fusée de tiers 4", prix: 160000, pds: 80000 },
            { nom: "**NEW**  Fusée de tiers 5", prix: 250000, pds: 125000 },
            { nom: "**NEW**  Fusée de tiers 6", prix: 400000, pds: 200000 },
            { nom: "Action chez Ariane Espace", prix: 4500 },
            { nom: "Action chez Blue Origin", prix: 10000 },
            { nom: "Action chez SpaceX", prix: 20000 },
            { nom: "**NEW**  Station Spatiale Chinoise", prix: 5000 },
            { nom: "**NEW**  Station Spatiale Internationnale", prix: 20000 },
            { nom: "**NEW**  Gateway", prix: 40000 },
            { nom: "Pas de tir en Guyane", prix: 5500 },
            { nom: "Pas de tir en Chine", prix: 6000 },
            { nom: "Pas de tir en Russie", prix: 7000 },
            { nom: "Pas de tir aux USA", prix: 7000 },
            { nom: "**NEW**  Rejoindre la guerre froide", prix: 800 }
        ];

        let content = []
        items.forEach(item => {
            if (item.pds != undefined) {
                content.push({ name: item.nom, content: item.prix + "$ et " + item.pds + " points de science" })
            } else {
                content.push({ name: item.nom, content: item.prix + "$" })
            }
        });
        return new EmbedMessage(client, {
            title: "__**Market**__",
            content,
            thumbnail: true,
            author: message.author.username
        })
    }
}
