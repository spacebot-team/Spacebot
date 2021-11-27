const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");

module.exports = {
  name: "recherche",
  use: "**/recherche [ISS / CSS / Gateway (optionnel)]**",
  description: "Permet de récolter / acheter vos recherches journalières dans une station spatiale",
  options: [
    {
      name: "entreprise",
      description: "Nom de l'entreprise dans laquelle vous achetez une recherche",
      type: 3,
      choices: [
        { name: "Gateway", value: "gateway" },
        { name: "Station Spatiale Internationnale", value: "iss" },
        { name: "Station Spatiale Chinoise", value: "css" },
      ],
      required: false
    }
  ],
  admin: false,
  async execute (client, message, args) {
    const time = new Date().getTime();
    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      if (args.length == 0) {
        if (data.gateway === 0 && data.iss === 0 && data.css === 0) {
          return new EmbedMessage(client, {
            title: "**Recherche:**",
            description: "tu n'a aucune recherche dans une station.",
            author: message.author.username
          })
        } else {
          if (time - data.lastRecherche < 28800000) {
            let reainingTime = data.lastRecherche - time + 28800000
            let hours = Math.floor((reainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((reainingTime % (1000 * 60 * 60)) / (1000 * 60));
            let secondes = Math.floor((reainingTime % (1000 * 60)) / (1000));
            return new EmbedMessage(client, {
              title: "**Recherche:**",
              description: `Il faut attendre ${hours} heures ${minutes} minutes ${secondes} secondes avant de pouvoir executer la commande de nouveau`,
              author: message.author.username
            })
          } else {
            let argentwin = 0;
            let description = "";
            if (data.gateway === 1) {
              argentwin = 1250 + argentwin;
              description = description + "\nVous venez de recevoir vos point de science grâce a la station Gateway."
            };
            if (data.iss === 1) {
              argentwin = 600 + argentwin;
              description = description + "\nVous venez de recevoir vos point de science grâce a l'ISS."
            };
            if (data.css === 1) {
              argentwin = 150 + argentwin;
              description = description + "\nVous venez de recevoir vos point de science grâce a l'CSS."
            };
            scienceUpdated = data.science + argentwin
            Agence.findOneAndUpdate({ userID: message.author.id },
              { science: scienceUpdated, lastRecherche: time }).catch(err => { console.error(err) })
            return EmbedMessage.showSuccess(
              client,
              "**Recherche:**",
              description,
              message.author
            )
          }
        }
      } else {
        let entrepriseName = '';
        let dataToUpdate = null;
        let RechercheCost = null;
        let error = false;
        switch (args[0]) {
          case "css":
            entrepriseName = "Station Spatiale Chinoise"
            RechercheCost = 5000
            if(data.cssdebloquer === 1){
              if (data.css == 1) {
                return this.alreadyHaveRechercheError(client, message, entrepriseName)
              } else {
                if (data.cash < RechercheCost) {
                  return this.notEnoughMoneyError(client, message)
                } else {
                  dataToUpdate = { cash: data.cash - RechercheCost, css: 1, experience: data.experience + 500 }
                }
              }
            }else{
              return this.notechnohave(client, message, entrepriseName)
            }
            break;
          case "iss":
            entrepriseName = "Station Spatiale Internationnale"
            RechercheCost = 20000
            if(data.issdebloquer === 1){
              if (data.iss == 1) {
                return this.alreadyHaveRechercheError(client, message, entrepriseName)
              } else {
                if (data.cash < RechercheCost) {
                  return this.notEnoughMoneyError(client, message)
                } else {
                  dataToUpdate = { cash: data.cash - RechercheCost, iss: 1, experience: data.experience + 850 }
                }
              }
            }else{
              return this.notechnohave(client, message, entrepriseName)
            }
            break;
          case "gateway":
            entrepriseName = "Gateway"
            RechercheCost = 40000
            if(data.gatewaydebloquer === 1){
              if (data.gateway == 1) {
                return this.alreadyHaveRechercheError(client, message, entrepriseName)
              } else {
                if (data.cash < RechercheCost) {
                  return this.notEnoughMoneyError(client, message)
                } else {
                  dataToUpdate = { cash: data.cash - RechercheCost, gateway: 1, experience: data.experience + 1800 }
                }
              }
            }else{
              return this.notechnohave(client, message, entrepriseName)
            }
            break;
        }

        if (!error) {
          Agence.findOneAndUpdate({ userID: message.author.id }, dataToUpdate).catch(err => { console.error(err) })

          AgenceManager.evaluateLevel(data, client, message)

          return EmbedMessage.showSuccess(
            client,
            "**Recherche:**",
            `Bravo, tu viens d'acheter des Recherches dans la station **${entrepriseName}** contre **${RechercheCost}$** !`,
            message.author
          )
        }
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  },

  notEnoughMoneyError (client, message) {
    return new EmbedMessage(client, {
      title: "**Recherche:**",
      description: "Tu n'as pas assez d'argent pour acheter celà  !",
      author: message.author.username
    })
  },
  alreadyHaveRechercheError (client, message, stationName) {
    return new EmbedMessage(client, {
      title: "**Recherche:**",
      description: `Tu as déjà acheté des Recherches dans la station **${stationName}** !`,
      author: message.author.username
    })
  },
  notechnohave(client, message, technologie){
    return new EmbedMessage(client, {
      title: "**Recherche:**",
      description: `Tu n'a pas débloqué cette technologie: **${technologie}** !`,
      author: message.author.username
    })
  }
}