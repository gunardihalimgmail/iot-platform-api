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
        const id=req.body.idAlert;
        const active=parseInt(req.body.isActive);
        const createdTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const usernameExist = await alert.findAll(
            {where: {id: id}, raw: true},
        );

        if (usernameExist==0)
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'callback not found'
            });
        }
        const updateFence = await alert.update(
        {
            is_active:active,
            updated:createdTime
            },
            {
                where:
                {
                    id: id
                }
            }
        );

        if(!updateFence){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'alert successfully updated'
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