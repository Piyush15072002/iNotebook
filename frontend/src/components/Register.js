import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Register = (props) => {

    const [credentials, setCredentials] = useState({ username: "", email: "", password: "", cpassword: "" })

    let navigate = useNavigate();

    const handleSubmit = async (e) => {

        // to stop page from reloading
        e.preventDefault();

        // fetching our API

        const { username, email, password } = credentials;

        const response = await fetch("http://localhost:8080/api/auth/createuser", {


            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const json = await response.json()
        // console.log(json)

        if (json.success) {
            // save the auth token and redirect the user to home
            localStorage.setItem('token', json.authtoken)
            navigate("/")
            props.showAlert("Congratulations! You are successfully registered", "success");

        } else {
            props.showAlert("Invalid Details", "danger");
        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })

    }

    return (
        <>
            <div className="container my-5">
                <form onSubmit={handleSubmit} >
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Enter your Username </label>
                        <input onChange={onChange} type="username" name="username" className="form-control" id="username" minLength="3" required aria-describedby="email" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Enter your Email</label>
                        <input onChange={onChange} type="email" name="email" className="form-control" id="email" minLength="3" required aria-describedby="email" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Enter your Password</label>
                        <input onChange={onChange} type="password" name="password" className="form-control" id="password" minLength="3" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                        <input onChange={onChange} type="password" name="cpassword" className="form-control" id="cpassword" minLength="3" required />
                    </div>

                    <button type="submit" className="btn btn-success">Register</button>
                </form>

            </div>
        </>
    )
}

export default Register