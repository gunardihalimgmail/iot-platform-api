const moment = require('moment');
const User = require('../models/user');
const Parser = require('../models/parsers');
const Dashbord= require('../models/dashboard');
const Widget = require('../models/widget');
const { QueryTypes } = require('@sequelize/core');
const Message = require('../models/message');
const Device = require('../models/device');
const alert = require('../models/alerts');
const Connector= require('../models/connector');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
        
    }
    try
    {
        var token= req.body.token;
        var tmp=[];
        const usernameExist = await alert.findAll(
            {where: {token_key: token}, raw: true},
        );

        if (usernameExist==0)
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'alert not found'
            });
        }
        for (const dev of usernameExist)
        {
            const id=dev.id;
            const name = dev.id_device;
            const type = dev.type;
            const conn= dev.id_connector;
            const key=dev.data_key;
            const min =dev.min_value;
            const max=dev.max_value;
            const msg= dev.custom_message;
            const active=dev.is_active;
            const last_triggered= dev.last_triggered;
            const update=dev.last_update;
            const usernameExists = await Connector.findAll(
            {where: {id: conn}, raw: true},
                );
            var js={};
            js.idAlert=id;
            js.idDevice=name;
            js.type=type;
            js.connectorName= usernameExists[0].name;
            js.idConnector=conn;
            js.dataKey=key;
            js.minValue=min;
            js.maxValue=max;
            js.message=msg;
            js.isActive=active;
            js.lastTriggered=last_triggered;
            js.lastUpdate=update;

            tmp.push(js);
        }
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'alert successfully fetched',
            responseData:tmp
        });
    }
    catch(err)
    {
        if (debug)
        {
            console.log(err);
        }

        return res.status(200).json({
            responseCode:'500',
            responseDesc:err
        });
    }
}