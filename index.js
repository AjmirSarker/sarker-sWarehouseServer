const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z8sx0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});
async function run(){
try{

  await client.connect();
    const productCollection = client.db('warehouse').collection('products');
    app.get('/product',async(req,res)=>{
      const query = {}
      const cursor = productCollection.find(query);
      const items = await cursor.toArray()
      res.send(items)
  })
}
finally{

}
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Running Server');
});
app.listen(port, () => {
  console.log('listening to port', port);
});
