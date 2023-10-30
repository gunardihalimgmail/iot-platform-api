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
        const hdr = req.headers.authorization;
        const usernameExists = await User.findAll(
            {where: {token: hdr}, raw: true},
        );

        if (usernameExists==0)
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

        if (role ==0)
        {
            var tmp=[];
            const totalDevqry='SELECT devices.name,devices.id_device,devices.name,devices.isactive,devices.id_parser, parsers."content", parsers."name" as parser from devices JOIN parsers ON parsers."id"= devices.id_parser;' ;
            const devs = await Device.sequelize.query(totalDevqry, { type: QueryTypes.SELECT });
            if (devs==0)
            {
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'no device yet'
                });
            }
            for (const dev of devs)
            {
                const device= dev.id_device;
                const content = dev.content;  
                const names= dev.name;
                const msg = await Message.findAll({
                    attributes: [ 'data','time' ],
                    where: {  id_device:device },
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });
                if (msg==0)
                {
                    var js={};
                    js.id_device=device;
                    js.name=names;
                    tmp.push(js);
                    continue;
                }
                var js={};
                js.id_device=device;
                js.name=names;
                js.isActive= dev.isactive;
                js.lastMessage=   moment(msg[0].time).format("YYYY-MM-DD hh:mm:ss");
                js.parser=dev.parser;
                tmp.push(js);
            }
            
            return res.status(200).json({
                responseCode:'200',
                responseDesc:'Device fethced',
                responseData:tmp
            });
        }
        //role admin
        if (role==1)
        {
            const totalDevqry="SELECT devices.name,devices.id_device,devices.name,devices.isactive,devices.id_parser,parsers.name as parsers, parsers.content from devices JOIN parsers ON parsers.id= devices.id_parser where isadmin ='"+id+"' ;" ;
            const devs = await Device.sequelize.query(totalDevqry, { type: QueryTypes.SELECT });
            
            if (devs==0)
            {
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'no device yet'
                });
            }
            //
            for (const dev of devs)
            {
                const device= dev.id_device;
                const content = dev.content;  
                const parser= dev.parsers
                const names= dev.name;
                const msg = await Message.findAll({
                    attributes: [ 'data','time' ],
                    where: {  id_device:device },
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });
                if (msg==0)
                {
                    var js={};
                    js.id_device=device;
                    js.name=names;
                    tmp.push(js);
                    continue;
                }
                var js={};
                js.id_device=device;
                js.name=names;
                js.parser=parser;
                js.lastMessage=   moment(msg[0].time).format("YYYY-MM-DD hh:mm:ss");
                tmp.push(js);
            }
            
            return res.status(200).json({
                responseCode:'200',
                responseDesc:'Device fethced',
                responseData:tmp
            });
        }

        if (role==2)
        {
            const totalDevqry="SELECT devices.name,devices.id_device,devices.name,devices.isactive,devices.id_parser,parsers.name as parsers, parsers.content from devices JOIN parsers ON parsers.id= devices.id_parser where isuser ='"+id+"' ;" ;
            const devs = await Device.sequelize.query(totalDevqry, { type: QueryTypes.SELECT });
            //
            if (devs==0)
            {
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'no device yet'
                });
            }
            //
            for (const dev of devs)
            {
                const device= dev.id_device;
                const content = dev.content;  
                const names= dev.name;
                const msg = await Message.findAll({
                    attributes: [ 'data' ,'time'],
                    where: {  id_device:device },
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });
                if (msg==0)
                {
                    var js={};
                    js.id_device=device;
                    js.name=names;
                    tmp.push(js);
                    continue;
                }
                var js={};
                js.id_device=device;
                js.name=names;
                js.parser=parser;
                js.lastMessage=   moment(msg[0].time).format("YYYY-MM-DD hh:mm:ss");
                tmp.push(js);
            }
            
            return res.status(200).json({
                responseCode:'200',
                responseDesc:'Device fethced',
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