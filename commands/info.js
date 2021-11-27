const Agence = require("../models/agence");
const EmbedMessage = require("../util/EmbedMessage");
const AgenceManager = require("../managers/AgenceManager");
const PasDeTirManager = require("../managers/PasDeTirManager");

module.exports = {
  name: "info",
  use: "**/info [@joueur (optionnel)]**",
  description: "Vous donne toutes les infos de vous et votre agence.",
  options: [
    {
      name: "joueur",
      description: "Joueur que vous ciblez",
      type: 6,
      required: false
    }
  ],
  admin: false,
  async execute (client, message, args) {

    let member = message.mention
    let data = null
    let memberId = member ? member.id : message.author.id

    if (await AgenceManager.targetExists(memberId)) {
      data = await AgenceManager.getOneByUserID(memberId)
    } else {
      return EmbedMessage.anyAgenceError(client, message.author)
    }

    console.log(data.experience + (data.experience * 0.35))

    await AgenceManager.evaluateLevel(data, client, message)
    let name = data.agenceName == null ? "Aucun nom" : data.agenceName
    let description = data.description == null ? "Aucune description" : data.description
    let texte = `**:card_box: Nom de l'agence** : ${name}\n`
    texte = texte + `**:moneybag: Banque** : ${data.bank}$ \n`
    texte = texte + `**:money_with_wings: En poche** : ${data.cash}$ \n`
    texte = texte + `**:alembic: Points de science** : ${data.science} \n`
    texte = texte + `**:rocket: Lancements réussis** : ${data.Launch} \n`
    texte = texte + `**:oil: Ergol** : ${data.ergol} tonnes\n`
    texte = texte + `**:nerd: Niveau ${data.level}**\n\n`;


    const localisations = ["USA", "Chine", "Russie", "Guyane"]
    texte = texte + "**:construction_site: Pas de tirs :**\n\n"
    for (const localisation of localisations) {
      let items = await PasDeTirManager.getPdtByUserIdAndLocation(memberId, localisation);
      if (items.length > 0) {
        texte = texte + `**${localisation}** - ${items.filter(i => i.available == true).length}/${items.length} disponibles\n`
      } else {
        texte = texte + `**${localisation}** - Aucun pas de tir acheté\n`
      }
    }
    texte = texte + "\n**:coin: bourse:**\n\n"
    
    if(data.bourse1 === null){
      texte = texte + "**bourse 1** - aucun \n"
    }else{
      data2 = await AgenceManager.getOneByUserID(data.bourse1)
      texte = texte + `**bourse 1** - ${data2.username} \n`
    }
    if(data.bourse2 === null){
      texte = texte + "**bourse 2** - aucun \n"
    }else{
      data3 = await AgenceManager.getOneByUserID(data.bourse2)
      console.log(data.bourse2)
      texte = texte + `**bourse 2** - ${data3.username} \n`
    }
    if(data.bourse3 === null){
      texte = texte + "**bourse 3** - aucun \n"
    }else{
      data4 = await AgenceManager.getOneByUserID(data.bourse3)
      texte = texte + `**bourse 3** - ${data4.username} \n`
    }
    texte = texte + `\n**:scroll: Description : **\n${description}\n\n`


    if (data.logo == null) {
      return new EmbedMessage(client, {
        title: `**Informations générales de ${data.username}:**`,
        description: texte,
        author: message.author.username,
        thumbnail: true
      })
    } else {
      return new EmbedMessage(client, {
        title: `**Informations générales de ${data.username} :**`,
        description: texte,
        author: message.author.username,
        image: data.logo,
        thumbnail: true
      })
    }
  }
}
