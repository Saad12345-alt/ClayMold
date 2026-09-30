const mongoose = require('mongoose');
const Admin = require('./admin');
const { connectDatabase } = require('./database');
const { hashPassword } = require('./auth');

const seedAdmin = async () => {
  const databaseTarget = await connectDatabase();

  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log(`Admin user already exists in ${databaseTarget}. No changes made.`);
      return;
    }

    const admin = new Admin({
      username: 'admin',
      password: await hashPassword('password'),
      email: 'admin@shop.com'
    });

    await admin.save();
    console.log(
      `Admin user created in ${databaseTarget}. Username: admin; password: password`
    );
    console.log('Change the default password before deploying to production.');
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin().catch((error) => {
  console.error('Error creating admin:', error.message);
  process.exitCode = 1;
});
