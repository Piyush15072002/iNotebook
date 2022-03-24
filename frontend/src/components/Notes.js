import React, { useState, useContext, useEffect, useRef } from 'react'

// our note context
import NoteContext from '../context/notes/NoteContext';

// components
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {

    const navigate = useNavigate();

    const { showAlert } = props
    // using our context to get all the notes
    const context = useContext(NoteContext);

    const { notes, getNotes, editNote } = context;

    const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })

    useEffect(() => {

        if (localStorage.getItem('token')) {
            getNotes()

        } else {
            navigate('/login')
        }

        // eslint-disable-next-line
    }, [])


    const ref = useRef(null)
    const refClose = useRef(null)

    const updateNote = (currentNote) => {

        // for the edit button to open modal
        ref.current.click();

        setNote({
            id: currentNote._id,
            etitle: currentNote.title,
            edescription: currentNote.description,
            etag: currentNote.tag
        })


    }



    const handleClick = (e) => {

        editNote(note.id, note.etitle, note.edescription, note.etag)

        // we used the property of close button and reference it to the update button so that
        // when we click on update button, it will behave just like cancel button and close modal
        refClose.current.click();

        props.showAlert("Successfully Updated the Note", "primary")
    }

    const ChangeIt = (e) => {

        // we have use onChange prop that will show any change on the state and then
        // we are storing the change in the note using our setNote hook so note is updated
        // spread operator - ...
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <>

            <AddNote showAlert={props.showAlert} />


            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>


            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form action="" method="post">


                                <div className="mb-3">
                                    <label htmlFor="etitle" className="form-label">Title</label>
                                    <input value={note.etitle} onChange={ChangeIt} type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" required minLength={3} />

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="edescription" className="form-label">Description</label>
                                    <input value={note.edescription} onChange={ChangeIt} type="text" className="form-control" id="edescription" name="edescription" aria-describedby="emailHelp" required minLength={3} />

                                </div>
                                <div className="mb-3">
                                    <label htmlFor="etag" className="form-label">Tag</label>
                                    <input value={note.etag} onChange={ChangeIt} type="text" className="form-control" id="etag" name="etag" aria-describedby="emailHelp" required minLength={3} />

                                </div>



                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button disabled={note.etitle.length < 3 || note.edescription.length < 3} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-3">

                <h2>Your Notes</h2>

                <div className="container">
                    {notes.length === 0 && "NO NOTES TO DISPLAY"}
                </div>

                <div>
                    {notes.map((note) => {
                        return <NoteItem showAlert={props.showAlert} key={note._id} updateNote={updateNote} note={note} />
                    })}
                </div>
            </div>


        </>
    )
}

export default Notes