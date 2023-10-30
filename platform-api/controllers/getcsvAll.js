const moment = require('moment');
const User = require('../models/user');
const Parser = require('../models/parsers');
const Dashbord= require('../models/dashboard');
const Widget = require('../models/widget');
const { QueryTypes } = require('@sequelize/core');
const Message = require('../models/message');
const Device = require('../models/device');
const { Op } = require("sequelize");
const Geoloc = require('../models/geoLoc');
var jsonexport = require('jsonexport');
const { crossOriginResourcePolicy } = require('helmet');
const sequelize = require("sequelize");
exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    try
    {
        var token = req.query.token;
        console.log(token);
        const usernameExists = await User.findAll(
            {where: {token_key: token}, raw: true},
        );
                        
        if(usernameExists == 0){
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'account not found'
            });
        }
        const role = usernameExists[0].role;
        const id = usernameExists[0].id;
        if (role==0)
        {
            const devs = await Message.findAll({
                attributes: ['time', 'id_device', 'data', 'id_reception','snr', 'rssi','seq'],
                order: [
                    ['id', 'DESC']
                ],
                limit:100,
               
                raw: true
            });

            if(devs == 0){
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'Device Not found'
                });
            }

            var result = [];
            var i=0;
            for (const prd of devs)        
            { 
                var lat =null ;
                var lng =null;
                var des= prd.id_device;
                var data = prd.data;
                var time=moment( prd.time).format("YYYY-MM-DD hh:mm:ss");
                var seq=prd.seq;
                const loc = await Geoloc.findAll({
                    attributes: ['time', 'id_device','lat','longitude'],
                    order: [
                        ['id', 'DESC']
                    ],
                    where:{id_device:des},
                    limit: 1,
                    raw: true
                });
                if (loc==0)
                {
                    lat =0;
                    lng=0;
                }
                else
                {
                    lat=loc[0].lat;
                    lng=loc[0].longitude;
                }
                const id_reception=prd.id_reception;
                const rssi= prd.rssi;
                const snr= prd.snr;
                const id_par = await Device.findAll({
                    attributes: ['id_parser'],
                    where
                    : { id_device:des},
                    raw: true
                });
                
                if (!id_par[0].id_parser)
                {
                    console.log("continue");
                    continue;
                }
                const pars= await Parser.findAll({
                        where: { id:id_par[0].id_parser },
                        raw: true
                });
                
                if (!pars)
                    continue;   
               
                const content= pars[0].content;
                //var tmp = fs.readFileSync('/opt/node/js/' + parserrr, 'utf8');
                var datas =data;
                var resp=getScript(datas,content);
                var key =[];
                var values=[];
                var k=0;
                var tes=[];
                var objs= {};
                var ts={};
                for (var j = 0; j < resp.length; j++) {
                    const  counter = resp[j];
                    var tmp = JSON.parse(JSON.stringify(counter));
                    if (tmp.key !== '' && tmp.hasOwnProperty('value') && tmp.value !== '') {
                        key[k] = tmp.key;
                        values[k] = tmp.value;
                        k++;
                        //employees[tmp.key]= tmp.value;
                    }
                }
                if (k > 0) {
                    for (var z=0; z< k; z++)
                     {
                         ts[key[z]]= values[z];
                     }
                     tes.push(ts);
                     console.log(ts);
                     objs['data']= tes;
                     objs['id_device']= des;
                     var times=time;
                     var dates = new Date(times).toISOString().
                     replace(/T/, ' ').      // replace T with a space
                     replace(/\..+/, '')
                     objs['time']= dates;
                     objs['rawData']=data;
                     objs['id_reception']= id_reception;
                     objs['RSSI']= rssi;
                     objs['SNR']= snr;
                     objs['seq']=seq;
                     //objs['parser']=parserrr;
                     objs['latitude']= lat;
                     objs['longitude']= lng;
                     result.push(objs);
                     
                 }
                 else
                 {
                    continue;
                 }
            }

            let date_ob = new Date();
                    jsonexport(result,function(err, csv){
                    if(err) return console.log(err);
                     const fs = require('fs');
                     fs.writeFile('./data/'+date_ob+'.csv', csv, function(err) {
                         if(err) {
                             return console.log(err);
                         }
                         else
                         {
                         console.log("The file was saved!");
                         var filePath='../data/';
                         var fileName=filePath+date_ob+'.csv';
                         res.download(fileName); 
                         //res.end();
                         }
                     }); 
                 });
        }

        if (role==1)
        {
            const devss = await Device.findAll(
                {attributes: [[sequelize.literal('DISTINCT `id_device`'), 'id_device'], 'id_device','id_parser','id_category','name','isAdmin','isUser'],
                where: {isAdmin: id}, 
                raw: true},
            );

            if (devss==0)
            {
                    return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'Device Not found'
                });
            }
            var result = [];
            const len=Math.round(1000/devss.length);
            for (const des1 of devss)
            {
                const devices= des1.id_device;
                const devs = await Message.findAll({
                    attributes: ['time', 'id_device', 'data', 'id_reception','snr', 'rssi','seq'],
                    where: {id_device: devices}, 
                    order: [
                        ['id', 'DESC']
                    ],
                
                    raw: true
                });

                if(devs == 0){
                    return res.status(200).json({
                        responseCode:'404',
                        responseDesc:'Device Not found'
                    });
                }

                var result = [];
                var i=0;
                for (const prd of devs)        
                { 
                    var lat =null ;
                    var lng =null;
                    var des= prd.id_device;
                    var data = prd.data;
                    var time=moment( prd.time).format("YYYY-MM-DD hh:mm:ss");
                    var seq=prd.seq;
                    const loc = await Geoloc.findAll({
                        attributes: ['time', 'id_device','lat','longitude'],
                        order: [
                            ['id', 'DESC']
                        ],
                        where:{id_device:des},
                        limit: 1,
                        raw: true
                    });
                    if (loc==0)
                    {
                        lat =0;
                        lng=0;
                    }
                    else
                    {
                        lat=loc[0].lat;
                        lng=loc[0].longitude;
                    }
                    const id_reception=prd.id_reception;
                    const rssi= prd.rssi;
                    const snr= prd.snr;
                    const id_par = await Device.findAll({
                        attributes: ['id_parser'],
                        where
                        : { id_device:des},
                        raw: true
                    });
                    
                    if (!id_par[0].id_parser)
                    {
                        console.log("continue");
                        continue;
                    }
                    const pars= await Parser.findAll({
                            where: { id:id_par[0].id_parser },
                            raw: true
                    });
                    
                    if (!pars)
                        continue;   
                
                    const content= pars[0].content;
                    //var tmp = fs.readFileSync('/opt/node/js/' + parserrr, 'utf8');
                    var datas =data;
                    var resp=getScript(datas,content);
                    var key =[];
                    var values=[];
                    var k=0;
                    var tes=[];
                    var objs= {};
                    var ts={};
                    for (var j = 0; j < resp.length; j++) {
                        const  counter = resp[j];
                        var tmp = JSON.parse(JSON.stringify(counter));
                        if (tmp.key !== '' && tmp.hasOwnProperty('value') && tmp.value !== '') {
                            key[k] = tmp.key;
                            values[k] = tmp.value;
                            k++;
                            //employees[tmp.key]= tmp.value;
                        }
                    }
                    if (k > 0) {
                        for (var z=0; z< k; z++)
                        {
                            ts[key[z]]= values[z];
                        }
                        tes.push(ts);
                        console.log(ts);
                        objs['data']= tes;
                        objs['id_device']= des;
                        var times=time;
                        var dates = new Date(times).toISOString().
                        replace(/T/, ' ').      // replace T with a space
                        replace(/\..+/, '')
                        objs['time']= dates;
                        objs['rawData']=data;
                        objs['id_reception']= id_reception;
                        objs['RSSI']= rssi;
                        objs['SNR']= snr;
                        objs['seq']=seq;
                        //objs['parser']=parserrr;
                        objs['latitude']= lat;
                        objs['longitude']= lng;
                        result.push(objs);
                        
                    }
                    else
                    {
                        continue;
                    }
                }
            }
        

            let date_ob = new Date();
                    jsonexport(result,function(err, csv){
                    if(err) return console.log(err);
                    const fs = require('fs');
                    fs.writeFile('../data/'+date_ob+'.csv', csv, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        else
                        {
                        console.log("The file was saved!");
                        var filePath='../data/';
                        var fileName=filePath+date_ob+'.csv';
                        res.download(fileName); 
                        //res.end();
                        }
                    }); 
            });
            }

        if (role==2)
        {
            const devss = await Device.findAll(
                {attributes: [[sequelize.literal('DISTINCT `id_device`'), 'id_device'], 'id_device','id_parser','id_category','name','isAdmin','isUser'],
                where: {isUser: id}, 
                raw: true},
            );

            if (devss==0)
            {
                    return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'Device Not found'
                });
            }
            var result = [];
            const len=Math.round(1000/devss.length);
            for (const des1 of devss)
            {
                const devices= des1.id_device;
                const devs = await Message.findAll({
                    attributes: ['time', 'id_device', 'data', 'id_reception','snr', 'rssi','seq'],
                    where: {id_device: devices}, 
                    order: [
                        ['id', 'DESC']
                    ],
                
                    raw: true
                });

            if(devs == 0){
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'Device Not found'
                });
            }

            var result = [];
            var i=0;
            for (const prd of devs)        
            { 
                var lat =null ;
                var lng =null;
                var des= prd.id_device;
                var data = prd.data;
                var time=moment( prd.time).format("YYYY-MM-DD hh:mm:ss");
                var seq=prd.seq;
                const loc = await Geoloc.findAll({
                    attributes: ['time', 'id_device','lat','longitude'],
                    order: [
                        ['id', 'DESC']
                    ],
                    where:{id_device:des},
                    limit: 1,
                    raw: true
                });
                if (loc==0)
                {
                    lat =0;
                    lng=0;
                }
                else
                {
                    lat=loc[0].lat;
                    lng=loc[0].longitude;
                }
                const id_reception=prd.id_reception;
                const rssi= prd.rssi;
                const snr= prd.snr;
                const id_par = await Device.findAll({
                    attributes: ['id_parser'],
                    where
                    : { id_device:des},
                    raw: true
                });
                
                if (!id_par[0].id_parser)
                {
                    console.log("continue");
                    continue;
                }
                const pars= await Parser.findAll({
                        where: { id:id_par[0].id_parser },
                        raw: true
                });
                
                if (!pars)
                    continue;   
            
                const content= pars[0].content;
                //var tmp = fs.readFileSync('/opt/node/js/' + parserrr, 'utf8');
                var datas =data;
                var resp=getScript(datas,content);
                var key =[];
                var values=[];
                var k=0;
                var tes=[];
                var objs= {};
                var ts={};
                for (var j = 0; j < resp.length; j++) {
                    const  counter = resp[j];
                    var tmp = JSON.parse(JSON.stringify(counter));
                    if (tmp.key !== '' && tmp.hasOwnProperty('value') && tmp.value !== '') {
                        key[k] = tmp.key;
                        values[k] = tmp.value;
                        k++;
                        //employees[tmp.key]= tmp.value;
                    }
                }
                if (k > 0) {
                    for (var z=0; z< k; z++)
                    {
                        ts[key[z]]= values[z];
                    }
                    tes.push(ts);
                    console.log(ts);
                    objs['data']= tes;
                    objs['id_device']= des;
                    var times=time;
                    var dates = new Date(times).toISOString().
                    replace(/T/, ' ').      // replace T with a space
                    replace(/\..+/, '')
                    objs['time']= dates;
                    objs['rawData']=data;
                    objs['id_reception']= id_reception;
                    objs['RSSI']= rssi;
                    objs['SNR']= snr;
                    objs['seq']=seq;
                    //objs['parser']=parserrr;
                    objs['latitude']= lat;
                    objs['longitude']= lng;
                    result.push(objs);
                    
                }
                else
                {
                    continue;
                }
            }
        

        let date_ob = new Date();
                jsonexport(result,function(err, csv){
                if(err) return console.log(err);
                    const fs = require('fs');
                    fs.writeFile('../data/'+date_ob+'.csv', csv, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                        else
                        {
                        console.log("The file was saved!");
                        var filePath='../data/';
                        var fileName=filePath+date_ob+'.csv';
                        res.download(fileName); 
                        //res.end();
                        }
                    }); 
                });
    }
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

function getScript(datas,script)
{
    var header = 'function myFile(data){';
    var footer = '}';
    var coder = header + script + footer;
    var wrap = s => "{ return " + coder + " };"
    var func = new Function(wrap(coder));
    var resp = (func.call(null).call(null, datas));
    return resp;
}