const Sequelize = require('sequelize');
const sequelize = require('../util/database.js');
const List_dev = sequelize.define('list_dev',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    barcode: Sequelize.STRING,
    id_device: Sequelize.STRING,
    }, {timestamps: false});

module.exports = List_dev;