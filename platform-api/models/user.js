const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('users', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type:Sequelize.STRING,
        unique: true
    },
    password:Sequelize.STRING,
    last_login:Sequelize.TIME,
    created:Sequelize.TIME,
    last_update:Sequelize.TIME,
    token_key:Sequelize.TEXT,
    role: Sequelize.INTEGER,
    name: Sequelize.STRING,
    priv: Sequelize.INTEGER,
    avatar:Sequelize.TEXT(32000),
    token_firebase:Sequelize.STRING,
    expired_token:Sequelize.TIME,
    
    token : Sequelize.STRING
},{timestamps: false});

module.exports = User;
