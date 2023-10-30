const moment = require('moment');
const User = require('../models/user');
const sha1= require('sha1');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    try
    { 
        const token = req.body.token;
        const password = req.body.newPassword;
        const usernameExists = await User.findAll(
            {where: {token_key: token}, raw: true},
        );
        
        if(usernameExists == 0){
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'account not found'
            });
        }
        const createdTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');r 
        const hashedPassword = sha1(password);
        const newUser = await User.update({ 
            password: hashedPassword,
            last_update: createdTime
           
        },
        {
            where:
            {
                token_key: token
            }
        }
        );
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'change password success'
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