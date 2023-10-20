const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sml8dnv.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("brandshopDB");
    const userCollection = database.collection("users");
    const productCollection = database.collection("products");

    app.get("/brands/:brand", async (req, res) => {
        const query = {brand: req.params.brand};
        const cursor = productCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/brands/:brand/:_id", async (req, res) => {
      const query = {_id: new ObjectId(req.params._id)};
      const result = await productCollection.findOne(query);;
      res.send(result);
  })
    
    app.post("/addproduct", async (req, res) => {
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})

