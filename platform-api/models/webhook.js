const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const parser = sequelize.define('webhooks',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url: Sequelize.STRING,
    token_key: Sequelize.STRING
    
}, {timestamps: false});

module.exports = parser;