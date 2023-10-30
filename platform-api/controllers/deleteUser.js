const moment = require('moment');
const User = require('../models/user');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    try
    {
        var nameUser= req.body.usernameUser;
        const usernameExists = await User.destroy(
            {where: {username: nameUser}, raw: true},
        );

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'account successfully delete'
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