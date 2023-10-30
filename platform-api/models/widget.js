const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const widget = sequelize.define('dashboard_widgets',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_dashboard:Sequelize.INTEGER,
    name: Sequelize.STRING,
    width: Sequelize.INTEGER,
    description: Sequelize.STRING,
    type: Sequelize.STRING,
    id_device: Sequelize.STRING,
    multi_id_device: Sequelize.STRING,
    data_key: Sequelize.STRING,
    multi_data_key: Sequelize.STRING,
    min_value: Sequelize.INTEGER,
    max_value: Sequelize.INTEGER,
    unit: Sequelize.STRING,
    text: Sequelize.STRING,
    image: Sequelize.STRING,
    parser: Sequelize.STRING,
    msg_counter_period: Sequelize.STRING,
    icon: Sequelize.STRING,
    color: Sequelize.STRING,
    gauge_min_treshold: Sequelize.STRING,
    gauge_max_treshold:Sequelize.STRING
    
}, {timestamps: false});

module.exports = widget;