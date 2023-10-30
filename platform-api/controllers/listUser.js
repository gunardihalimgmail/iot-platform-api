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
        var nameUser= req.body.token;
        const usernameExists = await User.findAll(
            {where: {token_key: nameUser}, raw: true},
        );

        if (usernameExists==0)
            {
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'user not found'
                });
        }

        const role= usernameExists[0].role;
        var tmp =[];
        if (role==2)
        {
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'account not authorized'
            });
        }
        if(role==0)
                {
                    const list = await User.findAll(
                        {raw: true},
                    );
                    
                    if (list.length==0)
                    {
                        return res.status(200).json({
                            responseCode:'404',
                            responseDesc:'admin doesnot have user'
                        });
                    }

                    for (const lst of list)
                    {
                        var js={};
                        var ts=[];
                        const names= lst.username;
                        const token = lst.token_key;
                        const roles= lst.role;
                         const idss= lst.id
                        if (names == nameUser)
                            continue;
                        const id= lst.id;
                        if (roles==1)
                        {
                            const dev = await Device.findAll(
                             {where: {isadmin: idss}, raw: true},);
                            for (const rt of dev){
                                ts.push(rt.id_device);
                            }
                        }
                        if (roles==2)
                        {
                            const dev = await Device.findAll(
                             {where: {isuser: idss}, raw: true},);
                            for (const rt of dev){
                                ts.push(rt.id_device);
                            }
                        }
                        js.username=names;
                        js.token_key=token;
                        js.deviceList=ts;
                        tmp.push(js)
                    }

                    return res.status(200).json({
                        responseCode:'200',
                        responseDesc:'list user fetched',
                        responseData:tmp

                    });
                }
                if(role==1)
                {
                    const id= usernameExists[0].id;
                    const list = await User.findAll(
                    {where: {priv: id}, raw: true},
                    );

                    if (list.length==0)
                    {
                        return res.status(200).json({
                            responseCode:'404',
                            responseDesc:'admin doesnot have user'
                        });
                    }

                    for (const lst of list)
                    {
                        var js={};
                        var ts=[];
                        const names= lst.username;
                        const token = lst.token_key;
                        const roless= lst.role;
                        const idss= lst.id
                        if (names == nameUser)
                            continue;
                        if (roless==2)
                        {
                            const dev = await Device.findAll(
                             {where: {isUser: idss}, raw: true},);

                            for (const rt of dev){
                                ts.push(rt.id_device);
                            }
                        }
                 
                        js.username=names;
                        js.token_key=token;
                        js.deviceList=ts;
                        tmp.push(js)
                    }

                    return res.status(200).json({
                        responseCode:'200',
                        responseDesc:'list user fetched',
                        responseData:tmp

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