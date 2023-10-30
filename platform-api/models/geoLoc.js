const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const geoLoc = sequelize.define('geolocs',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_device: Sequelize.STRING,
    time: Sequelize.TIME,
    lat: Sequelize.STRING,
    token_key : Sequelize.STRING,
    longitude: Sequelize.STRING,
    
}, {timestamps: false});

module.exports = geoLoc;