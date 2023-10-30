const Dashbord= require('../models/dashboard');
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
        const name = req.body.name;
        const desc = req.body.description;
        const tokens= req.body.token;
        const hdr = req.headers.authorization;
        const createdTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const usernameExists = await User.findAll(
            {where: {token_key:tokens}, raw: true},
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
        const newUser = await Dashbord.create({ 
            name: name,
            description: desc,
            created_time: createdTime,
            token_key: tokens
        });

        if(!newUser){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        const dash= await Dashbord.findAll(
                            {where: {token_key: tokens,name:name}, raw: true}
        );

        if (dash==0)
        {
             return res.status(200).json({
                responseCode:'500',
                responseDesc:'dashboard not found'
            });
        }

        
        const idDashboard= dash[0].id;
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'dashboard created',
            idDashboard:idDashboard
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
