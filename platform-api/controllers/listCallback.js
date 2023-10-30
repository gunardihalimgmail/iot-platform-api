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
        var token= req.body.token;
        var tmp=[];
        const usernameExist = await Callback.findAll(
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
            const url=dev.url;
            var js={};
            js.idCallback=id;
            js.url=url;
            tmp.push(js);
        }
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'callback successfully fetched',
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
