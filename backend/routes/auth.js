const express = require('express');
const User = require('../models/User.js');

// our password hasher
const bcrypt = require('bcryptjs');

// express validator
const { body, validationResult } = require('express-validator');

// our router
const router = express.Router();

// JWT 
// JWT stands for JSON-Web-Token
// It is a Authentication package that provides token for user auth
// there are 3 parts in the token, first carries the algorithms info like HMAC or SHA256 etc, second carries the Data and third carries the Signature of the secret
// Signature or signed token are like seal on jar, if someone trys to change them, the seal will break and we cannot access it 
// JWT provides us with secured connections between user and server just like passport

const jwt = require('jsonwebtoken');
const JWT_Secret = "ThisIsSonGoku";

// importing our middlewares
const fetchUser = require('../middlewares/fetchUser.js');

//* ROUTE 1 - REGISTERING A NEW USER - /api/auth/createuser
// we will create an array and pass it in as an callback middleware which will validate the input
router.post('/createuser',
    [
        body('username', 'Username should have more than 3 characters').isLength({ min: 3 }),  // length should be more than 5 chars
        body('email', 'Enter a valid Email').isEmail(),    // should be valid syntax email
        body('password', 'Password should have more than 3 characters').isLength({ min: 3 })   // should be more than 5 chars
    ],
    async (req, res) => {

        let success = false;

        const errors = validationResult(req);

        if (!errors.isEmpty()) { // if the error container is not empty means there are errors
            return res.status(400).json({ success, errors: errors.array() });    // return error
        }   // else if no errors then move next

        // we are getting this code from docs of express-validator

        // since we have validated the user info, now we will check if the email is unique or not
        // we are using as Email primary key to make each user unique so

        try {

            let user = await User.findOne({ email: req.body.email });

            // if we manage to find a user with the given email means it already exist

            if (user) {   // if user exist is true
                return res.status(400).json({ success, error: "Sorry! A user with this email already exists" })
            }
            // if it comes here means there are no errors

            // hashing user's password

            // creating a salt to add in password
            const salt = await bcrypt.genSalt(10);

            // hashing password and adding salt
            securedPassword = await bcrypt.hash(req.body.password, salt);

            // creating a new user
            user = await User.create({
                username: req.body.username,
                email: req.body.email,
                password: securedPassword,
            });

            // since the user was created so now we will store the auth info for login

            const data = {
                user: {
                    id: user.id    // accessing the user using ID 
                }
            };  // req.user.id

            // it is synchronous method so we do not need to add 'await'
            // this method info is given in docs of 'jwt npm'
            // signing our secret and data and creating a token
            const authToken = jwt.sign(data, JWT_Secret);

            // we are storing the auth info for the user now and in the login route,
            // we can see how to verify if someone broke seal or not
            // we will verify the token and log in the user 

            success = true;
            res.json({ success, authToken });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("<h1>Internal Server Error :-(</h1>");
        }

        // code from the docs
        // .then(user => res.json(user))
        // .catch((err) => {
        //     console.log(err)
        //     res.json({
        //         error: "Please enter a valid and unique email",
        //         message: err.message
        //     })
        // });

        // another way to save new user
        // const { username, password, email } = req.body;
        // const user = await new User({ username, password, email });
        // await user.save();
        // res.send('req.body');
    });

//* ROUTE 2 - LOGIN ROUTE- /api/auth/login
// If the email isn't valid syntax then we won't let the user go further since we are using email as unique identifier
router.post('/login',
    [
        body('email', 'Enter a valid Email').isEmail(),    // should be valid syntax email
        body('password', 'Password cannot be blank').exists(),    // should not be blank
    ],
    async (req, res) => {
        // now we will check for input errors 
        const errors = validationResult(req);

        let success = false;

        if (!errors.isEmpty()) { // if the error container is not empty means there are errors
            console.log('Error')
            return res.status(400).json({ errors: errors.array() });    // return error
        }   // else if no errors then move next

        // destructuring from req body
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });    // finding user by email provided

            // if user does not exist
            if (!user) {
                success = false;
                return res.status(400).json({ success, error: "Wrong Credentials :-(     Please Try again" });
            };

            // if we are here means the user exist and the email was right so 
            // now we will compare the password

            const verifyPassword = await bcrypt.compare(password, user.password);   // it will return TRUE or FALSE

            if (!verifyPassword) {  // if it returned false since the password did not match
                success = false;
                return res.status(400).json({ success, error: "Wrong Credentials :-(     Please Try again" });

            };

            // if we are here means all the user provided information is correct and user is authenticated

            // now we will store user's id in session token so that we can authenticate and authorize user later for specific time
            // so now we will store the auth info for login

            const data = {
                user: {
                    id: user.id    // accessing the user using ID 
                }
            };

            // it is synchronous method so we do not need to add 'await'
            const authtoken = jwt.sign(data, JWT_Secret);

            // now we have the token for user login
            // In the next route, We will see how to use this token to know about user login

            success = true;
            res.json({ success, authtoken });


        } catch (error) {
            console.log("Sorry got an Error :-(")
            console.log(error.message);
            res.status(500).send("<h1>Internal Server Error :-(</h1>");
        }

    });


//* ROUTE 3 - Get logged In User's Details- /api/auth/getuser


router.post('/getuser', fetchUser, async (req, res) => {
    try {
        // extracting the user id from the authToken since it have 3 parts - algorithms, data and signature
        // id will be in the data since we stored the id in the data
        const userId = req.user.id;    // importing from our middleware

        // now we will find the user with the extracted id and select the fields we want or unselect that we do not want
        const user = await User.findById(userId).select("-password")

        // select("-password") - this means that select all but NOT password

        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("<h1>Internal Server Error :-(</h1>");
    }

});




// exporting our routes
module.exports = router;  
