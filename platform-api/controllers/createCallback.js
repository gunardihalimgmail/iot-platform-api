const moment = require('moment');
const User = require('../models/user');
const Parser = require('../models/parsers');
const Dashbord= require('../models/dashboard');
const Widget = require('../models/widget');
const Device = require('../models/device');
const Callback = require('../models/webhook');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    try
    {
        var url= req.body.url;
        var token=req.body.token;
        const newUser = await Callback.create({ 
            url: url,
            token_key: token,
        });

        if(!newUser){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'callback successfully registered'
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