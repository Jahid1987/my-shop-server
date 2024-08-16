const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// built in middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://my-shop-59336.web.app",
      "https://my-shop-59336.firebaseapp.com",
    ],
  })
);
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const buildQuery = require("./utils/buildQuery");
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
    // collections
    const productCollection = client.db("my-shop").collection("products");

    // fetching all products
    app.get("/products", async (req, res) => {
      // pagination functionality
      const query = req.query;
      const page = parseInt(query.page);
      const size = parseInt(query.size);
      const filteringTerms = JSON.parse(query.terms);
      const dateSort = query.dateSort;
      const priceSort = query.priceSort;

      // filtering functionality
      const filter = buildQuery({ ...filteringTerms });

      // sorting on price, createdAt
      let sort = {};

      if (priceSort !== "") {
        sort.price = parseInt(priceSort);
      } else if (dateSort !== "") {
        sort.createdAt = parseInt(dateSort);
      } else {
        sort = {};
      }

      const products = await productCollection
        .find(filter)
        .sort(sort)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.status(200).send(products);
    });

    // fetching amount of products
    app.get("/productcount", async (req, res) => {
      // filtering functionality
      const query = req.query;
      const filteringTerms = JSON.parse(query.terms);
      const filter = buildQuery({ ...filteringTerms });
      const count = await productCollection.countDocuments(filter);

      res.send({ count });
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
