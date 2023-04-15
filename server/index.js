const express = require("express");
const mongo = require('mongodb');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
 

// Connection bits
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'test';

const PORT = process.env.PORT || 3001;

// Set up app
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))





/* NOTES */

/* Schema of skill record:

{
  "_id": {
    "$oid": "6420234435d044ccc2481591"
  },
  "charid": 1,
  "desc": "Strength",
  "mod": 3
}

Schema of character record:

{
  "_id": {
    "$oid": "642020d5368a220e15ea5c21"
  },
  "id": 1,
  "name": "Hardwon",
  "gameType": "dnd"
}

*/






/* WORKERS */

async function getMongoStuff(char) {
  // Use connect method to connect to the server
  await client.connect();
  const db = client.db(dbName);

  if (char == -1) {
    const collection = db.collection('characters');
    const findResult = await collection.find().toArray();
    console.log('Found characters =>', findResult);

    return findResult;
  } else {
    console.log("Looking for skills of char " + char);
    const collection = db.collection('skills');
    const findResult = await collection.find({"charid": parseInt(char)}).toArray();
    console.log('Found documents =>', findResult);

    return findResult;    
  }
}

async function updateMongoStuff(data) {

  let result;
  try {
    await client.connect();
    const database = client.db(dbName);
    const skills = database.collection("skills");

    // TODO: make this filter actually match the records in the database
    // console log incoming ID and IDs of records we find, all that jazz
    // create a filter for a movie to update

    console.log("Update rq data: " + JSON.stringify(data))

    console.log("Looking for skill reocrds with _id " + data['_id']);
    let filterid = new mongo.ObjectId(data['_id']);
    console.log("Filtering by object id " + filterid);
    const filter = { _id: filterid };

    // create a document that sets the deets
    const updateDoc = {
      $set: {
        charid: data.charid,
        desc:data.desc,        
        mod: data.mod
      },
    };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };

    result = await skills.updateOne(filter, updateDoc, options);
    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount}, upserted ${result.upsertedCount}`);
  } finally {
    await client.close();
  }

  return result;
}

async function deleteMongoStuff(data) {

  let result;
  try {
    await client.connect();
    const database = client.db(dbName);
    const skills = database.collection("skills");

    console.log("Delete rq data: " + JSON.stringify(data))

    console.log("Looking for skill reocrds with _id " + data['_id']);
    let filterid = new mongo.ObjectId(data['_id']);
    console.log("Filtering by object id " + filterid);
    const filter = { _id: filterid };

    result = await skills.deleteOne(filter);
    console.log(`${result.matchedCount} document(s) matched the filter`);
  } finally {
    await client.close();
  }

  return result;
}



/* HANDLERS */

app.get("/api/chars", async (req, res) => {
  /* Minor hax - use a better argument to this function */
  mongojson = await getMongoStuff(-1);

  res.json(mongojson);
});

app.get("/api/skills", async (req, res) => {
  console.log(req.query.char);
  // res.json({message: "Strength +4"})
  mongojson = await getMongoStuff(req.query.char);

  res.json(mongojson);
});

/* Deal with POST updating db */
app.post('/api/updateskills', async (req, res) => {

  let data = req.body;
  donezo = await updateMongoStuff(data);

  // res.send(JSON.stringify(donezo));
  res.json(donezo);
});

app.post('/api/deleteskills', async (req, res) => {

  let data = req.body;
  donezo = await deleteMongoStuff(data);

  // res.send(JSON.stringify(donezo));
  res.json(donezo);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

