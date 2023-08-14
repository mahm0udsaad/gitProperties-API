
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mahmoud_saad:test1234@cluster0.ijknl.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = client;