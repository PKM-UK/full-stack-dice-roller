const express = require("express");
const { MongoClient } = require('mongodb');

// Connection bits
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'test';

const PORT = process.env.PORT || 3001;

const app = express();

async function getMongoStuff() {
  // Use connect method to connect to the server
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('skills');

  const findResult = await collection.find({"charid": 1}).toArray();
  console.log('Found documents =>', findResult);

  return findResult;
}

app.get("/api", async (req, res) => {
  // res.json({message: "Strength +4"})
  mongojson = await getMongoStuff();

  /* res.json([
    {type: "dnd", desc: "Strength +3", mod: 3},
    {type: "dnd", desc: "Dex +1", mod: 1},
    {type: "dw", desc: "Spout Lore +2", mod: 2},
    {type: "bitd", desc: "Wreck 3d", mod: 3}
  ]); */

  res.json(mongojson);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

