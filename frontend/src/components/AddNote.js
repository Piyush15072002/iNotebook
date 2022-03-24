import React, { useContext, useState } from 'react'

// our note context
import NoteContext from '../context/notes/NoteContext';

const AddNote = (props) => {

    // using our context to get all the notes
    const context = useContext(NoteContext);

    const { addNote } = context;

    const [note, setNote] = useState({ title: "", description: "", tag: "" })

    const handleClick = (e) => {

        // to stop the page to load and go to url we will use preventDefault
        e.preventDefault();

        addNote(note.title, note.description, note.tag);

        setNote({ title: "", description: "", tag: "" })

        props.showAlert("Successfully Added your Note", "info")
    }

    const ChangeIt = (e) => {

        // we have use onChange prop that will show any change on the state and then
        // we are storing the change in the note using our setNote hook so note is updated
        // spread operator - ...
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    return (
        <>
            <div className="container my-3">

                <h2>Add a Note</h2>

                <form action="" method="post">


                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input value={note.title} onChange={ChangeIt} type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" required minLength={3} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <input value={note.description} onChange={ChangeIt} type="text" className="form-control" id="description" name="description" aria-describedby="emailHelp" required minLength={3} />

                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input value={note.tag} onChange={ChangeIt} type="text" className="form-control" id="tag" name="tag" aria-describedby="emailHelp" required minLength={3} />

                    </div>


                    <button disabled={note.title.length < 3 || note.description.length < 3} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>


                </form>

            </div>
        </>
    )
}

export default AddNote



