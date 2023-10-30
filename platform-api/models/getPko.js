const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const geoLoc = sequelize.define('Ms_Berat_Jenis_PKOs',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    temperature: Sequelize.INTEGER,
    berat_jenis: Sequelize.FLOAT
    
}, {timestamps: false});

module.exports = geoLoc;