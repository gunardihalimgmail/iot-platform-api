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
        const data= req.body.reqData;
        const idWidget = data.idWidget;
        const name = data.name;
        const desc = data.description;
        const width= parseInt(data.width);
        const type = data.type;
        const id_dev= data.idDevice;
        const multi_id_dev= data.multiIdDevice;
        const data_key= data.dataKey;
        const multi_key= data.multiDataKey;
        const min_value =data.minValue;
        const max_value= data.maxValue;
        const unit =data.unit;
        const txt= data.text;
        const img= data.image;
        const color=data.color;
        const msg_counter= data.messageCounter;
        const minTreshold=data.minTreshold;
        const maxTreshold=data.maxTreshold;
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

        const fd = await Widget.findAll({
            where: {id: idWidget}, raw: true
        });

        if (fd==0)
        {
             return res.status(200).json({
                responseCode:'500',
                responseDesc:'widget not found'
            });
        }
        
        const newUsers = await Widget.update({ 
            name: null,
            width: null,
            description: null,
            type:null,
            id_device:null,
            multi_id_device:null,
            data_key:null,
            multi_data_key:null,
            min_value:null,
            max_value:null,
            unit:null,
            text:null,
            image:null,
            msg_counter_period:null,
            color:null,
            gauge_min_treshold:null,
            gauge_max_treshold:null
        }, {where: {id: idWidget}, raw: true});
        if (type=='GAUGE'){
            const newUser = await Widget.update({ 
                name: name,
                width: width,
                description: desc,
                type:type,
                id_device:id_dev,
                multi_id_device:multi_id_dev,
                data_key:data_key,
                multi_data_key:multi_key,
                min_value:min_value,
                max_value:max_value,
                unit:unit,
                text:txt,
                image:img,
                msg_counter_period:msg_counter,
                color:color,
                gauge_min_treshold:minTreshold,
                gauge_max_treshold:maxTreshold
            }, {where: {id: idWidget}, raw: true});
             if(!newUser){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
             }
        }
        else{
            const newUser = await Widget.update({ 
                name: name,
                width: width,
                description: desc,
                type:type,
                id_device:id_dev,
                multi_id_device:multi_id_dev,
                data_key:data_key,
                multi_data_key:multi_key,
                min_value:min_value,
                max_value:max_value,
                unit:unit,
                text:txt,
                image:img,
                msg_counter_period:msg_counter
               
            }, {where: {id: idWidget}, raw: true});
            if(!newUser)
            {
                return res.status(200).json({
                    responseCode:'500',
                    responseDesc:'can not insert data to database'
                });
            }

          

        
        }
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'widget updated'
        
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