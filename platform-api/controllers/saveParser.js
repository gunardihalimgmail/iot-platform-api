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
        const name =req.body.fileName;
        const data=req.body.data;
        const desc=req.body.description;
        let decoded = new Buffer(data, 'base64');
        const par= await Parser.create({
            name:name,
            description:desc,
            content:decoded.toString()

        });
        
        return res.status(200).json({
            responseCode:'200',
            responseDesc:"Save Parser Sukses"
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