const mongoose = require("mongoose");
const { Agence } = require("../models/agence");
const { MessageEmbed } = require("discord.js");
const fs = require("fs");

module.exports = bot => {
    bot.createAgence = async user => {
        const merged = Object.assign({ _id: mongoose.Types.ObjectId() }, user);
        const createAgence = await new Agence(merged);
        createAgence.save().then(u => console.log(`${u.username} a créé une agence`));
    };

    bot.updateAgence = async (user, settings) => {
        let data = await bot.getUser(user);
        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
        };
    };

    bot.SaveMeteo = () => {
        fs.writeFile("./meteo.json", JSON.stringify(meteo, null, 4), (err) => {
            if (err) message.channel.send("Une erreur est survenue(meteo).");
        });
    };

    bot.random_meteo = () => {
        meteo["meteo"]["meteo_USA"] = parseInt(meteo["meteo"]["meteo_USA"]) + parseInt(Math.floor(Math.random() * (2 - (-2)) + (-2)));
        meteo["meteo"]["meteo_RUSSIE"] = parseInt(meteo["meteo"]["meteo_RUSSIE"]) + parseInt(Math.floor(Math.random() * (2 - (-2)) + (-2)));
        meteo["meteo"]["meteo_CHINE"] = parseInt(meteo["meteo"]["meteo_CHINE"]) + parseInt(Math.floor(Math.random() * (2 - (-2)) + (-2)));
        meteo["meteo"]["meteo_GUYANE"] = parseInt(meteo["meteo"]["meteo_GUYANE"]) + parseInt(Math.floor(Math.random() * (2 - (-2)) + (-2)));
        Savemeteo();
    };
};
