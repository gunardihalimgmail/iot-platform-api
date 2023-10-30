const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const parser = sequelize.define('parsers',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    content : Sequelize.TEXT
    
}, {timestamps: false});

module.exports = parser;