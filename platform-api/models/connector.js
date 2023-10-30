const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const connector= sequelize.define('connectors',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    token_key: Sequelize.STRING,
    description:Sequelize.STRING,
    type : Sequelize.STRING,
    name: Sequelize.STRING,
    username: Sequelize.STRING,
    recipient: Sequelize.STRING,
    updated: Sequelize.TIME,
    password: Sequelize.STRING

}, {timestamps: false});

module.exports = connector;