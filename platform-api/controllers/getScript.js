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
        var js1 = req.body.js;
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
        let buff = new Buffer(content);
        let base64data = buff.toString('base64');
        const hs = await Parser.findAll({
            where:{name:js1},
            raw:true
        })
        if (hs==0)
        {
             return res.status(200).json({
            'responseCode': "404",
            'responseDesc': "parser not found",
            
        });

        }
        return res.status(200).json({
            'responseCode': "200",
            'responseDesc': "Success",
            'idParser':hs[0].id,
            'name':hs[0].name,
            'description':hs[0].description,
            'data': base64data
           
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