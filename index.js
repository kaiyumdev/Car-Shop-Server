const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hq31bdr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const serviceCollection = client.db('car-shop').collection('services');
        const orderCollection = client.db('car-shop').collection('orders');

        app.get("/services", async(req, res) =>{
          const query = {}
          const cursor = serviceCollection.find(query);
          const services = await cursor.toArray();
          res.send(services);

        })

        app.get("/services/:id", async(req, res) =>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
          const service = await serviceCollection.findOne(query);
          res.send(service);
        })

        app.post("/orders", async(req, res) => {
          const order = req.body;
          const result = await orderCollection.insertOne(order)
          res.send(result);
        })

        app.get("/orders", async(req, res) => {
          console.log(req.query);
          const query = {}
          const cursor = orderCollection.find(query)
          const result = await cursor.toArray()
          res.send(result)
        });

        app.patch("/orders/:id", (req, res) => {
          const id = req.params.id
          const status = req.query.status
          const query = { _id: ObjectId(id)}
          const updateDoc = {
            $set: {
              status: status,
            }
          }
          const result = orderCollection.updateOne(query, updateDoc)
          res.send(result)

        });
        
        app.delete("/orders/:id", async(req, res) => { 
          const id = req.params.id;
          const query = { _id: new ObjectId(id)}
          const result = await orderCollection.deleteOne(query);
          res.send(result);
        })
    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
