const Connector= require('../models/connector');

exports.postCommand = async (req, res, next) => {
    var debug =true;
    if (debug)
    {
        console.log(req.body);
    }
    try
    {
        var id= req.body.idConnector;
        var name= req.body.name;
        var type=req.body.type;
        var description=req.body.description;
        var recipient= req.body.recipient;
        const usernameExist = await Connector.findAll(
            {where: {id: id}, raw: true},
        );

        if (usernameExist==0)
        {
            return res.status(200).json({
                responseCode:'404',
                responseDesc:'callback not found'
            });
        }
        const updateFence = await Connector.update(
        {
            name: name,
            type: type,
            description:description,
            recipient:recipient
            },
            {
                where:
                {
                    id: id
                }
            }
        );

        if(!updateFence){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'connector successfully updated'
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