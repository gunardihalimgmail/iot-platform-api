const Connector= require('../models/connector');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    try
    {
        var name= req.body.name;
        var type=req.body.type;
        var description=req.body.description;
        var recipient= req.body.recipient;
        var token= req.body.token;
        const newUser = await Connector.create({ 
            name: name,
            type: type,
            description:description,
            recipient:recipient,
            token_key:token
        });

        if(!newUser){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'connector successfully registered'
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