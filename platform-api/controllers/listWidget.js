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
exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }

    try
    {
        const id_dashboard=parseInt(req.body.idDashboard);
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

        const id= await Widget.findAll({
            where: {id_dashboard:id_dashboard}, raw: true
        });

        var tmp=[];
        if (id==0)
        {
                return res.status(200).json({
                    responseCode:'404',
                    responseDesc:'no widget yet'
                });
        }
        for (const wdt of id)
        {
            const tipe =wdt.type;
            const idWidget=wdt.id;
            const width=wdt.width
            if (debug)
            {
                console.log(tipe);
            }
            if (tipe=='GAUGE'|| tipe=='POSITION')
            {
                const id_dev= wdt.id_device;
                const keys = wdt.data_key;
                var string = keys.split("-");
                const key =string[0];
                const nm =wdt.name;
                const unit =wdt.unit;
                const min=wdt.min_value;
                const max= wdt.max_value;
                const color= wdt.color;
                const mintreshold=wdt.gauge_min_treshold;
                const maxtreshold=wdt.gauge_max_treshold;
                const qry="select devices.id_device,devices.name, devices.id_parser, parsers.content from devices LEFT OUTER  JOIN parsers ON  parsers.id= devices.id_parser where id_device='"+id_dev+"' ;";
                const devs = await Device.sequelize.query(qry, { type: QueryTypes.SELECT });
                /* const devs = await Device.findAll({
                    where: {
                        id_device:id_dev
                    },
                    raw: true

                });*/
                if (devs==0)
                {  
                    continue;
                }
                //const prs= devs[0].id_parser;
                const name_dev = devs[0].name; 
                const content = devs[0].content;
                const msg = await Message.findAll({
                    attributes: ['time', 'id_device', 'data',  ],
                    where: { id_device: id_dev},
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });
                if (msg==0)
                {
                    continue;
                }
                var data = msg[0].data;
                var time= msg[0].time;
                var datas =data;
                var resp = getScript(datas,content);
                var ts={};
                var value=0;
                for (var j = 0; j < resp.length; j++) {
                    const  counter = resp[j];
                    var tmp2 = JSON.parse(JSON.stringify(counter));
                    if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                ts.key=keys;
                                ts.value=tmp2.value;
                                value=tmp2.value;
                    }
                    else
                    {
                        ts.key=keys;
                        ts.value=value;
                    }
                }
                ts.name=nm;
                //ts.parser=parses;
                ts.width=width;
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.unit=unit;
                ts.idWidget=idWidget;
                ts.type=tipe;
                ts.key=keys;
                ts.minValue=min;
                ts.maxValue=max;
                ts.color=color;
                ts.minTreshold= mintreshold;
                ts.maxTreshold=maxtreshold;
                tmp.push(ts);
            }

            if (tipe=='VALUE')
            {
                const id_dev= wdt.id_device;
                const keys = wdt.data_key;
                var string = keys.split("-");
                const key = string[0];
                const txt=wdt.name;
                const idWidget=wdt.id;
                const qry="select devices.id_device,devices.name, devices.id_parser, parsers.content from devices LEFT OUTER  JOIN parsers ON  parsers.id= devices.id_parser where id_device='"+id_dev+"' ;";
                const devs = await Device.sequelize.query(qry, { type: QueryTypes.SELECT });
                if (devs==0)
                {  
                    continue;
                }
                const name_dev = devs[0].name; 
                const content = devs[0].content;
                const msg = await Message.findAll({
                    attributes: ['time', 'id_device', 'data'],
                    where: { id_device: id_dev},
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });
              
                if (msg==0)
                {
                    continue;
                }
                var data = msg[0].data;
                var time= msg[0].time;
                var datas =data;
                var resp = getScript(datas,content);
                var ts={};
                for (var j = 0; j < resp.length; j++) {
                    const  counter = resp[j];
                    var tmp2 = JSON.parse(JSON.stringify(counter));
                    if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                ts.key=keys;
                                ts.value=tmp2.value;
                    }
                }
                ts.time=time;
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.name=txt;
                ts.width=width;
                ts.type=tipe;
                ts.idWidget=idWidget;
                tmp.push(ts);

            }

            if (tipe=='VOLUME')
            {
                const id_dev= wdt.id_device;
                const keys = wdt.data_key;
                var string = keys.split("-");
                const key = string[0];
                const txt=wdt.name;
                const idWidget=wdt.id;
                const qry="select devices.id_device,devices.name, devices.id_parser, parsers.content from devices LEFT OUTER  JOIN parsers ON  parsers.id= devices.id_parser where id_device='"+id_dev+"' ;";
                const devs = await Device.sequelize.query(qry, { type: QueryTypes.SELECT });
                if (devs==0)
                {  
                    continue;
                }
                const name_dev = devs[0].name; 
                const content = devs[0].content;
                const msg = await Message.findAll({
                    attributes: ['time', 'id_device', 'data'],
                    where: { id_device: id_dev},
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });
              
                if (msg==0)
                {
                    continue;
                }
                var data = msg[0].data;
                var time= msg[0].time;
                var datas =data;
                var resp = getScript(datas,content);
                var ts={};
                for (var j = 0; j < resp.length; j++) {
                    const  counter = resp[j];
                    var tmp2 = JSON.parse(JSON.stringify(counter));
                    if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                ts.key=keys;
                                ts.value=tmp2.value;
                    }
                }
                ts.time=time;
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.name=txt;
                ts.width=width;
                ts.type=tipe;
                ts.idWidget=idWidget;
                tmp.push(ts);

            }

            if (tipe=='USAGE')
            {
                const id_dev= wdt.id_device;
                const keys = wdt.data_key;
                var string = keys.split("-");
                const key = string[0];
                const txt=wdt.name;
                const idWidget=wdt.id;
                const qry="select devices.id_device,devices.name, devices.id_parser, parsers.content from devices LEFT OUTER  JOIN parsers ON  parsers.id= devices.id_parser where id_device='"+id_dev+"' ;";
                const devs = await Device.sequelize.query(qry, { type: QueryTypes.SELECT });
                if (devs==0)
                {  
                    continue;
                }
                const name_dev = devs[0].name; 
                const content = devs[0].content;
                var date = new Date();
                var tmp_firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                var tmp_firstDay1=new Date(new Date(tmp_firstDay) - 24 * 60 * 60 * 1000);
                var  firstDay=moment(tmp_firstDay).format('YYYY-MM-DD');
                var  firstDay2=moment(tmp_firstDay1).format('YYYY-MM-DD');
                var tmp_lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var tmp_lastDay1=new Date(new Date(tmp_lastDay) - 24 * 60 * 60 * 1000);
                var  lastDay=moment(tmp_lastDay).format('YYYY-MM-DD');
                var  lastDay1=moment(tmp_lastDay1).format('YYYY-MM-DD');
                const msg = await Message.findAll({
                    attributes: ['time', 'id_device', 'data'],
                    where: { id_device: id_dev, 
                        time:{ [Op.lt]: firstDay,
                                [Op.gt]: firstDay2},
                    },
                    order: [
                        ['id', 'ASC']
                    ],
                    limit: 1,
                    raw: true
                });
                if (msg==0)
                {
                    
                    continue;
                }
                for (var j = 0; j < resp.length; j++) {
                    const  counter = resp[j];
                    var tmp2 = JSON.parse(JSON.stringify(counter));
                    if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                        ts.key=key;
                        tmp_val=tmp2.value;
                    }
                }
                var data = msg[0].data;
                var time= msg[0].time;
                var datas =data;
                var resp = getScript(datas,content);
                var ts={};
                const msg2 = await Message.findAll({
                    attributes: ['time', 'id_device', 'data'],
                    where: { id_device: id_dev,   time:{  [Op.gte]: moment().subtract(24, 'HOUR').toDate()}},
                    order: [
                        ['time', 'DESC']
                    ],
                    limit: 1,
                    raw: true
                });
                if (msg2==0)
                {
                    continue;
                }
                var data2 = msg2[0].data;
                var time2= msg2[0].time;
                var resp2= getScript(datas2,content);
                var ts2={};
                for (var j = 0; j < resp2.length; j++) {
                    const  counter = resp2[j];
                    var tmp2 = JSON.parse(JSON.stringify(counter));
                    if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                        ts2.key=key;
                        ts2.value=tmp2.value;
                        tmp_val2=tmp2.value;
                    }
                }

                var hsl=tmp_val2-tmp_val;
                ts.value= hsl;
                ts.time=time;
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.name=txt;
                ts.parser=parses;
                ts.width=width;
                ts.type=tipe;
                ts.idWidget=idWidget;
                tmp.push(ts);
            }

            if (tipe=='TEXT')
            {
                    var ts={};
                    var name=wdt.name;
                    var txt= wdt.text;
                    ts.text=txt;
                    ts.name=name;
                    const idWidget=wdt.id;
                    ts.idWidget=idWidget;
                    ts.type=tipe;
                        ts.width=width;
                    tmp.push(ts);
            }

            if (tipe=='DIVIDER')
            {
                     const idWidget=wdt.id;

                    var ts={};
                    var name=wdt.name;
                    ts.name=name;
                    ts.idWidget=idWidget;
                    ts.type=tipe;
                      ts.width=width;
                    tmp.push(ts);
            }

            if (tipe=='IMAGE')
            {
                    var ts={};
                    var name=wdt.name;
                    var txt= wdt.image;
                    ts.image=txt;
                    ts.name=name;
                    const idWidget=wdt.id;
                    ts.idWidget=idWidget;
                    ts.type=tipe;
                      ts.width=width;
                    tmp.push(ts);
            }

            if(tipe=='MAP')
            {
                var ts={};
                var rs=[];
                var multi_dev=wdt.multi_id_device;
                //var string = multi_dev.split(",");
                if (multi_dev.indexOf(',') > -1)
                {
                    var txt =wdt.name;
                    var string = multi_dev.split(",");
                    for (const str of string)
                    {
                        var jd=[];
                        var fd={};
                        
                        const tracks = await Geoloc.findAll
                        ({
                            attributes: ['lat', 'longitude'],
                            where: {id_device: str},
                            order: [
                                ['id', 'DESC']
                            ],
                            limit: 1,
                            raw: true
                        });

                        

                        for (const dt of tracks)
                        {
                            var js={};
                            console.log()
                            js.lat=dt.lat;
                            js.longitude=dt.longitude;
                            js.time=js.time;
                            jd.push(js);
                        }
                        fd.idDevice=str;
                        fd.loc=jd;
                        rs.push(fd);
                    
                    }
                }
                else
                {
                    var txt =wdt.name;
                    var jd=[];
                    var fd={};
                    const tracks = await Geoloc.findAll
                    ({
                        attributes: ['lat', 'longitude'],
                        where: {id_device: multi_dev},
                        order: [
                            ['id', 'DESC']
                        ],
                        limit: 1,
                        raw: true
                    });
                    var js={};
                  
                    js.lat=tracks[0].lat;
                    console.log('js '+tracks[0].lat);
                    js.longitude=tracks[0].longitude;
                    js.time=tracks[0].time;
                    jd.push(js);
                    fd.idDevice=multi_dev;
                    fd.loc=jd;
                    rs.push(fd);
                }   
               
                ts.name=txt;
                const idWidget=wdt.id;
                ts.idWidget=idWidget;
                ts.type=tipe;
                ts.width=width;
                ts.data=rs;
                tmp.push(ts); 
            }

            if(tipe=='TRACKING')
            {
                var ts={};
                var rs=[];
                var multi_dev=wdt.multi_id_device;
                var string = multi_dev.split(",");
                var txt =wdt.name;
                for (const str of string)
                {
                    var jd=[];
                    var fd={};
                    
                    const tracks = await Geoloc.findAll
                    ({
                        attributes: ['lat', 'longitude','time'],
                        where: {id_device: str},
                        order: [
                            ['id', 'DESC']
                        ],
                        limit: 100,
                        raw: true
                    });

                    

                    for (const dt of tracks)
                    {
                        var js={};
                        js.lat=dt.lat;
                        js.longitude=dt.longitude;
                        
                        js.time=dt.time;
                        jd.push(js);
                    }
                    fd.idDevice=str;
                    fd.loc=jd;
                    rs.push(fd);
                    
                }
                    ts.data=rs;
                    ts.name=txt;
                    const idWidget=wdt.id;
                    ts.idWidget=idWidget;
                    ts.type=tipe;
                    ts.width=width;
                    tmp.push(ts); 
            }

            if(tipe=='TABLE')
            {
                var multi_dev=wdt.multi_id_device;
                var string = multi_dev.split(",");
                var txt =wdt.name;
                var rs=[];
                for (const str of string)
                {
                    var ts={};
                    var jd=[];
                    const qry="select devices.id_device,devices.name, devices.id_parser, parsers.content from devices LEFT OUTER  JOIN parsers ON  parsers.id= devices.id_parser where id_device='"+str+"' ;";
                    const devs = await Device.sequelize.query(qry, { type: QueryTypes.SELECT });
                    if (devs==0)
                    {  
                        continue;
                    }
                    const name_dev = devs[0].name; 
                    const content = devs[0].content;
                    const msg = await Message.findAll({
                        attributes: ['time', 'id_device', 'data'],
                        where: { id_device: str},
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

                    var data = msg[0].data;
                    var time= moment(msg[0].time).format("YYYY-MM-DD HH:mm:ss");
                    var datas =data;
                    var resp=getScript(datas,content);
                    ts.idDevice=str;
                    ts.deviceData=resp;
                    ts.rawData=data;
                    ts.time=time;
                    
                    rs.push(ts);
                }
                var js={};
                js.name=txt;
                const idWidget=wdt.id;
                js.idWidget=idWidget;
                js.data=rs;
                js.width=width;
                js.type=tipe;
                tmp.push(js);
            }

            if(tipe=='LINE_GRAPH')
            {
                var multi_dev=wdt.multi_data_key;
                var string = multi_dev.split(",");
                var txt =wdt.name;
                var rs=[];
                for (const des of string )
                {
                    var tmp_key = des.split("-");
                    var key=tmp_key[0];
                    var id_dev =tmp_key[1];
                    const qry="select devices.id_device,devices.name, devices.id_parser, parsers.content from devices LEFT OUTER  JOIN parsers ON  parsers.id= devices.id_parser where id_device='"+id_dev+"' ;";
                    const devs = await Device.sequelize.query(qry, { type: QueryTypes.SELECT });
                    if (devs==0)
                    {  
                        continue;
                    }
                    const name_dev = devs[0].name; 
                    const content = devs[0].content;
                    var tm= moment().subtract(24, 'HOUR').toDate();
                    var tr=moment(tm).format("YYYY-MM-DD HH:mm:ss"); 
                    const msg = await Message.findAll({
                        attributes: ['time', 'id_device', 'data'],
                        //group: [sequelize.fn('day', sequelize.col('time'))],
                        where: { id_device: id_dev,
                                     time: {
                                              [Op.gte]: tr
                                }
                                 },
                        order: [
                            ['time', 'DESC']
                        ],
                        
                        
                        raw: true
                    });
                    if (msg==0)
                    {
                        continue;
                    }

                    var ts1=[];
                    for (const dt of msg)
                    {
                        var data = dt.data;
                        var time=moment(dt.time).format("YYYY-MM-DD HH:mm:ss"); 
                        var datas =data;
                        var resp=getScript(datas,content);
                        var ts={};
                           
                        for (var j = 0; j < resp.length; j++) {
                            const  counter = resp[j];
                            var tmp2 = JSON.parse(JSON.stringify(counter));
                            if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                    ts.value=tmp2.value;
                                    ts.time=time;
                                    ts1.push(ts);
                            }
                        }
                    }
                    var ts={};
                    ts.idDevice=id_dev;
                    ts.nameDevice= name_dev;
                    ts.key=string;
                    ts.data=ts1;
                    rs.push(ts);
                }
                var js={};
                js.name=txt;
                const idWidget=wdt.id;
                js.idWidget=idWidget;
                js.type=tipe;
                js.data=rs;
                js.width=width;
                tmp.push(js);
            }

            if(tipe=='BAR_GRAPH')
            {
                var multi_dev=wdt.multi_data_key;
                var string = multi_dev.split(",");
                var txt =wdt.name;
                var rs=[];
                for (const des of string )
                {
                    var tmp_key = des.split("-");
                    var key=tmp_key[0];
                    var id_dev =tmp_key[1];
                    const qry="select devices.id_device,devices.name, devices.id_parser, parsers.content from devices LEFT OUTER  JOIN parsers ON  parsers.id= devices.id_parser where id_device='"+id_dev+"' ;";
                    const devs = await Device.sequelize.query(qry, { type: QueryTypes.SELECT });
                    if (devs==0)
                    {  
                        continue;
                    }
                    const name_dev = devs[0].name; 
                    const content = devs[0].content;
                    var tm= moment().subtract(24, 'HOUR').toDate();
                    var tr=moment(tm).format("YYYY-MM-DD HH:mm:ss"); 
                    const msg = await Message.findAll({
                        attributes: ['time', 'id_device', 'data'],
                        //group: [sequelize.fn('day', sequelize.col('time'))],
                        where: { id_device: id_dev,
                                     time: {
                                              [Op.gte]: tr
                                }
                                 },
                        order: [
                            ['time', 'DESC']
                        ],
                        
                        
                        raw: true
                    });
                    if (msg==0)
                    {
                        continue;
                    }

                    var ts1=[];
                    for (const dt of msg)
                    {
                        var data = dt.data;
                        var time=moment(dt.time).format("YYYY-MM-DD HH:mm:ss"); 
                        var datas =data;
                        var resp=getScript(datas,content);
                        var ts={};
                           
                        for (var j = 0; j < resp.length; j++) {
                            const  counter = resp[j];
                            var tmp2 = JSON.parse(JSON.stringify(counter));
                            if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                    ts.value=tmp2.value;
                                    ts.time=time;
                                    ts1.push(ts);
                            }
                        }
                    }
                    var ts={};
                    ts.idDevice=id_dev;
                    ts.nameDevice= name_dev;
                    ts.key=string;
                    ts.data=ts1;
                    rs.push(ts);
                }
                var js={};
                js.name=txt;
                const idWidget=wdt.id;
                js.idWidget=idWidget;
                js.type=tipe;
                js.data=rs;
                js.width=width;
                tmp.push(js);
            }
        }
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'data fetched',
            responseData:tmp
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
    var resp = (func.call(null).call(null, datas));
    return resp;
}