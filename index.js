const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// luminarylabs
// xNGQNSRpTg3MMnDD

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yuxyuxp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandcollection = client.db("labsDB").collection("brands");
    const phonesCollection = client.db("labsDB").collection("phones");
    const addCollection = client.db("labsDB").collection("cart");

    app.get("/brands", async (req, res) => {
      const cursor = brandcollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/phones", async (req, res) => {
      const phone = req.body;
      console.log(phone);
      const result = await phonesCollection.insertOne(phone);
      res.send(result);
      console.log(result);
    });

    app.get("/phones", async (req, res) => {
      const cursor = phonesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    
    app.get("/phone/:brand?", async (req, res) => {
      const { brand } = req.params;
      try {
        const query = brand ? { brand: brand } : {};
        const cursor = phonesCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching phones:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/phones/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Received ID:", id);
      const query = { _id: new ObjectId(id) };
      const result = await phonesCollection.findOne(query);
      res.send(result);
      console.log(result);
    });


    app.put("/phones/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatePhone = req.body;
      const phone = {
        $set: {
          image: updatePhone.image,
          name: updatePhone.name,
          brand: updatePhone.brand,
          price: updatePhone.price,
          type: updatePhone.type,
          description: updatePhone.description,
          rating: updatePhone.rating,
        },
      };
      const result = await phonesCollection.updateOne(filter, phone, options);
      res.send(result);
      console.log(result);
    });


    app.post("/cart", async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await addCollection.insertOne(cart);
      res.send(result);
      console.log(result);
    });

    app.get("/cart", async (req, res) => {
      const cursor = addCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("LuminaryLabs Server is running");
});

app.listen(port, () => {
  console.log(`port running at ${port}`);
});
