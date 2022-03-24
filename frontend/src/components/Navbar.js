import React from 'react'

import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";


const Navbar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {

        // deleting the token information
        localStorage.removeItem('token');

        // redirecting
        navigate('/login');
    }

    // we used useLocation here to change the active link as we click
    // console.log(location) will give us many properties like pathname, etc so we will use it to set the 'active'
    const location = useLocation();

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/#">iNotebook</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
                            </li>


                        </ul>
                        {!localStorage.getItem('token') ? <form className="d-flex">
                            <Link to="/login" className="btn btn-outline-success mx-2" type="submit">Login</Link>
                            <Link to="/register" className="btn btn-outline-warning mx-2" type="submit">Register</Link>
                        </form> : <button onClick={handleLogout} className="btn btn-danger">Log Out - <i class="fa-solid fa-right-from-bracket"></i></button>}

                    </div>
                </div>
            </nav>

        </>
    )
}

export default Navbar
