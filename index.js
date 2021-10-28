const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whaok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("Volunteer-network");
      const eventCollection = database.collection("events");
      const scheduleCollection = database.collection("set-event");


      // GET API
      app.get('/events', async (req, res) => {
        const cursor = eventCollection.find({});
        const events = await cursor.toArray();
        res.send(events)
      })

      app.get('/event/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const event = await eventCollection.findOne(query);
        res.send(event);
      })

      app.get('/userevents/:email', async (req, res) => {
          const email = req.params.email;
          const query = {email: email};
          const cursor = scheduleCollection.find(query);
          const userevents = await cursor.toArray();
          res.send(userevents);
          
      })

      // Post API
      app.post('/setevent', async (req, res) => {
        const newSchedule = req.body;
        const result = await scheduleCollection.insertOne(newSchedule);
        res.json(result);
      });

      // Delete API
      app.delete('/userevents/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await scheduleCollection.deleteOne(query);
        res.json(result);
      })
     
    } finally {
    //   await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})
  
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})