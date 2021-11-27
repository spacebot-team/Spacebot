const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");

module.exports = {
  name: "leaderboard",
  use: '**/leaderboard [experience / bank / cash]**',
  description: 'Afficher le tableau des meilleurs joueurs',
  options: [
    {
      name: "type",
      description: "Type de leaderboard que vous souhaitez voir",
      type: 3,
      choices: [
        { name: "Argent", value: "money" },
        { name: "Niveau", value: "level" },
        { name: "Lancements", value: "Launch" },
        { name: "Points de science", value: "science" }
      ],
      required: true
    }
  ],
  admin: false,
  async execute (client, message, args) {
    if (args.length == 1) {
      const filter = args[0]
      if (filter == 'money' || filter == 'level' || filter == 'Launch' || filter == 'science') {
        let result = null
        let lines = null
        if (filter == 'money') {
          lines = await Agence.find({}).then(data => {
            let lines = []
            let tmp = data.sort(function (a, b) { return (b.bank + b.cash) - (a.bank + a.cash) }).slice(0, 10)
            for (const agence of tmp) {
              let content = agence.agenceName + ` - ${agence.bank + agence.cash}$`
              lines.push({
                name: agence.username,
                content
              })
            }
            return lines
          })
        } else {
          lines = await Agence.find({}).sort([[filter, 'desc']]).limit(10).then(data => {
            let lines = []
            for (const agence of data) {
              let content = ''
              let lastXp = ((Math.exp(((agence.level) + 1) / 1.7) - 0.8) * 100) - agence.experience
              switch (filter) {
                case 'level':
                  content = agence.agenceName + ' - Level ' + agence.get(filter) + ` (Reste ${lastXp} XP pour être niveau ${agence.level + 1})`
                  break;
                case 'bank':
                case 'cash':
                  content = agence.agenceName + ' - ' + agence.get(filter) + `$`
                  break;
                case 'Launch':
                  content = agence.agenceName + ' - ' + agence.get(filter) + ` lancements`
                  break;
                case 'science':
                  content = agence.agenceName + ' - ' + agence.get(filter) + ' points de science'
                  break;
              }
              lines.push({
                name: agence.username,
                content
              })
            }
            return lines
          }).catch(err => { console.error(err) })
        }

        result = new EmbedMessage(client, {
          title: 'Leaderboard - ' + this.options[0].choices.find(c => c.value == filter).name,
          content: lines,
          thumbnail: true
        })
        return result
      } else {
        return EmbedMessage.showError(
          client,
          "Erreur",
          `Vous devez utiliser la commande /leaderboard comme ceci : /leaderboard <experience | level | cash | bank>`,
          message.author
        )
      }
    } else {
      return EmbedMessage.showError(
        client,
        "Erreur",
        `Vous devez utiliser la commande /leaderboard comme ceci : /leaderboard <experience | cash | bank>`,
        message.author
      )
    }
  }
}