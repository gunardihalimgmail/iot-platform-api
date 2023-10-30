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
        const id= parseInt(req.body.idDashboard);
        const hdr = req.headers.authorization;
        var tmp=[];
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
                            {where: {id: id}, raw: true}
        );

        if (dash==0)
        {
                return res.status(200).json({
                responseCode:'500',
                responseDesc:'dashboard not found'
            });
        }

            const usernameExistss = await Dashbord.destroy(
            {where: {id: id}, raw: true},
        );
        
        return res.status(200).json({
            responseCode:'200',
            responseDesc:'dashboard deleted'
            
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