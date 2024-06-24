var MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017';
const dbName = 'notes';
const collectionName = "notesCollection"

async function connectDB(){

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('MongoDB connected');
    
    let collection = await client.db(dbName).collection(collectionName);
    return collection;
    
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

};

module.exports = connectDB;