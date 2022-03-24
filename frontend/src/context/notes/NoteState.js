// importing our context to the NoteState

import NoteContext from './NoteContext.js';

import { useState } from 'react';

// now we will declare that state that have the context which we can access anywhere as soon as we import the file

const NoteState = (props) => {

    const host = "http://localhost:8080"

    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial)

    // get all notes

    const getNotes = async () => {

        // API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',

            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'auth-token': localStorage.getItem('token')
            },


        });

        const json = await response.json();
        setNotes(json);
    }

    // Add a note
    const addNote = async (title, description, tag) => {

        // API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'auth-token': localStorage.getItem('token')
            },

            body: JSON.stringify({ title, description, tag })
        });

        const note = await response.json();
        setNotes(notes.concat(note))

    }

    // Edit a note
    const editNote = async (id, title, description, tag) => {

        // API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'auth-token': localStorage.getItem('token')
            },

            body: JSON.stringify({ title, description, tag })
        });
        const json = response.json();

        let newNotes = JSON.parse(JSON.stringify(notes))

        // Editing
        for (let i = 0; i < newNotes.length; i++) {
            const element = newNotes[i]
            if (element._id === id) {
                newNotes[i].title = title;
                newNotes[i].description = description;
                newNotes[i].tag = tag;
                break;
            }
        }
        // update the values
        setNotes(newNotes);
    }

    // Delete a note
    const deleteNote = async (id) => {

        // API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',

            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'auth-token': localStorage.getItem('token')
            },
        });

        // delete
        const newNote = notes.filter((note) => {
            return note._id !== id
        })
        setNotes(newNote)
    }


    return (

        // now we will create our context html that we can access

        <NoteContext.Provider value={{ notes, setNotes, addNote, editNote, deleteNote, getNotes }} >

            {props.children}

        </NoteContext.Provider>

        // now we will go and wrap the app.js with our <NoteState> to make sure that we can use it in all the components which are wrapped in it
        // props.children means all that are inside it so now we will wrap it in app.js

    )

};

export default NoteState;