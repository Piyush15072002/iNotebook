import React, { useContext } from 'react'

// our note context
import NoteContext from '../context/notes/NoteContext';

const NoteItem = (props) => {

    const { note, updateNote } = props

    // using our context to get all the notes
    const context = useContext(NoteContext);

    const { deleteNote } = context;

    return (
        <>


            <div className="col-md-9 my-3 mx-3 ">

                <div className="card">

                    <div className="card-body">

                        <h5 className="card-title">{note.title} </h5>

                        <p className="card-text">{note.description}</p>

                        <span>
                            <i onClick={() => { updateNote(note); }} className="fa-solid fa-user-pen mx-3"></i>
                            <i onClick={() => { deleteNote(note._id); props.showAlert("Successfully Deleted the Note", "warning") }} className="fa-solid fa-trash-can mx-3"></i>
                        </span>

                    </div>

                </div>

            </div>
        </>
    )
}

export default NoteItem