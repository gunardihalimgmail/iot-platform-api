const moment = require('moment');
const User = require('../models/user');
const Device = require('../models/device');
const Message = require('../models/message');
const sequelize = require("sequelize");
const List_dev = require('../models/list_dev');
const { QueryTypes } = require('@sequelize/core');
const AlertData = require('../models/alertData'); 
const Alert= require('../models/alerts');
const alert = require('../models/alerts');
const Geoloc = require('../models/geoLoc');
const Parser = require('../models/parsers');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }

    try
    {
        const id_dev= req.body.idDevice;
        const id_parser= parseInt(req.body.idParser);
        const name = req.body.name;
        const token=req.body.token;
        const hdr = req.headers.authorization;
        const usernameExists = await User.findAll(
            {where: {token_key: token}, raw: true},
        );

        if (usernameExists == 0)
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'user not found'
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
            const id= usernameExists[0].id;
            const role = usernameExists[0].role;

            if (role==0)
                {
                    const ct= await Device.update({
                        id_device:id_dev,
                        id_parser:id_parser,
                        token_key:token,
                        name: name
                    },{where: {id_device: id_dev}})

                    return res.status(200).json({
                            responseCode:'200',
                            responseDesc:'device updated'
                        });
                }

                if (role==1)
                {
                    const ct= await Device.update({
                        id_device:id_dev,
                        id_parser:id_parser,
                        name: name,
                        token_key:token,
                        isAdmin:id
                    },  {where: {id_device: id_dev}})

                    return res.status(200).json({
                            responseCode:'200',
                            responseDesc:'device updated'
                        });
                }

                
                if (role==2)
                {
                    return res.status(200).json({
                            responseCode:'500',
                            responseDesc:'not authorized to add device'
                        });
                }
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