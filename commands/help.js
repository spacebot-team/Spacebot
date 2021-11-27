const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
    name: "help",
    use: "**/help**",
    description: "Obtenir de l'aide sur les différentes commandes du bot.",
    options: [
        {
            name: "type",
            description: "Voir les commandes staff",
            type: 3,
            choices: [
                { name: "Staff", value: "staff" }
            ]
        }
    ],
    admin: false,
    async execute (client, message, args) {
        let commands = [];
        let commandsChecked = []
        if (args[0] === "staff" && message.member.roles.cache.find(r => r.name == "Gestionnaire Space Bot") != null) {
            client.commands.forEach(command => {
                if (!commandsChecked.includes(command.name)) {
                    if (command.admin) {
                        let desc = ''
                        if (command.alias != undefined && command.alias.length > 0) {
                            desc = "Alias : " + command.alias.join(", ") + "\n" + command.description
                        } else {
                            desc = command.description
                        }
                        commands.push({ name: command.use, content: desc });
                    }
                    commandsChecked.push(command.name)
                }
            });
        } else {
            client.commands.forEach(command => {
                if (!commandsChecked.includes(command.name)) {
                    if (!command.admin) {
                        let desc = ''
                        if (command.alias != undefined && command.alias.length > 0) {
                            desc = "Alias : " + command.alias.join(", ") + "\n" + command.description
                        } else {
                            desc = command.description
                        }
                        commands.push({ name: command.use, content: desc });
                    }
                    commandsChecked.push(command.name)
                }
            });
        }
        return new EmbedMessage(client, {
            title: "__**Aide:**__",
            content: commands,
            thumbnail: true,
            author: message.author.username,
        })
    }
}
