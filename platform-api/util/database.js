const Sequelize = require('sequelize');

 const sequelize = new Sequelize(
    "IOT",
    "loginiot", "!otTIS88jkT", {
    host:"192.168.1.120",
    "dialect":"mssql",
    "port":1433,
    "logging": false,
    dialectOptions: {
        instanceName: "MSSQLSERVER",
		options: {
      encrypt: false,
      enableArithAbort: false
    }
    },
  
},
);

module.exports = sequelize;
