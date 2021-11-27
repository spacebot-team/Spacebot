const EmbedMessage = require("../util/EmbedMessage");
const MeteoManager = require("../managers/MeteoManager");

module.exports = {
    name: "meteo",
    use: "**/meteo**",
    description: "Obtenir la météo du moment pour différents pays.",
    options: [],
    admin: false,
    async execute (client, message, args) {
        await MeteoManager.initAllMeteos()
        await MeteoManager.updateMeteoAuto()
        let meteos = await MeteoManager.getAllMeteos()

        let content = []
        meteos.forEach(element => {
            content.push({ name: element.pays, content: element.libelle })
        });

        return new EmbedMessage(client, {
            title: "**Météo du moment : **",
            content,
            thumbnail: true
        })
    }
}
