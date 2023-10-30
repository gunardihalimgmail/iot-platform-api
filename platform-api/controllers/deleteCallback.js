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
        var id= req.body.idCallback;
        const usernameExist = await Callback.findAll(
            {where: {id: id}, raw: true},
        );

        if (usernameExist==0)
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'callback not found'
            });
        }
      const newUser = await Callback.destroy(
                {where: {id: id}, raw: true},
            );

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'callback successfully deleted'
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
