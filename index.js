const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8sx0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db('warehouse').collection('products');
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });
    // update
    app.put('/products/:id', async (req, res) => {
      const id = req.params;
      const updatedProduct = req.body;
      console.log(updatedProduct);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
              quantity: updatedProduct.quantity
          },
      };
      const result = await productCollection.updateOne(filter, updateDoc, options);
      res.send(result);
  })
  } finally {
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Running Server');
});
app.listen(port, () => {
  console.log('listening to port', port);
});
