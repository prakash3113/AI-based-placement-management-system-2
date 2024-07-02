import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../../AptiComponents/components/Loading";
import ErrorMessage from "../../AptiComponents/components/ErrorMessage";
import { register } from "../../AptiComponents/actions/userActions";
import MainScreen from "../../AptiComponents/components/MainScreen";


import "./RegisterScreen.css";

function RegisterScreen({ history }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [orgname, setorgName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);


  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;
  


  useEffect(() => {
    if (userInfo) {
      history.push("/");
    }
  }, [history, userInfo]);


  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setMessage("Passwords do not match");
    } else dispatch(register(name, email, password, orgname));
  };

  return (
   <>
   <div className= "contentx">
      <h1>Register</h1>
           <div className = "maincontainer">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
        {loading && <Loading />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            
            <Form.Control
              type="name"
              value={name}
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>


          <Form.Group controlId="formBasicEmail">
            
            <Form.Control
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="orgname">
            
            <Form.Control
              type="orgname"
              value={orgname}
              placeholder="Enter Organization / School Name"
              onChange={(e) => setorgName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="address">
           
            <Form.Control
              type="address"
              value={address}
              placeholder="Enter Organization / School Full Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
          
            <Form.Control
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword">
           
            <Form.Control
              type="password"
              value={confirmpassword}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Have an Account ? <Link to="/login">Login</Link>
          </Col>
        </Row>
          </div>
    </div>
    </>
  )
}

export default RegisterScreen
