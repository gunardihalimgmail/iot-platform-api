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
const Dashbord= require('../models/dashboard');
exports.postCommand = async (req, res, next) => {
   
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }

    try
    {
        const hdr = req.headers.authorization;
        var tmp=[];
        //cek token
        const createdTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
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
        var tokens=usernameExists[0].token_key;
        var now = moment(tmr).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        if (moment().isAfter(now))
        {
            return res.status(200).json({
                responseCode:'402',
                responseDesc:'token expired'
            });
        }
        const dash= await Dashbord.findAll(
            {where: {token_key: tokens}, raw: true}
        );

        if (dash==0)
        {
             return res.status(200).json({
                responseCode:'404',
                responseDesc:'dashboard not found'
            });
        }
        
        for (const db of dash)
        {
            var desc='';
            var js={};
            const id= db.id;
            const names=db.name;
            if (db.descriptiondb)
                desc=db.description;
            js.idDashboard=id;
            js.name=names;
            js.description=desc;
            tmp.push(js);

        }
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'Dashbord fetched',
            responseData:tmp
        });
    }
    catch(err)
    {
        if (debug)
        {
            console.log(err);
        }

        res.status(200).json({
            responseCode:'500',
            responseDesc:err
        });
    }
}