const moment = require('moment');
const User = require('../models/user');
const Parser = require('../models/parsers');
const Dashbord= require('../models/dashboard');
const Widget = require('../models/widget');
const Device = require('../models/device');
const Downlink = require('../models/downlink');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    try
    {
        var data= req.body.data;
        var dev=req.body.idDevice;
        var tipe = req.body.tipe;
        if (tipe=="SIGFOX")
        {
            const user = await Downlink.findAll({
                where: {id_device: dev}, raw: true
            });

            if (user == 0)
            {
                const newUser = await Downlink.create({ 
                    data: data,
                    id_device: dev,
                    tipe:tipe
                });

                if(!newUser){
                    return res.status(200).json({
                        responseCode:'500',
                        responseDesc:'can not insert data to database'
                    });
                }
            }

            else {

                 const updateFence = await Downlink.update(
                    {
                        data: data
                        
                        },
                        {
                            where:
                            {
                                id_device: dev
                            }
                        }
                    );
            }
            return res.status(200).json({
                responseCode:'200',
                responseDesc:'downlink successfully registered'
            });
        }
        else if (tipe=="LORAWAN")
        {
            const user = await Downlink.findAll({
                where: {id_device: dev}, raw: true
            });
            var devName = req.body.devName;
            var accessKey= req.body.accessKey;
            var appName=req.body.appName;
            var email=req.body.email;

            if (user == 0)
            {
                const newUser = await Downlink.create({ 
                    data: data,
                    id_device: dev,
                    tipe:tipe,
                    access_key:accessKey,
                    application_name:appName,
                    device_name:devName,
                    email:email

                });

                if(!newUser){
                    return res.status(200).json({
                        responseCode:'500',
                        responseDesc:'can not insert data to database'
                    });
                }
            }

            else {

                 const updateFence = await Downlink.update(
                    {
                        data: data,
                        tipe:tipe,
                        access_key:accessKey,
                        application_name:appName,
                        device_name:devName,
                        email:email
                        },
                        {
                            where:
                            {
                                id_device: dev
                            }
                        }
                    );
            }
            return res.status(200).json({
                responseCode:'200',
                responseDesc:'downlink successfully registered'
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