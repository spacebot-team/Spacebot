const Agence = require("../models/agence");
const EmbedMessage = require("./EmbedMessage");
const GuerreManager = require("../util/GuerreManager");
const Discord = require("discord.js");

class AgenceManager {

  static async targetExists (userID) {
    let result = await Agence.exists({ userID })
      .then(doc => {
        return doc
      }).catch(err => {
        console.error(err)
      })
    return result
  }

  static getOneByUserID (userID) {
    let result = Agence.findOne({ userID })
      .then(agence => {
        return agence
      }).catch(err => {
        console.error(err)
      })
    return result
  }

  static evaluateLevel (agence, client, message) {
    let NiveauUpdate = parseInt(agence.level);
    let workminUpdate = parseInt(agence.workmin);
    let workmaxUpdate = parseInt(agence.workmax);
    if ((Math.exp(((agence.level) + 1) / 1.7) - 0.8) * 100 <= agence.experience) {
      NiveauUpdate = NiveauUpdate + 1;
      workminUpdate = workminUpdate + 50;
      workmaxUpdate = workmaxUpdate + 100;
      Agence.findOneAndUpdate({ userID: message.author.id },
        { workmax: workmaxUpdate, workmin: workminUpdate, level: NiveauUpdate },
        function (err, data) {
          if (err) {
            console.error(err)
          } else {
            message.channel.send(EmbedMessage.showSuccess(
              client,
              "**Info**",
              `Bravo, vous venez de passer niveau ${data.level + 1}`,
              message.author
            ))
          }
        }
      )
    }
  }

  static makeAgenceLaunch (client, message, data, reusableTiers, typeTiers, localisation) {
    setTimeout(() => {
      message.channel.send("**3**")
      setTimeout(() => {
        message.channel.send("**2**")
        setTimeout(() => {
          message.channel.send("**1**")
          setTimeout(() => {
            let boom = Math.floor(Math.random() * 20 + 1)
            if (boom === 8) {
              message.channel.send(new EmbedMessage(client, {
                title: "**Launch - Echec**",
                description: `**Ta fusée vient d'exploser en vol !**`,
                author: message.author.username,
                thumbnail: true,
                image: "https://media.giphy.com/media/tyttpH524O4pGJx8JWg/giphy.gif"
              }))
            } else {
              let Updated = parseInt(data.Launch) + 1;
              Agence.findOneAndUpdate({ userID: message.author.id },
                { Launch: Updated }).catch(err => { console.error(err) })

              message.channel.send(new EmbedMessage(client, {
                title: "**Launch - Succès !**",
                description: `**Ta fusée vient d'atteindre l'orbite avec succès !**`,
                author: message.author.username,
                thumbnail: true,
                image: "https://media.giphy.com/media/mi6DsSSNKDbUY/giphy.gif"
              }))

              let participedToGuerreFroide = null
              if (data.USAJoin == 1 && localisation == "USA") {
                participedToGuerreFroide = GuerreManager.participer(typeTiers, "USA")
              }
              if (data.RussieJoin == 1 && localisation == "Russie") {
                participedToGuerreFroide = GuerreManager.participer(typeTiers, "Russie")
              }
              if (participedToGuerreFroide != null) {
                message.channel.send(EmbedMessage.showSuccess(
                  client,
                  "**Guerre Froide - Succès**",
                  `Bravo, vous venez d'accorder de nouveaux points à votre équipe !`,
                  message.author
                ))
              }
              if (typeTiers === "t1") {
                Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (1500 - 1000) + 1000)) }).catch(err => { console.error(err) })
              } else if (typeTiers === "t2") {
                Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (8500 - 7500) + 7500)) }).catch(err => { console.error(err) })
              } else if (typeTiers === "t3") {
                Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (21000 - 19000) + 19000)) }).catch(err => { console.error(err) })
              }
              if (reusableTiers.includes(typeTiers)) {
                message.channel.send(new EmbedMessage(client, {
                  title: "**Launch**",
                  description: `**Désorbitation en cours ...**`,
                  author: message.author.username
                }));
                setTimeout(() => {
                  let boom = Math.floor(Math.random() * 20 + 1)
                  let luck = []
                  if (typeTiers === "t4") {
                    luck = [2, 7, 10, 12, 15, 20]
                  } else if (typeTiers === "t5") {
                    luck = [5, 10, 15, 20]
                  } else if (typeTiers === "t6") {
                    luck = [5, 15]
                  }
                  if (luck.includes(boom)) {
                    message.channel.send(new EmbedMessage(client, {
                      title: "**Launch - Echec**",
                      description: `**Ta fusée vient d'exploser en atterrissant !**`,
                      author: message.author.username,
                      thumbnail: true,
                      image: "https://media1.tenor.com/images/caa01601c49a179f61f6f8c0662822ae/tenor.gif?itemid=20209825"
                    }))
                  } else {
                    if (typeTiers === "t4") {
                      Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (50000 - 54000) + 54000)) }).catch(err => { console.error(err) })
                    } else if (typeTiers === "t5") {
                      Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (88000 - 92000) + 92000)) }).catch(err => { console.error(err) })
                    } else if (typeTiers === "t6") {
                      Agence.findOneAndUpdate({ userID: message.author.id }, { experience: data.experience + (parseInt(Math.random() * (158000 - 162000) + 162000)) }).catch(err => { console.error(err) })
                    }
                    let dataUpdate = []
                    dataUpdate[typeTiers + "" + localisation.toUpperCase()] = parseInt(data.get(typeTiers + "" + localisation.toUpperCase()))
                    dataUpdate["pdt" + localisation.toUpperCase() + "dispo"] = parseInt(data.get("pdt" + localisation.toUpperCase() + "dispo"))
                    Agence.findOneAndUpdate({ userID: message.author.id },
                      Object.assign({}, dataUpdate))
                      .catch(err => console.error(err))
                    message.channel.send(new EmbedMessage(client, {
                      title: "**Launch - Succès**",
                      description: `**Ta fusée vient d'atterrir avec succès !**`,
                      author: message.author.username,
                      thumbnail: true,
                      image: "https://media1.tenor.com/images/63c4da9195fc30bda5a6e77b22916c2d/tenor.gif?itemid=21547821"
                    }))
                  }
                }, 15000);
              }
            }
          }, 15000);
        }, 1000);
      }, 1000);
    }, 1000);
    AgenceManager.evaluateLevel(data, client, message)
  }

  static waitDescriptionMessage (client, message) {
    const collector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { time: 10000 });
    collector.on('collect', message => {
      Agence.findOneAndUpdate({ userID: message.author.id }, { description: message.content })
        .catch(err => { console.error(err) })
      message.channel.send(EmbedMessage.showSuccess(
        client,
        "Succès",
        `La description de votre agence a été changée par : ${message.content}`,
        message.author
      ))
    })
  }
}

module.exports = AgenceManager;
