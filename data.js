const client = require('./db')

async function getProperties(){
    try{
        await client.connect();
        const dataBase = client.db('properties');
        const db = dataBase.collection('first')
        const Properties = await db.find({}).toArray();

        return Properties ;
        
    }finally{
        await client.close();
    }
}
module.exports = getProperties;
