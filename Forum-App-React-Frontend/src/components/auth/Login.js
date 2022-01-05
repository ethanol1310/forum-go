import React, { useState, useEffect } from "react";
import { Label, Input, FormGroup, Button, Card, CardHeader, CardBody } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from 'react-router-dom';

import "./Auth.css";
import Navigation from '../Navigation'
import { SignIn } from '../../store/modules/auth/actions/authAction';
import API_ROUTE from "../../apiRoute";
import axios from "axios";



const Login = () => {

  const currentState = useSelector((state) => state.Auth);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const [captcha, setCaptcha] = useState({
    id: '',
    value: '',
    url: ''
  });

  const dispatch = useDispatch()

  const userLogin = (credentials) => dispatch(SignIn(credentials))

  const handleUserChange = e => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleCaptchaChange = e => {
    setCaptcha({
      ...captcha,
      [e.target.name]: e.target.value
    })
  }

  const submitUser = (e) => {
    e.preventDefault()
    userLogin({
      email: user.email,
      password: user.password,
      captcha_id: captcha.id,
      captcha_value: captcha.value
    });
  }

  const getCaptcha = () => {
    axios.get(`${API_ROUTE}/captcha`)
      .then(response => {
        let val = response.data.response.id;
        setCaptcha({
          id: val,
          url: `${API_ROUTE}/captcha/${val}`
        })
      })
  }

  useEffect(() => {
    getCaptcha();
  }, [currentState.loginError])


  if (currentState.isAuthenticated) {
    return <Redirect to='/' />
  }

  return (
    <div className="App" id="page-container">
      <div>
        <Navigation />
      </div>
      <div className="container Auth">
        <Card className="card-style">
          <CardHeader>Login</CardHeader>
          <CardBody>
            <form onSubmit={submitUser}>
              <div className="mb-2">
                {currentState.loginError && currentState.loginError.Incorrect_details ? (
                  <small className="color-red">{currentState.loginError.Incorrect_details}</small>
                ) : (
                  ""
                )}
                {currentState.loginError && currentState.loginError.No_record ? (
                  <small className="color-red">{currentState.loginError.No_record}</small>
                ) : (
                  ""
                )}
              </div>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" placeholder="Enter email" onChange={handleUserChange} />
                {currentState.loginError && currentState.loginError.Required_email ? (
                  <small className="color-red">{currentState.loginError.Required_email}</small>
                ) : (
                  ""
                )}
                {currentState.loginError && currentState.loginError.Invalid_email ? (
                  <small className="color-red">{currentState.loginError.Invalid_email}</small>
                ) : (
                  ""
                )}
              </FormGroup>
              <FormGroup>
                <Label>Password</Label>
                <Input type="password" name="password" placeholder="Enter password" onChange={handleUserChange} />
                {currentState.loginError && currentState.loginError.Required_password ? (
                  <small className="color-red">{currentState.loginError.Required_password}</small>
                ) : (
                  ""
                )}
                {currentState.loginError && currentState.loginError.Invalid_password ? (
                  <small className="color-red">{currentState.loginError.Invalid_password}</small>
                ) : (
                  ""
                )}
                {currentState.loginError && currentState.loginError.Incorrect_password ? (
                  <small className="color-red">{currentState.loginError.Incorrect_password}</small>
                ) : (
                  ""
                )}
              </FormGroup>
              <FormGroup>
                <Label>Captcha</Label>
                <img className="captcha-style" src={captcha.url} alt="Captcha" />
                <Link onClick={getCaptcha}>Reload Captcha</Link>
                <Input type="text" name="value" placeholder="Enter the characters from the image" onChange={handleCaptchaChange} />
                {currentState.loginError && currentState.loginError.invalid_captcha ? (
                  <small className="color-red">{currentState.loginError.invalid_captcha}</small>
                ) : (
                  ""
                )}
              </FormGroup>

              {currentState.isLoading ? (
                <Button
                  color="primary"
                  type="submit"
                  block
                  disabled
                >
                  Login...
                </Button>
              ) : (
                <Button
                  color="primary"
                  type="submit"
                  block
                  disabled={user.email === "" || user.password === "" || captcha.value === ""}
                >
                  Login
                </Button>
              )}
            </form>
            <div className="mt-2" style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <small><Link to="/signup">Sign Up</Link></small>
              </div>
              <div>
                <small><Link to="/forgotpassword">Forgot Password?</Link></small>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>


    </div>
  );
}

export default Login

