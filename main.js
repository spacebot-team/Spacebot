const fs = require("fs");
const Discord = require("discord.js");
const { TOKEN, PREFIX } = require("./config");
const EmbedMessage = require("./util/EmbedMessage");

const intents = new Discord.Intents([
    Discord.Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
]);

const bot = new Discord.Client({ ws: { intents } });
require("./util/functions")(bot);
bot.mongoose = require("./util/mongoose");
bot.commands = new Discord.Collection();
bot.commandsDisabled = []
const guildId = "804402864717824030"
const channelId = "855367538425724968"
global.staffRole = "Gestionnaire Space Bot"

loadCommands = (dir = "./commands") => {
    const commands = fs.readdirSync(`${dir}/`).filter(files => files.endsWith(".js"));

    for (const command of commands) {
        const file = require(`${dir}/${command}`);
        if (file.alias != undefined) {
            file.alias.forEach(element => {
                bot.commands.set(element, file);
            });
        }
        bot.commands.set(file.name, file);
    };
};

loadCommands();

bot.on('ready', () => {
    bot.user.setActivity("explorer l'espace");
    console.log(`${bot.user.tag} has been connected sucessfully!`);

    for (const command of bot.commands) {
        if (command.admin != true && command[1].options != undefined) {
            bot.api.applications(bot.user.id).guilds(guildId).commands.post({
                data: {
                    name: command[1].name,
                    description: command[1].description.substring(0, 97) + "...",
                    options: command[1].options
                }
            })
            console.log(command[1].name + " slash command has been posted !")
        }
    }
});

bot.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLocaleLowerCase()
    const args = interaction.data.options

    if (interaction.channel_id != channelId) return

    const channel = bot.channels.cache.find(c => c.id == interaction.channel_id)
    const guild = bot.guilds.cache.get(interaction.guild_id)
    let message = null
    await guild.members.fetch().then(members => {
        let member = members.get(interaction.member.user.id)
        if (args != undefined && args.find(a => a.type == 6) != null) {
            const mention_id = args.find(arg => arg.type == 6).value
            message = {
                guild: guild,
                channel: channel,
                member: member,
                author: member.user,
                mention: members.get(mention_id).user,
                interaction: interaction
            }
        } else {
            message = { guild: guild, channel: channel, member: member, author: member.user, interaction: interaction }
        }
    }).catch(err => { console.error(err) })

    if (bot.commandsDisabled.includes(command)) {
        bot.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    embeds: [
                        {
                            title: "**Spacebot - Erreur**",
                            description:
                                `La commande **${command}** est actuellement désactivé, veuillez réessayer ultérieurement ...`,
                            thumbnail: {
                                url: "https://i.imgur.com/J4jZEVD.png",
                            },
                            color: Discord.Constants.Colors.RED,
                        },
                    ]
                }
            }
        })
        return
    }

    const newArgs = args != undefined ? args.map(el => el.value) : []
    const result = await bot.commands.get(command).execute(bot, message, newArgs);

    bot.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: await createAPIMessage(interaction, result)
        }
    })
})

async function createAPIMessage (interaction, content) {
    const apiMessage = await Discord.APIMessage.create(bot.channels.cache.get(interaction.channel_id), content)
        .resolveData()
        .resolveFiles()
    return { ...apiMessage.data, files: apiMessage.files }
}

bot.on('message', msg => {

    if (!msg.content.startsWith(PREFIX)) return;

    const args = msg.content.slice(PREFIX.length).split(' ');
    const command = args.shift().toLocaleLowerCase();

    if (!bot.commands.has(command)) return;
    if (bot.commandsDisabled.includes(command)) {
        msg.channel.send(EmbedMessage.showError(
            bot,
            "**Spacebot - Erreur**",
            `La commande **${command}** est actuellement désactivé, veuillez réessayer ultérieurement ...`
        ))
        return;
    }
    bot.commands.get(command).execute(bot, msg, args);

    let a = bot.channels.cache.find(ch => ch.id === channelId);
    setTimeout(() => {
        a.send("**Vous avez besoin d'aide n'hésiter pas a faire /help ou d'appeler un membre du staff!!**");
    }, 14400000);
    setTimeout(() => {
        a.send("**Pour commencer a jouer faite la commande /create suivie du nom de votre agence**");
    }, 28870000);
    setTimeout(() => {
        a.send("**Faite la commande /market pour savoir le prix des chose a acheter!!**");
    }, 21600000);
});

bot.mongoose.init();
bot.login(TOKEN);
