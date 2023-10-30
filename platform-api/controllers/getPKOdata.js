const sequelize = require("sequelize");
const pko= require('../models/getPko');

exports.postCommand = async (req, res, next) => {
    var debug =true;
  
    try
    {
        const data = await pko.findAll(
            { aw: true},
        );
        
        return res.status(200).json({
            responseCode: '200',
            responseDesc: 'success',
            data: data
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