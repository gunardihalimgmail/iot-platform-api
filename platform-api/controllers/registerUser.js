const moment = require('moment');
const User = require('../models/user');
var crypto = require('crypto');
var sha1 = require('sha1');
exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    try
    {
        var nameUser= req.body.usernameUser;
        var pwdUser=req.body.passwordUser;
        var nameAdmin= req.body.token;
        var roles = parseInt(req.body.userRole);
        const usernameExists = await User.findAll(
            {where: {username: nameUser}, raw: true},
        );
        
        if(usernameExists.length >= 1){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'account already registered'
            });
        }

        const admin  = await User.findAll(
            {where: {token_key: nameAdmin}, raw: true},
        );

         if(admin == 0){
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'username admin not found'
            });
        }

        const id= admin[0].id;
        console.log(id);

        const createdTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const tokenUser =  crypto.randomBytes(64).toString('hex');
        const hashedPassword = sha1(pwdUser);

        const newUser = await User.create({ 
            username: nameUser,
            password: hashedPassword,
            created: createdTime,
            role:roles,
            priv:id,
            token_key: tokenUser
        });

        if(!newUser){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        res.status(200).json({
            responseCode:'200',
            responseDesc:'account successfully registered'
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