const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// built in middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6iad9fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    app.get("/products", (req, res) => {
      res.send({ msg: "all products" });
    });
  } catch (error) {
    console.log(error);
  }
}
run();
app.get("/", (req, res) => {
  res.send({ msg: "ok" });
});
app.listen(port, () => {
  console.log(`my-shop server is running on port: ${port}`);
});
