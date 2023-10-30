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
        const id= req.body.idWidget;
        const period=req.body.period;
        var tmp=[];
        
        const fd = await Widget.findAll({
                where: {id: id}, raw: true
        });
        if (fd==0)
        {
                return res.status(200).json({
                responseCode:'404',
                responseDesc:'widget not found'
            });
        }
        if (period=='HOUR')
        {
            var multi_dev=fd[0].multi_data_key;
            var string = multi_dev.split(",");
            var txt =fd[0].name;
            console.log(txt);
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
                const datenow=  moment().format("YYYY-MM-DD HH:mm:ss");
                const awal = moment().format("YYYY-MM-DD");
                const hari = awal+" 00:00:00";
                const msgqry="SELECT time,id_device,data from messages where id_device ='"+ id_dev+"' AND time BETWEEN '"+hari+"' AND '"+ datenow+"' order by time DESC;";
                const msg= await Message.sequelize.query(msgqry, { type: QueryTypes.SELECT });
                
                if (msg==0)
                {
                        var ts={};
                        ts.idDevice=id_dev;
                        ts.key=des;
                        ts.data='no data';
                        rs.push(ts);
                        continue;
                }

                var ts1=[];
                for (const dt of msg)
                {
                    var data = dt.data;
                    var time= dt.time;
                    var returned_endate=moment(time).format('YYYY-MM-DD HH:mm:ss');
                    var datas =data;
                    var resp=getScript(datas,content);
                    var ts={};
                    for (var j = 0; j < resp.length; j++) {
                        const  counter = resp[j];
                        var tmp2 = JSON.parse(JSON.stringify(counter));
                        if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                ts.value=tmp2.value;
                                ts.time=returned_endate;
                                ts1.push(ts);
                        }
                    }
                }
                var ts={};
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.key=des;
                ts.data=ts1;
                rs.push(ts);
            }
            var js={};
            js.data=rs;
            tmp.push(js);
        }

        if (period=='DAY')
        {
            var multi_dev=fd[0].multi_data_key;
            var string = multi_dev.split(",");
            var txt =fd[0].name;
            console.log(txt);
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
                const datenow=  moment().format("YYYY-MM-DD HH:mm:ss");
                const awal = moment().format("YYYY-MM-DD");
                var sebelum=moment(awal).subtract(3, 'DAY').format("YYYY-MM-DD");
                const hari = sebelum+" 00:00:00";
                const msgqry="SELECT time,id_device,data from messages where id_device ='"+ id_dev+"' AND time BETWEEN '"+hari+"' AND '"+ datenow+"' order by time DESC;";
                const msg= await Message.sequelize.query(msgqry, { type: QueryTypes.SELECT });
                
                if (msg==0)
                {
                        var ts={};
                        ts.idDevice=id_dev;
                        ts.key=des;
                        ts.data='no data';
                        rs.push(ts);
                        continue;
                }

                var ts1=[];
                for (const dt of msg)
                {
                    var data = dt.data;
                    var time= dt.time;
                    var returned_endate=moment(time).format('YYYY-MM-DD HH:mm:ss');
                    var datas =data;
                    var resp=getScript(datas,content);
                    var ts={};
                    for (var j = 0; j < resp.length; j++) {
                        const  counter = resp[j];
                        var tmp2 = JSON.parse(JSON.stringify(counter));
                        if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                ts.value=tmp2.value;
                                ts.time=returned_endate;
                                ts1.push(ts);
                        }
                    }
                }
                var ts={};
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.key=des;
                ts.data=ts1;
                rs.push(ts);
            }
            var js={};
            js.data=rs;
            tmp.push(js);
        }

        if (period=='WEEK')
        {
            var multi_dev=fd[0].multi_data_key;
            var string = multi_dev.split(",");
            var txt =fd[0].name;
            console.log(txt);
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
                const datenow=  moment().format("YYYY-MM-DD HH:mm:ss");
                const awal = moment().format("YYYY-MM-DD");
                var sebelum=moment(awal).subtract(7, 'DAY').format("YYYY-MM-DD");
                const hari = sebelum+" 00:00:00";
                const msgqry="SELECT time,id_device,data from messages where id_device ='"+ id_dev+"' AND time BETWEEN '"+hari+"' AND '"+ datenow+"' order by time DESC;";
                const msg= await Message.sequelize.query(msgqry, { type: QueryTypes.SELECT });
                
                if (msg==0)
                {
                        var ts={};
                        ts.idDevice=id_dev;
                        ts.key=des;
                        ts.data='no data';
                        rs.push(ts);
                        continue;
                }

                var ts1=[];
                for (const dt of msg)
                {
                    var data = dt.data;
                    var time= dt.time;
                    var returned_endate=moment(time).format('YYYY-MM-DD HH:mm:ss');
                    var datas =data;
                    var resp=getScript(datas,content);
                    var ts={};
                    for (var j = 0; j < resp.length; j++) {
                        const  counter = resp[j];
                        var tmp2 = JSON.parse(JSON.stringify(counter));
                        if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                ts.value=tmp2.value;
                                ts.time=returned_endate;
                                ts1.push(ts);
                        }
                    }
                }
                var ts={};
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.key=des;
                ts.data=ts1;
                rs.push(ts);
            }
            var js={};
            js.data=rs;
            tmp.push(js);
        }

        if (period=='MONTH')
        {
            var multi_dev=fd[0].multi_data_key;
            var string = multi_dev.split(",");
            var txt =fd[0].name;
            console.log(txt);
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
                const datenow=  moment().format("YYYY-MM-DD HH:mm:ss");
                const awal = moment().format("YYYY-MM");
                const hari = awal+"-01 00:00:00";
                const msgqry="SELECT time,id_device,data from messages where id_device ='"+ id_dev+"' AND time BETWEEN '"+hari+"' AND '"+ datenow+"' order by time DESC;";
                const msg= await Message.sequelize.query(msgqry, { type: QueryTypes.SELECT });
                
                if (msg==0)
                {
                        var ts={};
                        ts.idDevice=id_dev;
                        ts.key=des;
                        ts.data='no data';
                        rs.push(ts);
                        continue;
                }

                var ts1=[];
                for (const dt of msg)
                {
                    var data = dt.data;
                    var time= dt.time;
                    var returned_endate=moment(time).format('YYYY-MM-DD HH:mm:ss');
                    var datas =data;
                    var resp=getScript(datas,content);
                    var ts={};
                    for (var j = 0; j < resp.length; j++) {
                        const  counter = resp[j];
                        var tmp2 = JSON.parse(JSON.stringify(counter));
                        if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                ts.value=tmp2.value;
                                ts.time=returned_endate;
                                ts1.push(ts);
                        }
                    }
                }
                var ts={};
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.key=des;
                ts.data=ts1;
                rs.push(ts);
            }
            var js={};
            js.data=rs;
            tmp.push(js);
        }

        if (period=='YEAR')
        {
            var multi_dev=fd[0].multi_data_key;
            var string = multi_dev.split(",");
            var txt =fd[0].name;
            console.log(txt);
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
                const datenow=  moment().format("YYYY-MM-DD HH:mm:ss");
                const awal = moment().format("YYYY");
                const hari = awal+"01-01 00:00:00";
                const msgqry="SELECT time,id_device,data from messages where id_device ='"+ id_dev+"' AND time BETWEEN '"+hari+"' AND '"+ datenow+"' order by time DESC;";
                const msg= await Message.sequelize.query(msgqry, { type: QueryTypes.SELECT });
                
                if (msg==0)
                {
                        var ts={};
                        ts.idDevice=id_dev;
                        ts.key=des;
                        ts.data='no data';
                        rs.push(ts);
                        continue;
                }

                var ts1=[];
                for (const dt of msg)
                {
                    var data = dt.data;
                    var time= dt.time;
                    var returned_endate=moment(time).format('YYYY-MM-DD HH:mm:ss');
                    var datas =data;
                    var resp=getScript(datas,content);
                    var ts={};
                    for (var j = 0; j < resp.length; j++) {
                        const  counter = resp[j];
                        var tmp2 = JSON.parse(JSON.stringify(counter));
                        if (tmp2.key !== '' && tmp2.hasOwnProperty('value') && tmp2.value !== '' && tmp2.key==key) {
                                ts.value=tmp2.value;
                                ts.time=returned_endate;
                                ts1.push(ts);
                        }
                    }
                }
                var ts={};
                ts.idDevice=id_dev;
                ts.nameDevice= name_dev;
                ts.key=des;
                ts.data=ts1;
                rs.push(ts);
            }
            var js={};
            js.data=rs;
            tmp.push(js);
            
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