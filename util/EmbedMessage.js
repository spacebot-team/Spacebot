const Discord = require("discord.js");

class EmbedMessage extends Discord.MessageEmbed {
    constructor(client, args) {
        super();
        this.client = client;
        if (args != null) {
            if (args.title !== undefined) {
                this.setTitle(args.title);
            }
            if (args.titleLink !== undefined) {
                this.setURL(args.titleLink);
            }
            if (args.author !== undefined) {
                this.setAuthor(args.author);
            }
            if (args.description !== undefined) {
                this.setDescription(args.description);
            }
            if (args.content !== undefined) {
                this.addField('\u200B', '\u200B')
                args.content.forEach(line => {
                    this.addField(line.name, line.content);
                });
                this.addField('\u200B', '\u200B')
            }
            if (args.thumbnail !== undefined && args.thumbnail != false) {
                this.setThumbnail("https://cdn.discordapp.com/attachments/809346706986631208/809351393831026708/unknown.png");
            }
            if (args.image !== undefined) {
                this.setImage(args.image);
            }
            if (args.color !== undefined) {
                this.setColor(args.color);
            } else {
                this.setColor("#4b3efe");
            }
        } else {
            this.setTitle("⛔ Error");
            this.setDescription("An error has occurred. Please contact bot administrator.");
        }

        this.setTimestamp()
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL());
    }

    static showError (client, title, desc) {
        return new EmbedMessage(client, {
            title: title,
            description: desc,
            color: "#e74c3c",
            thumbnail: true
        });
    }

    static showSuccess (client, title, desc, author) {
        return new EmbedMessage(client, {
            title: title,
            description: desc,
            color: "#4b3efe",
            author: author.username,
            thumbnail: true
        })
    }

    static anyAgenceError (client, author) {
        return new EmbedMessage(client, {
            title: "Erreur - Aucune agence",
            description: "Pour executer cette action, vous devez avoir une agence. Pour en créer une, tapez **!create** !",
            color: "#e74c3c",
            author: author.username,
            thumbnail: true
        });
    }
}

module.exports = EmbedMessage;
