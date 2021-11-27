module.exports = {
    name: "ping",
    use: "**/ping**",
    description: "Obtenir le temps de latence du bot.",
    admin: false,
    execute (client, message, args) {
        message.channel.send(":ping_pong: Pong!");
        message.channel.send("Calcul en cours...").then(message2 => {
            setTimeout(() => {
                message2.edit("Temps de réponse : **" + `${message2.createdTimestamp - message.createdTimestamp}ms` + "**");
            }, 1000);
        });
    }
}