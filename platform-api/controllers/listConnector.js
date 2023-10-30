const User = require('../models/user');
const Parser = require('../models/parsers');
const Dashbord= require('../models/dashboard');
const Widget = require('../models/widget');
const { QueryTypes } = require('@sequelize/core');
const Message = require('../models/message');
const Device = require('../models/device');
const Connector= require('../models/connector');
const moment = require('moment');

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
        const usernameExist = await Connector.findAll(
            {where: {token_key: token}, raw: true},
        );

        if (usernameExist==0)
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'callback not found'
            });
        }
        for (const dev of usernameExist)
        {
            const id=dev.id;
            const name = dev.name;
            const type = dev.type;
            const desc= dev.description;
            const username= dev.username;
            const pwd= dev.password;
            const rec= dev.recipient;
            var js={};
            js.idConnector=id;
            js.name=name;
            js.type=type;
            if (desc==null)
                js.desc=null
            else
                js.desc=desc;
            js.username=username;
            js.password=pwd;
            js.recipient=rec;
            tmp.push(js);
        }
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'connector successfully fetched',
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