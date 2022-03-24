import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";

const Login = (props) => {

    const [credentials, setCredentials] = useState({ email: "", password: "" })

    let navigate = useNavigate();

    const handleSubmit = async (e) => {

        // to stop page from reloading
        e.preventDefault();

        // fetching our API

        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });

        const json = await response.json()
        // console.log(json)

        if (json.success) {
            // save the auth token and redirect the user to home
            localStorage.setItem('token', json.authtoken)

            props.showAlert("Welcome! You are successfully logged in", "success");
            navigate("/")


        } else {
            props.showAlert("Wrong Credentials", "danger");

        }

    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })

    }

    return (
        <>
            <div className="my-5">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input value={credentials.email} onChange={onChange} type="email" name="email" className="form-control" id="email" minLength="3" required aria-describedby="email" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input value={credentials.password} onChange={onChange} type="password" name="password" className="form-control" id="password" minLength="3" required />
                    </div>

                    <button type="submit" className="btn btn-success">Login</button>
                </form>
            </div>
        </>
    )
}

export default Login