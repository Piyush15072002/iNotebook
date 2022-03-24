const mongoose = require('mongoose');

const schema = mongoose.Schema;

const NotesSchema = new schema({


    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    timestamp: {
        type: String,
        default: Date.now
    },

    // now we will connect our User model with the Notes model using the User's Id
    user: {
        // this is like a foreign key that is a primary key of another table and used here to connect
        type: schema.Types.ObjectId,
        ref: 'User'
    }
});

// exporting our model
module.exports = mongoose.model('Note', NotesSchema);