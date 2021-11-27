const GuerreFroide = require("../models/guerreFroide");

class GuerreManager {
  static async getCurrentGuerre () {
    const date = new Date()
    let result = await GuerreFroide.findOne({ dateStart: { $lte: date }, dateStop: { $gte: date }, archive: 0 })
      .then(guerre => { return guerre })
      .catch(err => { console.error(err) })
    return result
  }

  static async participer (tiers, camps) {
    let result = 0
    if (tiers == "t1") {
      result = 1
    }
    if (tiers == "t2") {
      result = 3
    }
    if (tiers == "t3") {
      result = 7
    }
    const guerre = await GuerreManager.getCurrentGuerre()
    const date = new Date()
    const dataToUpdate = camps == "USA" ? { USAQuantity: guerre.USAQuantity + result } : { RussieQuantity: guerre.RussieQuantity + result }
    await GuerreFroide.findOneAndUpdate({ dateStart: { $lte: date }, dateStop: { $gt: date }, archive: 0 }, dataToUpdate)
      .then(() => { return result })
      .catch(err => { console.error(err) })
  }

  static async terminerGuerre () {
    const date = new Date()
    await GuerreFroide.findOneAndUpdate({ dateStart: { $lte: date }, dateStop: { $gt: date }, archive: 0 }, { archive: 1 })
      .catch(err => { console.error(err) })
  }
}

module.exports = GuerreManager