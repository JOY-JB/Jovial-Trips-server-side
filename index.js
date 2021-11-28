const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nzciw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db("jovial_trips");
        const eventsCollection = database.collection("events");
        // get all events data
        app.get('/events', async (req,res)=>{
            const eventsData = eventsCollection.find({});
            const result = await eventsData.toArray();
            res.json(result)
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