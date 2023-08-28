const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 4000;
const app = express()
const client = require('./db')
const getProperties= require('./data')

app.use(cors())
app.use(express.json())

app.get('/for-buy-properties/:propertiesType', async (req, res) => {
  const propertiesType = req.params.propertiesType
  try {
    const properties = await getProperties(`${propertiesType}`,'properties');
    res.json(properties);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/for-rent-properties/:propertiesType', async (req, res) => {
  const propertiesType = req.params.propertiesType
  try {
    const properties = await getProperties(`${propertiesType}`,'RentProperties');
    res.json(properties);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get('/for-rent-properties/:propertiesType/:id', async (req, res) => {
  const propertyId = req.params.id;
  const propertiesType = req.params.propertiesType
  try {
    const properties = await getProperties(`${propertiesType}`,'RentProperties');
    const property = properties.find(prop => prop.id == propertyId);
    console.log(property);
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

app.get('/for-buy-properties/:propertiesType/:id', async (req, res) => {
  const propertyId = req.params.id;
  const propertiesType = req.params.propertiesType

  try {
    const properties = await getProperties(`${propertiesType}`,'properties');
    const property = properties.find(prop => prop.id == propertyId);

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

app.post('/List-new', async (req, res) => {
  const property = req.body;
  const DB = property.list === 'rent'? 'RentProperties' : 'properties'
  console.log(property);
  try {
    await client.connect();
    const myDatabase = client.db(`${DB}`);
    const collection = myDatabase.collection(`${property.type}`);

    const result = await collection.insertOne(property);

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

app.post("/search", async (req, res) => {
  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  try {
    const filters = req.body; 
    await client.connect();
    const DB = filters.type === 'rent' ? 'RentProperties' : 'properties';
    const dataBase = client.db(`${DB}`);
    const propertiesCollection = dataBase.collection(`${filters.propertyType}s`); 
    const query = [];

    if (filters.propertyType !== "") {
      query.push({
        $match: {
          type: capitalizeFirstLetter(filters.propertyType)
        }
      });
    }

    if (filters.beds !== "") {
      query.push({
        $match: {
          "specifications": `${filters.beds} bedrooms`
        }
      });
    }

    if (filters.minPrice !== "") {
      query.push({
        $match: {
          price: { $gte: parseFloat(filters.minPrice) }
        }
      });
    }

    if (filters.maxPrice !== "") {
      query.push({
        $match: {
          price: { $lte: parseFloat(filters.maxPrice) }
        }
      });
    }

    console.log(filters);
    const results = await propertiesCollection.aggregate(query).toArray();
    res.json(results);
    console.log(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "An error occurred" });
  }finally{
    client.close()
  }
});


app.listen(PORT ,()=>{
    console.log('app is listning on port ' + PORT );
})
