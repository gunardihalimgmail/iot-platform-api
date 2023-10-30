const moment = require('moment');
const User = require('../models/user');
const Parser = require('../models/parsers');
const Dashbord= require('../models/dashboard');
const Widget = require('../models/widget');
const { QueryTypes } = require('@sequelize/core');
const Message = require('../models/message');
const Device = require('../models/device');
exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
        
    }
    try
    {
        const idWidget = req.body.idWidget;
        const fd = await Widget.findAll({
            where: {id: idWidget}, raw: true
        });

        if (fd==0)
        {
             return res.status(200).json({
                responseCode:'404',
                responseDesc:'widget not found'
            });
        }

        var js={}
        js.name = fd[0].name;
        js.desc =fd[0].description;
        js.width= parseInt(fd[0].width);
        js.type =fd[0].type;
        js.idDevice= fd[0].id_device;
        js.multiIdDevice=fd[0].multi_id_device;
        js.dataKey=fd[0].data_key;
        js.multiDataKey= fd[0].multi_data_key;
        js.minValue =fd[0].min_value;
        js.maxValue= fd[0].max_value;
        js.unit =fd[0].unit;
        js.text= fd[0].text;
        js.image= fd[0].image;
        js.msgCounter=fd[0].msg_counter_period;
        js.color=fd[0].color;
        js.minTreshold=fd[0].gauge_min_treshold;
        js.maxTreshold=fd[0].gauge_max_treshold;
        return res.status(200).json({
                        responseCode:'200',
                        responseDesc:'widget fetched',
                        responseData:js
                    
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