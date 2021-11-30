const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzciw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("jovial_trips");
        const eventsCollection = database.collection("events");
        const bookingCollection = database.collection("booking");

        // get all events data
        app.get('/events', async (req, res) => {
            const eventsData = eventsCollection.find({});
            const result = await eventsData.toArray();
            res.json(result)
        });
        // get a event by id
        app.get('/event/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await eventsCollection.findOne(query);
            res.json(result);
        });

        // get api to find orders  by email
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            let resultData;
            if (email) {
                const query = { email: email };
                resultData = await bookingCollection.find(query);
            } else {
                resultData = await bookingCollection.find({});
            }
            const result = await resultData.toArray();
            // console.log(query);
            res.json(result);
        });

        // post req to add Tour booking
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        })
        // delete order booking
        app.delete('/deleteorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('jovial trips server is running!!!')
})

app.listen(port, () => {
    console.log(`jovial trips server is running at http://localhost:${port}`)
})