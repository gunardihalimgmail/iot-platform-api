const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const alert = sequelize.define('alerts',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_device: Sequelize.STRING,
    id_connector : Sequelize.INTEGER,
    data_key: Sequelize.STRING,
    updated: Sequelize.TIME,
    token_key: Sequelize.STRING,
   
    min_value : Sequelize.STRING,
    max_value : Sequelize.STRING,
    custom_message : Sequelize.STRING,
    is_active : Sequelize.INTEGER,
    last_triggered : Sequelize.TIME,
    token_key: Sequelize.STRING,
    type : Sequelize.STRING

}, {timestamps: false});

module.exports = alert;