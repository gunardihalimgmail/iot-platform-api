const moment = require('moment');
const User = require('../models/user');
var crypto = require('crypto');

exports.postCommand = async (req, res, next) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const tokenFirebase = req.body.token_firebase;
        const createdTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const expire =  moment().add(180, 'minutes').tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
        const user = await User.findAll({
            where:{username: username},
            raw:true
        });
        const js={};
        if(user == 0){
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'user not found'
            });
        }
        const hash= (password);
                const passwordMatch =user[0].password;
                console.log(passwordMatch);
                console.log(hash);
                const tokens = randomValueHex(16);
                if(passwordMatch!=hash){
                    return res.status(200).json({
                        responseCode:'500',
                        responseDesc:'password does not match username'
                    });
                }
                if (tokenFirebase!==null) 
                {
                    const updateTokenFirebase = await User.update(
                        {token_firebase:tokenFirebase,last_login:createdTime, expired_token: expire, token:tokens },
                        {where:{username: username}}  
                    );
                    
                    if(!updateTokenFirebase){
                        return res.status(200).json({
                            responseCode:'500',
                            responseDesc:'error updating Firebase Token'
                        });
                    }
                }
                else
                {
                   const updateTokenFirebase = await User.update(
                        {last_login:createdTime},
                        {where:{username: username}}  
                    );
                    
                    if(!updateTokenFirebase){
                        return res.status(500).json({
                            responseCode:'-1',
                            responseDesc:'Failed insert token'
                        });
                    } 
                }
                
                js.username=user[0].username;
                js.name=user[0].name;
                js.userLevel=user[0].role;
                js.token= user[0].token_key;
                js.lastLogin=createdTime;
                js.avatar =user[0].avatar;
                js.lastUpdate=user[0].last_update;
                js.created=user[0].created;
                js.tokenExpireDate=expire;
                js.tokenAccess= tokens;
                return res.status(200).json({
                    responseCode:'200',
                    responseDesc:'login success',
                    responseData:js
                    
                });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            responseCode: 'failed',
            responseDesc: err
        });
    }
}

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len).toUpperCase();   // return required number of characters
}