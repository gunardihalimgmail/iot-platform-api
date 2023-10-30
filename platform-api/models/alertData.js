const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const AlertData = sequelize.define('alert_data',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_device: Sequelize.STRING,
    data_key: Sequelize.STRING,
    value: Sequelize.STRING,
    timestamp: Sequelize.TIME,
    event_count: Sequelize.INTEGER,
    token_key: Sequelize.STRING
}, {timestamps: false});

module.exports = AlertData;