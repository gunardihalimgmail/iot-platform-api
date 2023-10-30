const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const parser = sequelize.define('dashboards',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    created_time: Sequelize.TIME,
    description: Sequelize.STRING,
    token_key: Sequelize.STRING
    
}, {timestamps: false});

module.exports = parser;