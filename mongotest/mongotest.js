const { MongoClient } = require('mongodb');

// Connection bits
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'test';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('characters');

  const findResult = await collection.find({}).toArray();
  console.log('Found documents =>', findResult);

  return 'done.';
}

dbpromise = main()
console.log("DB promise = " + dbpromise);
dbpromise.then(console.log)
  .catch(console.error)
  .finally(() => client.close());