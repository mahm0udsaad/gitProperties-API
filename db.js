
const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.DB_URL;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;