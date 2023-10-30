const moment = require('moment');
const User = require('../models/user');
var crypto = require('crypto');
const List_dev = require('../models/list_dev');
const Device = require('../models/device');
const AlertData = require('../models/alertData'); 
const Alert= require('../models/alerts');
const Message = require('../models/message');
const alert = require('../models/alerts');
const Geoloc = require('../models/geoLoc');
const sequelize = require("sequelize");
const { QueryTypes } = require('@sequelize/core');

exports.postCommand = async (req, res, next) => {
    try{
        const key = req.headers.authorization;
        const createdTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const usernameExists = await User.findAll(
            {where: {token:key}, raw: true},
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
        const avatar = usernameExists[0].avatar;
        const token_key= usernameExists[0].token_key;
        const role = usernameExists[0].role;
        //console.log(role);
        const id = usernameExists[0].id;

        if (role==0)
        {
            var json ={};
            var deviceDetail=[];
            var sql ="SELECT devices.id_device as idDevice, parsers.content as content  from devices RIGHT JOIN parsers on parsers.id= devices.id_parser ;" ;
            var act= await Device.sequelize.query(sql, { type:sequelize.QueryTypes.SELECT});
            for (var i =0;i<act.length;i++)
            {
                var idDevice=act[i].iddevice;
                var content= act[i].content;
                var sqlmsg="SELECT messages.data as data,messages.time as time, geolocs.lat as latitude , geolocs.longitude as longitude  from messages   LEFT OUTER JOIN geolocs ON messages.id_device=geolocs.id_device where messages.id_device='"+idDevice+"' order by messages.id DESC limit 1;";
                var  msg=await Message.sequelize.query(sqlmsg, { type:sequelize.QueryTypes.SELECT});
                if (msg>0)
                {
                    var latitude= msg[0].latitude;
                    var longitude=msg[0].longitude;
                    var datas=msg[0].data;
                    var time= msg[0].time;
                    var resp = await getScript(datas,content);
                    var js = {};
                    js.idDevice=idDevice;
                    js.latitude=latitude;
                    js.longitude= longitude;
                    js.time=time;
                    js.rawData=datas;
                    js.data=resp;
                    deviceDetail.push(js);
                }
                else (msg.length>0)
                {
                    var latitude= '-6.175392';
                    var longitude='106.827153';
                    var datas=null;
                    var time=null;
                   // var resp = await getScript(datas,content);
                    var js = {};
                    js.idDevice=idDevice;
                    js.latitude=latitude;
                    js.longitude= longitude;
                    js.time=time;
                    js.rawData=datas;
                    js.data=resp;
                    deviceDetail.push(js);
                }
            }
        }

        

        return res.status(200).json({
            responseCode: 'ok',
            responseDesc: 'getDashboard Success',
            responseData:deviceDetail
        });


    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            responseCode: 'failed',
            responseDesc: err
        });
    }
}

async function getScript(datas,script)
{
    var header = 'function myFile(data){';
    var footer = '}';
    var coder = header + script + footer;
    var wrap = s => "{ return " + coder + " };"
    var func = new Function(wrap(coder));
    var resp = (func.call(null).call(null, datas));
    return resp;
}

