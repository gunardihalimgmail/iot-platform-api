const moment = require('moment');
const User = require('../models/user');
const Parser = require('../models/parsers');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }

    try
    {
        var rawData = req.body.data;
        var js1 = req.body.js;
        //var tmp = fs.readFileSync('/opt/node/js/' + js1, 'utf8');
        const name1 = await Parser.findAll({
            where: {  name:js1 },
            order: [
                ['id', 'DESC']
            ],
            limit: 1,
            raw: true
        });
        if (name1==0)
        {
             return res.status(200).json({
                responseCode:'404',
                responseDesc:'no parser yet'
                });
        }

        const content= name1[0].content;
        var datas = rawData;
        var header = 'function myFile(data){';
        var footer = '}';
        var coder = header + content + footer;
        var wrap = s => "{ return " + coder + " };"
        var func = new Function(wrap(coder));
        var resp = (func.call(null).call(null, datas));
        return res.status(200).json({
            responseCode: "200",
            responseDesc: "Success",
            data: resp
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