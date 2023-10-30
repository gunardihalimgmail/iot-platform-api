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
        const newUser = await Connector.destroy(
                {where: {id: id}, raw: true},
            );

        if(!newUser){
            return res.status(200).json({
                responseCode:'500',
                responseDesc:'can not insert data to database'
            });
        }

        return res.status(200).json({
            responseCode:'200',
            responseDesc:'connector successfully deleted'
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