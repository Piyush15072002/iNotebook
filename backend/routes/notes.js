const express = require('express');

// Notes model
const Notes = require('../models/Notes.js');

// express validator
const { body, validationResult } = require('express-validator');

// our router
const router = express.Router();

// our fetchUser middleware
const fetchUser = require('../middlewares/fetchUser.js');



//* ROUTE 1 : FETCH ALL NOTES - /api/notes/fetchallnotes
// fetchuser will make sure if there is a user logged in and if it is true, then our next callback will run
router.get('/fetchallnotes',
    fetchUser,
    async (req, res) => {

        try {

            // finding all the notes that BELONGS TO THE LOGGED IN USER 
            const notes = await Notes.find({ user: req.user.id });

            res.json(notes);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("<h1>Internal Server Error :-(</h1>");
        }


    });


//* ROUTE 2 : ADD NOTE - /api/notes/addnote


router.post('/addnote',
    fetchUser, // user must be logged in to add a note so we will add fetchuser middleware
    [   // we will add express-validator as well since we do not want the user to submit empty note
        body('title', 'Title of the Note cannot be Empty').isLength({ min: 3 }),
        body('description', 'Description must have atleast 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) { // if the error container is not empty means there are errors
                return res.status(400).json({ errors: errors.array() });    // return error
            }   // else if no errors then move next

            // if we reach here means that the user input are valid and now we can save and create new note

            // destructuring
            const { title, description, tag } = req.body;

            // creating a new note
            const note = await new Notes({
                title,
                description,
                tag,
                user: req.user.id
            });

            // saving note
            const savedNote = await note.save();

            res.json(savedNote);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("<h1>Internal Server Error :-(</h1>");
        }
    });


//* ROUTE 3 : UPDATING A NOTE - /api/notes/updatenote/:noteId

// since we are updating so we will be using PUT request or PATCH
router.put('/updatenote/:noteId', fetchUser, async (req, res) => {

    try {

        // destructuring
        const { title, description, tag } = req.body;

        const newNote = {}

        // if they exist, edit the object
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //? Security of the API route

        //* checking if the note exist or not since someone can try to hack with wrong param id
        let noteToBeUpdated = await Notes.findById(req.params.noteId);

        if (!noteToBeUpdated) {
            return res.status(404).send("Not Found :-(");
        }

        //* Now we will check that whoever wanna update is the actual author of that note or not?
        if (noteToBeUpdated.user.toString() !== req.user.id) {  // if creator of note not equal to logged in user
            // noteToBeUpdated.user.toString() - this means give the user key of Note model of that note and convert it to string for comparison
            // req.user.id - this is where the id of the user is stored
            // if both are equal means that the Creator of the note wants to Update
            // if not equal means some other user wants to update note of another

            return res.status(401).send("You are not Authorized to update this Note")
        }

        // if we come here means the note exist and user is its original author

        // finding the note by id from param and updating it

        noteToBeUpdated = await Notes.findByIdAndUpdate(req.params.noteId, { $set: newNote }, { new: true })

        res.json(noteToBeUpdated)


    } catch (error) {
        console.error(error.message);
        res.status(500).send("<h1>Internal Server Error :-(</h1>");
    }

});


//* ROUTE 4 : DELETING A NOTE - /api/notes/deletenote/:noteId

router.delete('/deletenote/:noteId', fetchUser, async (req, res) => {

    try {

        // destructuring
        const { title, description, tag } = req.body;

        //? Security of the API route

        //* checking if the note exist or not since someone can try to hack with wrong param id
        let noteToBeDeleted = await Notes.findById(req.params.noteId);

        if (!noteToBeDeleted) {
            return res.status(404).send("Not Found :-(");
        }

        //* Allowing deletion only if user is the original author of the note
        if (noteToBeDeleted.user.toString() !== req.user.id) {  // if creator of note not equal to logged in user
            // noteToBeDeleted.user.toString() - this means give the user key of Note model of that note and convert it to string for comparison
            // req.user.id - this is where the id of the user is stored
            // if both are equal means that the Creator of the note wants to Update
            // if not equal means some other user wants to update note of another

            return res.status(401).send("You are not Authorized to Delete this Note")
        }

        // if we come here means the note exist and user is its original author

        // finding the note by id from param and deleting it

        noteToBeDeleted = await Notes.findByIdAndDelete(req.params.noteId)

        res.json({ "Success": "Note has been deleted successfully" });


    } catch (error) {
        console.error(error.message);
        res.status(500).send("<h1>Internal Server Error :-(</h1>");
    }

});


// exporting our routes
module.exports = router;