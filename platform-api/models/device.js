const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const Device = sequelize.define('devices',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_device: Sequelize.STRING,
    id_category: Sequelize.INTEGER,
    name: Sequelize.STRING,
    isadmin: Sequelize.INTEGER,
    isuser: Sequelize.INTEGER,
    id_parser: Sequelize.INTEGER,
    isactive:Sequelize.INTEGER,
    token_key: Sequelize.STRING
 
}, {timestamps: false});

module.exports = Device;