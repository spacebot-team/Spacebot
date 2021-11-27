const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const { updateMeteoAuto } = require("../managers/MeteoManager");
const MeteoManager = require("../managers/MeteoManager");
const RocketManager = require("../managers/RocketManager");
const PasDeTirManager = require("../managers/PasDeTirManager");
const Agence = require("../models/agence");

module.exports = {
  name: "launch",
  use: "**/launch [fusée] [pas de tir]**",
  description: "Permet de lancer une fusée spécifique sur un pas de tir ciblé.",
  options: [
    {
      name: "fusée",
      description: "Nom de la fusée à lancer",
      type: 3,
      required: true
    },
    {
      name: "pdt",
      description: "Pas de tir sur lequel lancer la fusée",
      type: 3,
      required: true
    },
  ],
  admin: false,
  async execute (client, message, args) {
    const reusableTiers = ["t4", "t5", "t6"]
    const ergolTiers = {
      "t1": { quantity: 0 },
      "t2": { quantity: 0 },
      "t3": { quantity: 0 },
      "t4": { quantity: 1200 },
      "t5": { quantity: 1700 },
      "t6": { quantity: 2300 }
    }
    updateMeteoAuto()

    if (await AgenceManager.targetExists(message.author.id)) {
      let data = await AgenceManager.getOneByUserID(message.author.id)
      let rocketName = args[0]
      let pdtName = args[1]
      if (rocketName != undefined && pdtName != undefined) {
        if (await RocketManager.rocketExists(message.author.id, rocketName)) {
          let rocket = await RocketManager.getRocketByUserIDAndName(message.author.id, rocketName)
          if (await PasDeTirManager.pdtExists(message.author.id, pdtName)) {
            let pdt = await PasDeTirManager.getPdtByUserIdAndName(message.author.id, pdtName)
            if (rocket.location === pdt.location) {
              let meteoData = await MeteoManager.getMeteo(pdt.location);
              let meteo = meteoData.libelle
              if (meteo !== "de l'orage" && meteo !== "une forte pluie" && meteo !== "un problème non détecté" && meteo !== "une personne dans la zone de sécurité" && meteo !== "un bateau dans la zone de sécurité" && meteo !== "un fort vent" && meteo !== "un avion dans la zone de sécurité") {
                if (data.sabotage === 0) {
                  if (reusableTiers.includes(rocket.type.replace("tiers", "t"))) {
                    const time = new Date().getTime();
                    let remainingTime = rocket.lastLaunch - time + 43200000;
                    if (remainingTime < 0) {
                      if (data.ergol >= ergolTiers[new String(rocket.type).replace("tiers", "t")].quantity) {
                        Agence.findOneAndUpdate({ userID: message.author.id }, { ergol: data.ergol - ergolTiers[new String(rocket.type).replace("tiers", "t")].quantity }).catch(err => { console.error(err) })
                      } else {
                        return EmbedMessage.showError(client, "**Launch - Erreur**", `Il vous manque **${ergolTiers[new String(rocket.type).replace("tiers", "t")].quantity - data.ergol} tonnes** d'ergol pour lancer votre fusée !`)
                      }
                      RocketManager.updateRocketReusableLastLaunch(message.author.id, rocketName, time)
                    } else {
                      let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                      let secondes = Math.floor((remainingTime % (1000 * 60)) / (1000));
                      return new EmbedMessage(client, {
                        title: "**Launch**",
                        description: `Il faut attendre ${hours} heures ${minutes} minutes ${secondes} secondes avant de pouvoir relancer votre fusée **${rocket.name}**.`,
                        author: message.author.username
                      })
                    }
                  }

                  AgenceManager.makeAgenceLaunch(client, message, data, reusableTiers, rocket, pdt)

                  if (rocket.image == null) {
                    return new EmbedMessage(client, {
                      title: "**Launch**",
                      description: `Préparation de ta fusée **${rocket.name}** de **tiers ${rocket.type.replace("tiers", "")}** !`,
                      author: message.author.username
                    })
                  } else {
                    return new EmbedMessage(client, {
                      title: "**Launch**",
                      description: `Préparation de ta fusée **${rocket.name}** de **tiers ${rocket.type.replace("tiers", "")}** !`,
                      author: message.author.username,
                      image: rocket.image
                    })
                  }
                } else {
                  return new EmbedMessage(client, {
                    title: "**launch:**",
                    description: `Ta fusée est sabotée. \n Utilises la commande: /repare pour la réparer !`,
                    author: message.author.username,
                  })
                }
              } else {
                return EmbedMessage.showError(client, "**Launch - Erreur**", `Vous ne pouvez pas décoller suite à la météo !`)
              }
            } else {
              return EmbedMessage.showError(client, "**Launch - Erreur**", `La fusée et le pas de tir ciblé ne sont pas localisés au même endroit !`)
            }
          } else {
            return EmbedMessage.showError(client, "**Launch - Erreur**", `Tu ne possèdes pas de pas de tir au nom de **${pdtName}** !`)
          }
        } else {
          return EmbedMessage.showError(client, "**Launch - Erreur**", `Tu ne possèdes pas de fusée au nom de **${rocketName}** !`)
        }
      } else {
        return EmbedMessage.showError(client, "**Launch - Erreur**", `Merci d'utiliser la commande launch comme ceci : **${this.use}**`)
      }
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }
  }
}
