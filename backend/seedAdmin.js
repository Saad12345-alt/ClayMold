// This script helps create an admin user in the database
// Run with: node seedAdmin.js

const mongoose = require('mongoose');
const Admin = require('./admin');

mongoose.connect("mongodb://localhost:27017/Product");

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Username: admin');
      console.log('Password: password');
      return;
    }

    // Create default admin user
    const newAdmin = new Admin({
      username: 'admin',
      password: 'password', // Change this in production!
      email: 'admin@shop.com'
    });

    await newAdmin.save();
    console.log('✓ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: password');
    console.log('\n⚠️  IMPORTANT: Change the password in production!');
  } catch (err) {
    console.error('Error creating admin:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
