
const client = require('./db')

async function getProperties(coll , DB){
    try{
        await client.connect();
        const dataBase = client.db(DB);
        const db = dataBase.collection(coll)
        const Properties = await db.find({}).toArray();
        return Properties ;
        
    }finally{
        await client.close();
    }
}
module.exports = getProperties;
