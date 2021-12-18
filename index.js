const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());



// ${process.env.DB_USER}: ${process.env.DB_PASS}
//DB_USER=mydbuser1      DB_PASS=Q0AlzP3yLxbR7NDs

const uri = "mongodb+srv://mydbuser1:Q0AlzP3yLxbR7NDs@cluster0.h7sw1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

client.connect(err => {
    const productsCollection = client.db("e-shop").collection("products");
    const purchaseInfo = client.db("e-shop").collection("purchase-info");
    const addToCartProducts = client.db("e-shop").collection("cart-products");
    // perform actions on the collection object


    app.get("/products", async (req, res) => {
        const products = await productsCollection.find({}).toArray();
        res.send(products);
    });
    app.get("/cart-products", async (req, res) => {
        const products = await addToCartProducts.find({}).toArray();
        res.send(products);
    });
    app.get("/details/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const filteredProds = await productsCollection.findOne(filter);
        res.send(filteredProds);
    });
    app.delete("/delete/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const deletedProduct = await addToCartProducts.deleteOne(filter);
        res.send(deletedProduct)
    });




    app.post('/purchase-details', async (req, res) => {
        const query = req.body;
        const purchaseInformation = await purchaseInfo.insertOne(query);
        res.send(purchaseInformation);
    });


    app.post('/add-to-cart', async (req, res) => {
        const query = req.body;
        const cartedProduct = await addToCartProducts.insertOne(query);
        res.send(cartedProduct);
    });


});


app.get('/', (req, res) => {
    res.send('welcome home page');
});


app.listen(port, () => {
    console.log('surver running on port:', port);
});
