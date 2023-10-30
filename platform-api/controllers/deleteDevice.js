const moment = require('moment');
const { QueryTypes } = require('@sequelize/core');
const Device = require('../models/device');
const { Op } = require("sequelize");
const User = require('../models/user');
const Message = require('../models/message');
exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }

    try
    {
        const id_dev= req.body.idDevice;
        const hdr = req.headers.authorization;
        const usernameExists = await User.findAll(
            {where: {token:hdr}, raw: true},
        );
        
        if(usernameExists == 0){
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'user not found not valid'
            });
        }
        var tmr= usernameExists[0].expired_token;
        var now = moment(tmr).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        if (moment().isAfter(now))
        {
            return res.status(200).json({
                responseCode:'402',
                responseDesc:'token expired'
            });
        }
        const msg = await Message.destroy(
            {where: {id_device: id_dev}, raw: true},
        );

        const de = await Device.destroy(
            {where: {id_device: id_dev}, raw: true},
        );

        return res.status(200).json({
                        responseCode:'200',
                        responseDesc:'device deleted'
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