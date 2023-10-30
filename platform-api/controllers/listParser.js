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
        const hdr = req.headers.authorization;
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
        const parsers =  await Parser.findAll({
            raw:true
        });
        if (parsers==0)
        {
            res.status(200).json({
                responseCode:'500',
                responseDesc:'parser not found'
            });

        }
        var tmp =[];

        for (const prs of parsers)
        {
            var js1={};
            js1.id=prs.id;
            js1.name=prs.name;
            js1.description=prs.description;
            tmp.push(js1);
        }

        return res.status(200).json({
                responseCode:'200',
                responseDesc:'parser fetched',
                responseData: tmp
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