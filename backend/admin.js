const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: { type: Date, default: Date.now }
})

const adminDatabase = mongoose.connection.useDb(
    process.env.MONGODB_ADMIN_DATABASE || 'adminDB'
);
const Admin = adminDatabase.model("Admin", adminSchema);

module.exports = Admin;
