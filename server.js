require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.admlqcz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const booksCollection = client.db("bookCatelog").collection("book");
    const reviewsCollection = client.db("bookCatelog").collection("review");
    // Define routes

    app.post("/add-book", async (req, res) => {
      const book = req.body;
      console.log("req", req.body);
      const result = await booksCollection.insertOne(book);
      if (result) res.json(result);
    });
    app.post("/add-review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      if (result) res.json(result);
    });
    app.get("/", async (req, res) => {
      const result = await booksCollection.find({}).toArray();
      if (result) res.json(result);
    });
    app.get("/book-details/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await booksCollection.findOne(query);
      console.log(id, result);
      if (result) res.json(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find({}).toArray();
      if (result) res.json(result);
    });
  } finally {
  }
}
run().catch(console.dir);

// Start the server

app.listen(port, () => {
  console.log(`Your server is running ${port}`);
});
