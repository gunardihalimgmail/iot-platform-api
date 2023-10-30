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
const sequelize = require("sequelize");

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }

    try
    {
        var token = req.body.token_key;
                   
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
            const sort = req.query.sort;
            console.log(sort);
            var devs;
            if(!sort)
            {
                devs = await Message.findAll({
                   
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1000,
                    raw: true
                });
            }
            else
            {
                
                devs = await Message.findAll({
                   
                    order: [
                        ['time', sort]
                    ],
                    limit: 1000,
                    raw: true
                });
            }
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
                var time=moment(prd.time).tz('Asian/Jakarta').subtract(7, 'hours').format("YYYY-MM-DD HH:mm:ss");
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
                     objs['time']= times;
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
            result.sort((a,b)=> new Date(b.time).getTime() - new Date(a.time).getTime());   
            return res.status(200).json({
                responseCode: '200',
                responseDesc: 'success',
                data: result
            });
        }
        if (role==1)
        {
            const devss = await Device.findAll(
                {
                where: {isadmin: id}, 
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
            const sort = req.query.sort;
            console.log(sort);
           
            for (const des1 of devss)
            {
                const devices= des1.id_device;
                const id_parser= des1.id_parser;    
                /*const devs = await Message.findAll({
                    
                    where: { id_device: devices },
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: len,
                    raw: true
                });*/
                /* if(!req.params)
                {
                    devs = await Message.findAll({
                        attributes: ['time', 'id_device', 'data', 'id_reception','snr', 'rssi','seq'],
                        where: { id_device: devices },
                        order: [
                            ['time', 'DESC']
                        ],
                        limit: 1000,
                        raw: true
                    });
                }
                else
                {
                    const sort = req.query.sort.toUpperCase();
                    devs = await Message.findAll({
                        attributes: ['time', 'id_device', 'data', 'id_reception','snr', 'rssi','seq'],
                        where: { id_device: devices },
                        order: [
                            ['time', sort]
                        ],
                        limit: 1000,
                        raw: true
                    });
                } */
                if(!sort)
                {
                    devs = await Message.findAll({
                        where: { id_device: devices },
                        order: [
                            ['time', 'DESC']
                        ],
                        limit: 1000,
                        raw: true
                    });
                }
                else
                {
                    
                    devs = await Message.findAll({
                        where: { id_device: devices },
                        order: [
                            ['time', sort]
                        ],
                        limit: 1000,
                        raw: true
                    });
                }
              
                if(devs == 0){
                    continue;
                }
                const pars= await Parser.findAll({              
                    where: { id:id_parser },
                    raw: true
                });
                if(pars==0)
                {
                    continue;
                }
                const parserrr=  pars[0].name;
                    const content= pars[0].content;
                for (const prd of devs)           
                { 
                    var lat=null;
                    var lng=null;
                    var des= prd.id_device;
                    var data = prd.data;
                    var time=moment(prd.time).tz('Asian/Jakarta').subtract(7, 'hours').format("YYYY-MM-DD HH:mm:ss");
                    const id_reception=prd.id_reception;
                    const rssi= prd.rssi;
                    const snr= prd.snr;
                    const seq=prd.seq;
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
                         objs['parser']=parserrr;
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
            //result.sort((a,b)=> new Date(b.time).getTime() - new Date(a.time).getTime());                       
            return res.status(200).json({
                responseCode: '200',
                responseDesc: 'success',
                data: result
            });
        }

        if (role==2)
        {
            const devss = await Device.findAll(
              {
                where: {isuser: id}, 
                },
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
            const sort = req.query.sort;
            console.log(sort);
            for (const des1 of devss)
            {
                const devices= des1.id_device;
                const id_parser= des1.id_parser;    
                /*const devs = await Message.findAll({
                    
                    where: { id_device: devices },
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: len,
                    raw: true
                });*/
              
            var devs;
            if(!sort)
            {
                devs = await Message.findAll({
                    where: { id_device: devices },
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1000,
                    raw: true
                });
            }
            else
            {
                
                devs = await Message.findAll({
                    where: { id_device: devices },
                    order: [
                        ['time', sort]
                    ],
                    limit: 1000,
                    raw: true
                });
            }
               
                if(devs == 0){
                    continue;
                }
                const pars= await Parser.findAll({              
                    where: { id:id_parser },
                    raw: true
                });
                const parserrr=  pars[0].name;
                    const content= pars[0].content;
                for (const prd of devs)           
                { 
                    var lat=null;
                    var lng=null;
                    var des= prd.id_device;
                    var data = prd.data;
                    var time=moment(prd.time).tz('Asian/Jakarta').subtract(7, 'hours').format("YYYY-MM-DD HH:mm:ss");
                    const id_reception=prd.id_reception;
                    const rssi= prd.rssi;
                    const snr= prd.snr;
                    const seq=prd.seq;
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
                        /* var dates = new Date(times).toISOString().
                         replace(/T/, ' ').      // replace T with a space
                         replace(/\..+/, '')*/
                         objs['time']= times;
                         objs['rawData']=data;
                         objs['id_reception']= id_reception;
                         objs['RSSI']= rssi;
                         objs['SNR']= snr;
                         objs['seq']=seq;
                         objs['parser']=parserrr;
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
            //result.sort((a,b)=> new Date(b.time).getTime() - new Date(a.time).getTime());                       
            return res.status(200).json({
                responseCode: '200',
                responseDesc: 'success',
                data: result
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