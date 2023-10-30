const moment = require('moment');
const User = require('../models/user');
const Device = require('../models/device');
const Message = require('../models/message');
const sequelize = require("sequelize");
const List_dev = require('../models/list_dev');
const { QueryTypes } = require('@sequelize/core');
const AlertData = require('../models/alertData');
const Alert = require('../models/alerts');
const alert = require('../models/alerts');
const Geoloc = require('../models/geoLoc');
const Parser = require('../models/parsers');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug) {
        console.log(req.body);
    }
    try 
    {
        const username=req.body.usernameUser;
        const token = req.body.token;
        const data= req.body.data;
        const usernameExists = await User.findAll(
            {where: {token_key: token}, raw: true},
        );

        if (usernameExists==0)
            {
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'user not found'
                });
        }

        const id= usernameExists[0].id;
        const role = usernameExists[0].role;

        if (role ==0)
        {
            const usernameUser = await User.findAll(
                {where: {username: username}, raw: true},
            );

            if (usernameUser==0)
                {
                    return res.status(200).json({
                        responseCode:'404',
                        responseDesc:'user not found'
                    });
                }
            const id_user=usernameUser[0].id;
            const roles_user= usernameUser[0].role;
            
            if (roles_user==1)
            {
                 const dev2= await Device.update({
                        isuser:null,
                        isadmin:null
                    },
                    {where: {isadmin: id_user}, raw: true}
                );
                for (var j = 0; j < data.length; j++) {
                        const  id_dev = data[j].deviceId;
                        const dev= await Device.findAll(
                            {where: {id_device: id_dev}, raw: true}
                        );
                        const admin= dev[0].isadmin;
                        if (dev.length>=1)
                        {
                            const dev1= await Device.update(
                                {
                                    isadmin:id_user
                                },
                                {where: {id_device: id_dev}, raw: true}
                            );

                        }
                        if (dev.length==0)
                        {
                            return res.status(200).json({
                            responseCode:'404',
                            responseDesc:'device not found '
                            });
                        }
                }

                return res.status(200).json({
                            responseCode:'200',
                            responseDesc:'shared device success'
                        });
                
            }
            if (roles_user==2)
            {
                const dev2= await Device.update({
                        isuser:null
                    },
                    {where: {isuser: id_user}, raw: true}
                );
                for (var j = 0; j < data.length; j++) {
                        const  id_dev = data[j].deviceId;
                        const dev2= await Device.findAll(
                            {where: {id_device: id_dev}, raw: true}
                        );

                        const admin= dev2[0].isuser;
                        const pri= dev2[0].priv;
                        if (dev2.length>=1)
                        {
                            
                            const dev1= await Device.update(
                                {
                                    isuser:id_user,
                                    isadmin:pri
                                },
                                {where: {id_device: id_dev}, raw: true}
                            );

                        }

                        if (dev2==0)
                        {
                            return res.status(200).json({
                            responseCode:'404',
                            responseDesc:'device not found '
                            });
                        }
                }
                return res.status(200).json({
                            responseCode:'200',
                            responseDesc:'shared device success'
                        });
                
            }
        }

        if (role ==1)
        {
            const usernameUser = await User.findAll(
                {where: {username: username}, raw: true},
            );

            if (usernameUser==0)
                {
                    return res.status(200).json({
                        responseCode:'404',
                        responseDesc:'user not found'
                    });
                }
            const id_user=usernameUser[0].id;
            const roles_user= usernameUser[0].role;
            if (roles_user==2)
            {
                const dev2= await Device.update({
                        isuser:null
                    },
                    {where: {isuser: id_user}, raw: true}
                );
                for (var j = 0; j < data.length; j++) {
                        const  id_dev = data[j].deviceId;
                        const dev= await Device.findAll(
                            {where: {id_device: id_dev}, raw: true}
                        );

                        const admin= dev[0].isuser;
                        


                        if (dev.length>=1 )
                        {
                            const dev1= await Device.update(
                                {
                                    isuser:id_user
                                },
                                {where: {id_device: id_dev}, raw: true}
                            );

                        }

                        if (dev.length==0)
                        {
                            return res.status(200).json({
                            responseCode:'404',
                            responseDesc:'device not found '
                            });
                        }
                }
        
                return res.status(200).json({
                            responseCode:'200',
                            responseDesc:'shared device success'
                        });
            }
            else
            {
                return res.status(200).json({
                            responseCode:'500',
                            responseDesc:'not authorizes to shared device '
                        });
            }
        }
        else
        {
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'not authorizes to shared device '
            });
        }
    }

    catch (err) {
        if (debug) {
            console.log(err);
        }

        return res.status(200).json({
            responseCode: '500',
            responseDesc: err
        });
    }
}