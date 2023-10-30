const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const parser = sequelize.define('downlinks',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_device: Sequelize.STRING,
    data: Sequelize.STRING,
    tipe : Sequelize.STRING,
    access_key: Sequelize.STRING,
    application_name: Sequelize.STRING,
    device_name:Sequelize.STRING,
    email: Sequelize.STRING
    
}, {timestamps: false});

module.exports = parser;