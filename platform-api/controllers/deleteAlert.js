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
    try{
        var id= req.body.idAlert;
        const usernameExist = await alert.findAll(
            {where: {id: id}, raw: true},
        );
        if (usernameExist==0)
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'alert not found'
            });
        }
      const newUser = await alert.destroy(
                {where: {id: id}, raw: true},
            );

        if(!newUser){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'alert successfully deleted'
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