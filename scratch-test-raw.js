const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb://localhost:27017/writesphere';

async function test() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log('Connected to DB');

  const db = client.db('writesphere');
  const users = await db.collection('users').find().toArray();
  console.log('Total users:', users.length);
  for (const u of users) {
    console.log(JSON.stringify(u, null, 2));
  }
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
