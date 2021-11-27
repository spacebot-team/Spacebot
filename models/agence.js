const mongoose = require("mongoose");

const agenceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    username: String,
    logo: {
        "type": String,
        "default": null
    },
    description: {
        "type": String,
        "default": null
    },
    agenceName: {
        "type": String,
        "default": null
    },
    lastWork: {
        "type": Number,
        "default": 0
    },
    lastSteal: {
        "type": Number,
        "default": 0
    },
    lastLaunchReusable: {
        "type": Number,
        "default": 0
    },
    workmax: {
        "type": Number,
        "default": 400
    },
    workmin: {
        "type": Number,
        "default": 25
    },
    Launch: {
        "type": Number,
        "default": 0
    },
    sabotage: {
        "type": Number,
        "default": 0
    },
    cash: {
        "type": Number,
        "default": 0
    },
    bank: {
        "type": Number,
        "default": 1000
    },
    science: {
        "type": Number,
        "default": 0
    },
    experience: {
        "type": Number,
        "default": 0
    },
    level: {
        "type": Number,
        "default": 0
    },
    ergol: {
        "type": Number,
        "default": 0
    },
    usineErgol1: {
        "type": Number,
        "default": 0
    },
    usineErgol2: {
        "type": Number,
        "default": 0
    },
    usineErgol3: {
        "type": Number,
        "default": 0
    },
    lastErgol: {
        "type": Number,
        "default": 0
    },
    spacexniv1: {
        "type": Number,
        "default": 0
    },
    blueoriginniv1: {
        "type": Number,
        "default": 0
    },
    arianeespaceniv1: {
        "type": Number,
        "default": 0
    },
    spacexniv2: {
        "type": Number,
        "default": 0
    },
    blueoriginniv2: {
        "type": Number,
        "default": 0
    },
    arianeespaceniv2: {
        "type": Number,
        "default": 0
    },
    lastpart: {
        "type": Number,
        "default": 0
    },
    RussieJoin: {
        "type": Number,
        "default": 0
    },
    USAJoin: {
        "type": Number,
        "default": 0
    },
    iss: {
        "type": Number,
        "default": 0
    },
    css: {
        "type": Number,
        "default": 0
    },
    gateway: {
        "type": Number,
        "default": 0
    },
    lastRecherche: {
        "type": Number,
        "default": 0
    },
    bourse1: {
        "type": String,
        "default": null,
    },
    bourse2: {
        "type": String,
        "default": null,
    },
    bourse3: {
        "type": String,
        "default": null,
    },
    enbourse: {
        "type": Number,
        "default": 0,
    },
    pointdebourse: {
        "type": Number,
        "default": 0,
    },
    lastbourse:{
        "type": Number,
        "default": 0
    },
    lastnoel:{
        "type": Number,
        "default": 0
    },
    tiersdebloquer:{
        "type": Number,
        "default": 0
    },
    actiondebloque:{
        "type": Number,
        "default": 0
    },
    ergolniv1deboquer:{
        "type": Number,
        "default": 0
    },
    ergolniv2deboquer:{
        "type": Number,
        "default": 0
    },
    ergolniv3deboquer:{
        "type": Number,
        "default": 0
    },
    gatewaydebloquer:{
        "type": Number,
        "default": 0
    },
    issdebloquer:{
        "type": Number,
        "default": 0
    },
    cssdebloquer:{
        "type": Number,
        "default": 0
    },
});

module.exports = mongoose.model("Agence", agenceSchema);
