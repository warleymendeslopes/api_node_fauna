
    var faunadb = require('faunadb')
    var q = faunadb.query
    const dotenv = require('dotenv');
    dotenv.config();
    
    const faunaClient = new faunadb.Client({
      secret: process.env.TOKEN_SECRET,
    });