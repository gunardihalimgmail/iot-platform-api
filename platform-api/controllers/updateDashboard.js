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
        const idDashboard=req.body.idDashboard;
        const hdr = req.headers.authorization;
        const createdTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const usernameExists = await User.findAll(
            {where: {token:hdr}, raw: true},
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
        const dash= await Dashbord.findAll(
            {where: {id: idDashboard}, raw: true}
        );

        if (dash==0)
        {
                return res.status(200).json({
                responseCode:'500',
                responseDesc:'dashboard not found'
            });
        }

        const newUser = await Dashbord.update({ 
            name: name,
            description: desc
        },
         {where: {id: idDashboard}, raw: true});


        
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'dashboard updated'
        });

    }
    catch(err)
    {
        if (debug)
        {
            console.log(err);
        }

        res.status(200).json({
            responseCode:'500',
            responseDesc:err
        });
    }
}