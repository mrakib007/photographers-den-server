const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
// const { ObjectID } = require('mongodb').ObjectID;
const { ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m99d8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("photographersDen").collection("services");
  const adminCollection = client.db('photographersDen').collection('admin');
  const ordersCollection = client.db('photographersDen').collection('service-orders');
  const reviewCollection = client.db('photographersDen').collection('reviews');

  app.post('/addService',(req,res) =>{
    const newProduct = req.body;
    serviceCollection.insertOne(newProduct).then((result)=>{
        res.send(result.insertedCount > 0);
    });
});

app.get('/services',(req,res)=>{
    serviceCollection.find().toArray((err,items)=>{
        res.send(items);
    });
});

app.get('/service/:_id', (req, res) => {
    serviceCollection.find({ _id: ObjectId(req.params._id) }).toArray((err, documents) => {
        res.send(documents);
    });
});

app.get('/servicesOrder',(req,res)=>{
    ordersCollection.find().toArray((err,items)=>{
        res.send(items);
    });
});

app.post('/addServicesOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
        res.send(result.insertedCount > 0);
    });
});

app.delete('/delete/:_id',(req,res)=>{
    serviceCollection.deleteOne({_id: ObjectID(req.params._id)})
    .then((result)=>{
        res.send(result.deletedCount > 0);
    })
    .catch((err)=> console.log(err));
});

app.patch('/update/:_id',(req,res) =>{
    ordersCollection.updateOne(
        {
            _id: ObjectId(req.params._id)
        },
        {
            $set: {
                status: req.body.status,
            }
        }
    )
    .then((result)=>{
        res.send(result.modifiedCount > 0);
    });
});

app.post('/addAdmin',(req,res)=>{
    const admin = req.body;
    adminCollection.insertOne(admin).then((result) =>{
        res.send(result.insertedCount > 0);
    });
});

app.post('/isAdmin',(req,res)=>{
    const {email} = req.body;
    adminCollection.find({email}).toArray((err,documents)=>{
        res.send(documents.length>0);
    });
});

app.post('/addReview',(req,res)=>{
    const review = req.body;
    reviewCollection.insertOne(review).then((result)=>{
        res.send(result.insertedCount>0);
    });
});

app.get('/reviews', (req, res) => {
    reviewCollection.find().toArray((err, documents) => {
        res.send(documents);
    });
});


app.delete('/deleteReview/:_id',(req,res)=>{
    reviewCollection.deleteOne({_id: ObjectId(req.params._id)})
    .then((result)=>{
        res.setDefaultEncoding(result.deletedCount>0);
    })
    .catch((err)=> console.log(err));
});

app.get('/',(req,res)=>{
    res.send('hello from database');
});

});


app.listen(process.env.PORT || port);