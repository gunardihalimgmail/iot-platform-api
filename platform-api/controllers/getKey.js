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
        var dev = req.body.id_device;
        const totalDevqry="SELECT devices.name,devices.id_device,devices.name,devices.id_parser, parsers.content from devices JOIN parsers ON parsers.id= devices.id_parser  where devices.id_device='"+dev+"';" ;
        const devs = await Device.sequelize.query(totalDevqry, { type: QueryTypes.SELECT });
        if (devs==0)
        {
            return res.status(200).json({
            responseCode:'404',
            responseDesc:'no device yet'
            });
        }
        const content = devs[0].content;
        const devss = await Message.findAll({
            attributes: [ 'data'],
            where: { id_device: dev },
            order: [
                ['id', 'DESC']
            ],
            limit: 1,
            raw: true
        });
        if (devss==0)
        {
            return res.status(200).json({
            responseCode:'404',
            responseDesc:'no data device yet'
            });
        }
        var datas = devss[0].data;
        var resp = getScript(datas,content);
        return res.status(200).json({
            'responseCode': "200",
            'responseDesc': "Success",
            'data': resp
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

function getScript(datas,script)
{
    var header = 'function myFile(data){';
    var footer = '}';
    var coder = header + script + footer;
    var wrap = s => "{ return " + coder + " };"
    var func = new Function(wrap(coder));
    var resp =  (func.call(null).call(null, datas));
    return resp;
}