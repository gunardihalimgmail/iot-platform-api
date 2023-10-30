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
        const id =req.body.idParser;
        const usernameExist = await Parser.findAll(
                {where: {id: id}, raw: true},
            );
        if (usernameExist==0)
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'PARSER not found'
            });
        }
        const name = usernameExist[0].name;
        const par= await Parser.destroy(
        {
            where:{
            id:id
            }
        });
        return res.status(200).json({
                responseCode:'200',
                responseDesc:'delete parser success'
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