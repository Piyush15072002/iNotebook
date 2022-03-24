const mongoose = require('mongoose');

const schema = mongoose.Schema;

const UserSchema = new schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        default: Date.now
    }
});

// creating our model
const User = mongoose.model('User', UserSchema);


module.exports = User