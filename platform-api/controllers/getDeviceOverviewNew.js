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
    //check debug
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    //get headers
    const hdr = req.headers.authorization;
    try
    {
        //check token
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
        var username= usernameExists[0].token_key;
        //cek waktu
        var now = moment(tmr).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        if (moment().isAfter(now))
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'token expired'
            });
        }

        const tokens= usernameExists[0].token_key;
        const avatar = usernameExists[0].avatar;
        var string = tokens.split("-");
        var token=string[0];
        //console.log(token);
        const role = usernameExists[0].role;
        const id = usernameExists[0].id;
        
        // super admin
        if (role==0)
        {   //count total Devicce
            const totalDevqry="SELECT id,id_device,name,id_parser from devices" ;
            const totalDev = await Device.sequelize.query(totalDevqry, { type: QueryTypes.SELECT });
            const totalDevice = totalDev.length;
            //count total Message
            const totalMsgqry="SELECT COUNT(*) as total from messages" ;
            const totalMsg = await Message.sequelize.query(totalMsgqry, { type: QueryTypes.SELECT });
            const totalmesage= totalMsg[0].total;
            var alert_datas={};
            var total_alert=0;
            var tmp_dataAlerts=[];
            //get Alert
            const alerts= await Alert.findAll ({
                where: {token_key: token,is_active:1}, 
                raw: true
            },);

            if (alerts==0)
            {
                alert_datas.total=0;
                alert_datas.data='nodata';
            }

            for (const dts of alerts)
            { 
                const devs1 = dts.id_device;
                const custom_msg= dts.custom_message;
                //find latest Alert
                const alert_data= await AlertData.findAll({
                    where: {id_device: devs1}, 
                    order:[
                        ['id', 'DESC']
                    ],
                    limit:1,
                    raw: true
                },);

                if (alert_data==0)
                {
                    continue
                }
                else
                {
                    //calculate minutes 
                    var js={};
                    const currentDate = new Date;
                    const moved = alert_data[0].data_key;
                    const dt=alert_data[0].value;
                    const tmp_time= alert_data[0].timestamp;
                    const now_timestamp = moment(currentDate).format("x");
                    const lastAlertTimestamp = alert_data[0].timestamp;
                    const last_timestamp = moment(lastAlertTimestamp).format("x");
                    const timeDiff = now_timestamp - last_timestamp;
                    const resultInMinute = Math.floor((timeDiff/1000)/60);
                    //console.log(resultInMinute);
                    if (resultInMinute < 120)
                    {
                        js.desc=custom_msg+' '+ moved+ ' value '+ dt;
                        js.id_device= devs1;
                        js.lastTriggered=tmp_time;
                        tmp_dataAlerts.push(js);
                        total_alert++;
                    }
                    
                }
            }//end for

            //add to json
            alert_datas.total=total_alert;
            alert_datas.data=tmp_dataAlerts;
            var result =[];
            //cek parser
            for (const prd of totalDev)
            {
                const ids= prd.id_device;
                const parser= prd.id_parser;
                if (parser == null)
                {
                    continue;
                }
                const name1 = await Parser.findAll({
                    where: {  id:parser },
                    order: [
                        ['id', 'DESC']
                    ],
                    raw: true
                });
                if (name1==0)
                {
                    continue;
                }
                const names= name1[0].name;
                const content = name1[0].content;

                //get last message
                const msg = await Message.findAll({
                    attributes: ['time', 'data', 'id_reception','snr', 'rssi'],
                    where: {  id_device:ids },
                    order: [
                        ['id', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });

                if (msg==0)
                {
                    continue;
                }
                
                //get position
                var lat,lng;
                const locs = await Geoloc.findAll({
                    attributes: ['lat', 'longitude'],
                    where: {  id_device:ids },
                    order: [
                        ['id', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });

                if (locs==0)
                {
                    lat='-6.175392';
                    lng='106.827153';

                }
                else
                {
                    lat=locs[0].lat;
                    lng=locs[0].longitude;
                }

                var data = msg[0].data;
                var time= msg[0].time;
                const id_reception=msg[0].id_reception;
                const rssi= msg[0].RSSI;
                const snr= msg[0].SNR;
                var datas =data;
                //parsing
                var resp =   getScript(datas,content);
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
                if (k > 0) 
                {
                    for (var z=0; z< k; z++)
                    {
                        ts[key[z]]= values[z];
                    }
                    tes.push(ts);
                    objs['data']= tes;
                    objs['id_device']= ids;
                    var times=time;
                    objs['time']= times;
                    objs['rawData']=data;
                    objs['id_reception']= id_reception;
                    objs['RSSI']= rssi;
                    objs['SNR']= snr;
                    objs['parser']=names;
                    objs['latitude']= lat;
                    objs['longitude']=lng;
                    result.push(objs);
                }
                          
                   
            }
            return  res.status(200).json({
                responseCode:'200',
                responseDesc:'data fetched',
                totalDevice:totalDevice,
                totalMessage:totalmesage,
                activeAlert: alerts.length,
                lastAlert:alert_datas,
                avatar:avatar,
                deviceDetails:result
            });
            

        }

        if (role==1)
        {
            const totalDevqry="SELECT id,id_device,name,id_parser from devices where isAdmin ="+id+"; " ;
            const totalDev = await Device.sequelize.query(totalDevqry, { type: QueryTypes.SELECT });
            const totalDevice = totalDev.length;
            var tlt= 0;
            if (totalDev==0)
            {
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'no device yet'
                });
                
            }

            for (const mdg of totalDev)
            {
                const totalMsgqry="SELECT COUNT(*) as total from messages where id_device = '"+mdg.id_device+"';" ;
                const totalMsg = await Message.sequelize.query(totalMsgqry, { type: QueryTypes.SELECT });
                tlt+=parseInt(totalMsg[0].total);
            }
            var alert_datas={};
            var total_alert=0;
            var tmp_dataAlerts=[];

             //get Alert
            const alerts= await Alert.findAll ({
                where: {token_key: token,is_active:1}, 
                raw: true
            },);

            if (alerts==0)
            {
                alert_datas.total=0;
                alert_datas.data='nodata';
            }

            for (const dts of alerts)
            { 
                const devs1 = dts.id_device;
                const custom_msg= dts.custom_message;
                //find latest Alert
                const alert_data= await AlertData.findAll({
                    where: {id_device: devs1}, 
                    order:[
                        ['id', 'DESC']
                    ],
                    limit:1,
                    raw: true
                },);

                if (alert_data==0)
                {
                    continue
                }
                else
                {
                    //calculate minutes 
                    var js={};
                    const currentDate = new Date;
                    const moved = alert_data[0].data_key;
                    const dt=alert_data[0].value;
                    const tmp_time= alert_data[0].timestamp;
                    const now_timestamp = moment(currentDate).format("x");
                    const lastAlertTimestamp = alert_data[0].timestamp;
                    const last_timestamp = moment(lastAlertTimestamp).format("x");
                    const timeDiff = now_timestamp - last_timestamp;
                    const resultInMinute = Math.floor((timeDiff/1000)/60);
                    //console.log(resultInMinute);
                    if (resultInMinute < 120)
                    {
                        js.desc=custom_msg+' '+ moved+ ' value '+ dt;
                        js.id_device= devs1;
                        js.lastTriggered=tmp_time;
                        tmp_dataAlerts.push(js);
                        total_alert++;
                    }
                    
                }
            }//end for

            //add to json
            alert_datas.total=total_alert;
            alert_datas.data=tmp_dataAlerts;
            var result =[];
            //cek parser
            for (const prd of totalDev)
            {
                const ids= prd.id_device;
                const parser= prd.id_parser;
                if (parser == null)
                {
                    continue;
                }
                const name1 = await Parser.findAll({
                    where: {  id:parser },
                    order: [
                        ['id', 'DESC']
                    ],
                    raw: true
                });
                if (name1==0)
                {
                    continue;
                }
                const names= name1[0].name;
                const content = name1[0].content;

                //get last message
                const msg = await Message.findAll({
                    attributes: ['time', 'data', 'id_reception','snr', 'rssi'],
                    where: {  id_device:ids },
                    order: [
                        ['id', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });

                if (msg==0)
                {
                    continue;
                }
                
                //get position
                var lat,lng;
                const locs = await Geoloc.findAll({
                    attributes: ['lat', 'longitude'],
                    where: {  id_device:ids },
                    order: [
                        ['id', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });

                if (locs==0)
                {
                    lat='-6.175392';
                    lng='106.827153';

                }
                else
                {
                    lat=locs[0].lat;
                    lng=locs[0].longitude;
                }

                var data = msg[0].data;
                var time= msg[0].time;
                const id_reception=msg[0].id_reception;
                const rssi= msg[0].RSSI;
                const snr= msg[0].SNR;
                var datas =data;
                //parsing

                var header = 'function myFile(data){';
                var footer = '}';
                var coder = header + content + footer;
                var wrap = s => "{ return " + coder + " };"
                var func = new Function(wrap(coder));
                var resp = (func.call(null).call(null, datas));
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
                if (k > 0) 
                {
                    for (var z=0; z< k; z++)
                    {
                        ts[key[z]]= values[z];
                    }
                    tes.push(ts);
                    objs['data']= tes;
                    objs['id_device']= ids;
                    var times=time;
                    objs['time']= times;
                    objs['rawData']=data;
                    objs['id_reception']= id_reception;
                    objs['RSSI']= rssi;
                    objs['SNR']= snr;
                    objs['parser']=names;
                    objs['latitude']= lat;
                    objs['longitude']=lng;
                    result.push(objs);
                }
                          
                   
            }
            return  res.status(200).json({
                responseCode:'200',
                responseDesc:'data fetched',
                totalDevice:totalDevice,
                totalMessage:tlt,
                activeAlert: alerts.length,
                lastAlert:alert_datas,
                avatar:avatar,
                deviceDetails:result
            });
            
        }

        if (role==2)
        {
            const totalDevqry="SELECT id,id_device,name,id_parser from devices where isUser ="+id+"; " ;
            const totalDev = await Device.sequelize.query(totalDevqry, { type: QueryTypes.SELECT });
            const totalDevice = totalDev.length;
            var tlt= 0;
            if (totalDev==0)
            {
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'no device yet'
                });
                
            }

            for (const mdg of totalDev)
            {
                const totalMsgqry="SELECT COUNT(*) as total from messages where id_device = '"+mdg.id_device+"';" ;
                const totalMsg = await Message.sequelize.query(totalMsgqry, { type: QueryTypes.SELECT });
                tlt+=parseInt(totalMsg[0].total);
            }
            var alert_datas={};
            var total_alert=0;
            var tmp_dataAlerts=[];

             //get Alert
            const alerts= await Alert.findAll ({
                where: {token_key: token,is_active:1}, 
                raw: true
            },);

            if (alerts==0)
            {
                alert_datas.total=0;
                alert_datas.data='nodata';
            }

            for (const dts of alerts)
            { 
                const devs1 = dts.id_device;
                const custom_msg= dts.custom_message;
                //find latest Alert
                const alert_data= await AlertData.findAll({
                    where: {id_device: devs1}, 
                    order:[
                        ['id', 'DESC']
                    ],
                    limit:1,
                    raw: true
                },);

                if (alert_data==0)
                {
                    continue
                }
                else
                {
                    //calculate minutes 
                    var js={};
                    const currentDate = new Date;
                    const moved = alert_data[0].data_key;
                    const dt=alert_data[0].value;
                    const tmp_time= alert_data[0].timestamp;
                    const now_timestamp = moment(currentDate).format("x");
                    const lastAlertTimestamp = alert_data[0].timestamp;
                    const last_timestamp = moment(lastAlertTimestamp).format("x");
                    const timeDiff = now_timestamp - last_timestamp;
                    const resultInMinute = Math.floor((timeDiff/1000)/60);
                    //console.log(resultInMinute);
                    if (resultInMinute < 120)
                    {
                        js.desc=custom_msg+' '+ moved+ ' value '+ dt;
                        js.id_device= devs1;
                        js.lastTriggered=tmp_time;
                        tmp_dataAlerts.push(js);
                        total_alert++;
                    }
                    
                }
            }//end for

            //add to json
            alert_datas.total=total_alert;
            alert_datas.data=tmp_dataAlerts;
            var result =[];
            //cek parser
            for (const prd of totalDev)
            {
                const ids= prd.id_device;
                const parser= prd.id_parser;
                if (parser == null)
                {
                    continue;
                }
                const name1 = await Parser.findAll({
                    where: {  id:parser },
                    order: [
                        ['id', 'DESC']
                    ],
                    raw: true
                });
                if (name1==0)
                {
                    continue;
                }
                const names= name1[0].name;
                const content = name1[0].content;

                //get last message
                const msg = await Message.findAll({
                    attributes: ['time', 'data', 'id_reception','snr', 'rssi'],
                    where: {  id_device:ids },
                    order: [
                        ['id', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });

                if (msg==0)
                {
                    continue;
                }
                
                //get position
                var lat,lng;
                const locs = await Geoloc.findAll({
                    attributes: ['lat', 'longitude'],
                    where: {  id_device:ids },
                    order: [
                        ['id', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });

                if (locs==0)
                {
                    lat='-6.175392';
                    lng='106.827153';

                }
                else
                {
                    lat=locs[0].lat;
                    lng=locs[0].longitude;
                }

                var data = msg[0].data;
                var time= msg[0].time;
                const id_reception=msg[0].id_reception;
                const rssi= msg[0].RSSI;
                const snr= msg[0].SNR;
                var datas =data;
                //parsing

                /*var header = 'function myFile(data){';
                var footer = '}';
                var coder = header + content + footer;
                var wrap = s => "{ return " + coder + " };"
                var func = new Function(wrap(coder));*/
                //var resp = (func.call(null).call(null, datas));
                var resp=  await getScript(datas,content);
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
                if (k > 0) 
                {
                    for (var z=0; z< k; z++)
                    {
                        ts[key[z]]= values[z];
                    }
                    tes.push(ts);
                    objs['data']= tes;
                    objs['id_device']= ids;
                    var times=time;
                    objs['time']= times;
                    objs['rawData']=data;
                    objs['id_reception']= id_reception;
                    objs['RSSI']= rssi;
                    objs['SNR']= snr;
                    objs['parser']=names;
                    objs['latitude']= lat;
                    objs['longitude']=lng;
                    result.push(objs);
                }
                          
                   
            }
            return  res.status(200).json({
                responseCode:'200',
                responseDesc:'data fetched',
                totalDevice:totalDevice,
                totalMessage:tlt,
                activeAlert: alerts.length,
                lastAlert:alert_datas,
                avatar:avatar,
                deviceDetails:result
            });
            
        }
        else
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:"NO DEVICE"
            });
        }


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

    
};

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

