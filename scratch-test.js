const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/writesphere';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: { type: String, select: false }
});

const User = mongoose.model('User', UserSchema);

async function test() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to DB');

  const users = await User.find().select('+password +provider');
  console.log('Total users:', users.length);
  for (const u of users) {
    console.log(`User: ${u.name}, Email: ${u.email}, Provider: ${u.provider}, Hash: ${u.password}`);
    const match = await bcrypt.compare('Password123', u.password || '');
    console.log(`Password match check for 'Password123':`, match);
  }
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});
