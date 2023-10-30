const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const Message = sequelize.define('messages',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_device: Sequelize.STRING,
    token_key: Sequelize.STRING,
    time: Sequelize.TIME,
    seq: Sequelize.INTEGER,
    data: Sequelize.STRING,
    id_reception: Sequelize.STRING,
    rssi: Sequelize.STRING,
    snr: Sequelize.STRING,
  
}, {timestamps: false});

module.exports = Message;
