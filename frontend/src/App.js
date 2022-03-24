
import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';

// our state for context
import NoteState from './context/notes/NoteState.js';

// react router dom
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Alert from './components/Alert';

import { useState } from 'react';

function App() {

  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null);

    }, 2000);
  }


  return (
    <>

      <NoteState>

        <Router>
          <div className="App">

            <Navbar />

            <Alert alert={alert} />

            <div className="container">

              <Routes>

                <Route exact path="/" element={<Home showAlert={showAlert} />} />

                <Route exact path="/about" element={<About />} />

                <Route exact path="/login" element={<Login showAlert={showAlert} />} />

                <Route exact path="/register" element={<Register showAlert={showAlert} />} />

              </Routes>

            </div>

          </div>

        </Router>

      </NoteState>
    </>
  );
}

export default App;


// concurrently is an npm package that allows us to run 2 or more servers at same time
// in our case, front end and back end server

// add this in script to run both at same time
// "both": "concurrently \"npm run start\" \"nodemon ../backend/app.js\""