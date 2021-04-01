const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5fii4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const mobileCollection = client.db("mobileData").collection("mobile");

  app.get("/mobiles", (req, res) => {
    mobileCollection.find()
    .toArray((err, items) => {
      res.send(items);
      // console.log('Db Items', items);
    })
  })

  app.get("/mobile/:id", (req, res) => {
    const id = ObjectID(req.params.id)
    mobileCollection.find(id)
    .toArray((err, documents) => {
      res.send(documents[0]);
    });
  });


  app.post("/addMobile", (req, res) => {
    const addNewMobile = req.body;
    console.log("new Mobile", addNewMobile);
    mobileCollection.insertOne(addNewMobile).then((result) => {
      console.log("Inserted Count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    const id = ObjectID(req.params.id)
    mobileCollection.deleteOne({_id: id})
    .then(result => {
      console.log(result.deletedCount > 0);
    })
  })

});


client.connect((err) => {
  const orderCollection = client.db("mobileData").collection("orders");
  
  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
    console.log(newOrder);
  })

  app.get("/orders", (req, res) => {
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
