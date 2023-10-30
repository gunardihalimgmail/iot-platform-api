const moment = require('moment');
const User = require('../models/user');
const Parser = require('../models/parsers');
const Dashbord= require('../models/dashboard');
const Widget = require('../models/widget');
const { QueryTypes } = require('@sequelize/core');
const Message = require('../models/message');
const Device = require('../models/device');
const alert = require('../models/alerts');

exports.postCommand = async (req, res, next) => {
    var debug=false;
    if (debug)
    {
        console.log(req.body);
        
    }
    try
    {
        var dev= req.body.idDevice;
        const conn= req.body.idConnector;
        const key=req.body.dataKey;
        const min=parseInt(req.body.minValue);
        const max=parseInt(req.body.maxValue);
        const msg=req.body.customMessage;
        const tipe= req.body.type;
        const active=req.body.isActive;
        const token=req.body.token;
        const newUser = await alert.create({ 
            id_device: dev,
            id_connector: conn,
       
            data_key:key,
            custom_message:msg,
            min_value:min,
            isActive:active,
            max_value:max,
            type:tipe,
            token_key:token
        });

        if(!newUser){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'alert successfully registered'
        });

    }
    catch(err)
    {
        console.log(err);

        return res.status(200).json({
            responseCode:'500',
            responseDesc:err
        });
    }
}