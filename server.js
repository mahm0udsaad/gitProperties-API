const express = require('express')
const cors = require('cors')
const PORT = 9000 ;
const app = express()
const client = require('./db')
const getProperties= require('./data')

app.use(cors())
app.use(express.json())


app.get('/properties', async (req, res) => {
  try {
    const properties = await getProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
app.get('/properties/:id', async (req, res) => {
  const propertyId = req.params.id;

  try {
    const properties = await getProperties();
    const property = properties.find(prop => prop.id === propertyId);

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});
app.post('/properties', async (req, res) => {
  const propertyToAdd = req.body;

  try {
    await client.connect();
    const myDatabase = client.db('properties');
    const collection = myDatabase.collection('first');

    const result = await collection.insertOne(propertyToAdd);

    if (result.insertedCount === 1) {
      res.json({ message: 'Property inserted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to insert property' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    await client.close();
  }
});

app.listen(PORT ,()=>{
    console.log('app is listning on port ' + PORT );
})

process.on('exit', () => {
  client.close();
});

// Handle other signals like Ctrl+C, uncaught exceptions, etc.
process.on('SIGINT', () => {
  client.close();
  process.exit();
});