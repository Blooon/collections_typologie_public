var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : process.env.SQLHOST,
      user : process.env.SQLLOGIN,
      password : process.env.SQLPASSWORD,
      database : 'typologie'
    }
  });

  module.exports = knex;
