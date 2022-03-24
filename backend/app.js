if (process.env.NODE_ENV !== 'production') {    // if not in production mode then require dotenv
    require('dotenv').config();
};

const express = require('express');
const app = express();

// cors for the api to connect with the front end
const cors = require('cors');
app.use(cors());


// connecting to our database 
const connectToMongo = require('./database.js');
connectToMongo();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));


// Listening

PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('Listening to server...');
})