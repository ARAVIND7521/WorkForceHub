import '../react.css';
import '../responsive.css';
import React from 'react';
import { useNavigate, Link } from "react-router-dom"
import { useState, useRef } from "react";
import axios from 'axios';

function LoginPage({ setToken, setSecretID }) {
    const navigate = useNavigate();
    const username = useRef(null);
    const password = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        userName: "USERNAME REQUIRED!",
        password: "PASSWORD REQUIRED!",
        user_pass: "USERNAME OR PASSWORD IS NOT EXISTS!!",
        null: ""
    };
    const [UserName, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");

    const TogglePassword = (e) => {
        e.preventDefault();
        setPasswordType((prevType) => (prevType === 'password' ? 'text' : 'password'));
    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error_log">{errorMessages.message}</div>
        );

    const renderErrorMsg = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );

    function validateForm() {
        if (UserName === "") {
            // Enter the correct Username
            const element = username.current.focus();
            setErrorMessages({ name: "userName", message: errors.userName });
        } else if (Password === "") {
            // Enter the correct password
            const element = password.current.focus();
            setErrorMessages({ name: "password", message: errors.password });
        }
        else {
            setIsLoading(true);
            axios.post('http://localhost:3000/login/', {
                username: UserName,
                password: Password
            }).then((response) => {
                setIsLoading(false);
                if (response.data.result.length == 0) {
                    // setIsLoading(true);
                    localStorage.clear();
                    // setTimeout(() => {
                    setIsLoading(false);
                    setErrorMessages({ name: "username&password", message: errors.user_pass });
                    // }, 5000);
                } else if (response.data.result[0].SecretID == null) {
                    // setIsLoading(true);
                    // setTimeout(() => {
                    setIsLoading(false);
                    setToken(response.data.token);
                    navigate("/dashboard_emp");
                    // }, 5000);
                } else {
                    setIsLoading(true);
                    // setTimeout(() => {
                    //     setIsLoading(false);
                    setToken(response.data.token);
                    setSecretID(response.data.result[0].SecretID);
                    navigate("/dashboard");
                    // }, 5000);
                }
            }).catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                    alert("INVALID USERNAME OR PASSWORD!!!");
                }
                console.log(error.config);
            }).finally(() => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 5000);
            });
        }
    };

    function handleSubmit(event) {
        event.preventDefault();
    }

    function check() {
        if (UserName) {
            setErrorMessages({ name: 'null', message: errors.null });
        }
    };

    return (
        <>

            <div id='front'>
                <div className="logo-holder logo">
                    <h3>BGOWARAK</h3>
                    <p>POWER OF TECHNOLOGIES</p>
                </div>
                {renderErrorMsg("username&password")}
                {/* {isLoading ? (
                    <div className="spinner"></div>
                ) : ( */}
                <div id="header">
                    <form name="myForm" onSubmit={handleSubmit}>
                        <div id='loginPage'>
                            <label htmlFor="userName">USERNAME</label><br />
                            <input ref={username} id="user" type="text" name="userName" onKeyUp={check} autoComplete="username" onChange={(e) => setUsername(e.target.value)} value={UserName}>
                            </input><span><i className="fa fa-user icon" id="toggle"></i></span>
                        </div>
                        {renderErrorMessage("userName")}
                        <div id='loginPage'>
                            <label htmlFor="password">PASSWORD</label><br />
                            <input ref={password} id="pass" type={passwordType} name="password" autoComplete="current-password" onKeyUp={check} onChange={(e) => setPassword(e.target.value)} value={Password}>
                            </input><span><i id="toggle" onClick={TogglePassword}>
                                {passwordType === "password" ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}</i></span>
                        </div>
                        {renderErrorMessage("password")}
                        <div id='loginPage'>
                            <input type="checkbox" value="lsRememberMe" id="rememberMe"></input>
                            <label htmlFor="rememberMe">Remember me</label>
                            <span className="psw">Forgot <Link to="/forget_psw" className="forget_password">password?</Link></span>
                        </div>
                        <button id="button" type="submit" onClick={validateForm}>{isLoading ? "LOADING..." : "LOGIN"}</button>
                    </form>
                </div>
                {/* )} */}
                <div id="foot">
                    <b><footer>Copyright@ 2023</footer></b>
                </div>
            </div>
        </>
    );
}

export default LoginPage