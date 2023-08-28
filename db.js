
const { MongoClient } = require('mongodb');
const uri = process.env.DB_URL;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;