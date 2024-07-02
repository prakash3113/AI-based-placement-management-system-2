import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loading from "../../AptiComponents/components/Loading";
import ErrorMessage from "../../AptiComponents/components/ErrorMessage";
import { login } from "../../AptiComponents/actions/userActions";
import MainScreen from "../../AptiComponents/components/MainScreen";
import "./LoginScreen.css";


function LoginScreen({history}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

    

  useEffect(() => {
    if(userInfo){
      if (userInfo.isAdmin) {
        history.push("/adminDashboard");
      }
      if(!userInfo.isAdmin){
        history.push("/");
      }
    }
   
  }, [history, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <>
    <div className= "contentx">
      <h1>Login</h1>
           <div className = "maincontainer">
         {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
         {loading && <Loading />}
         <Form onSubmit={submitHandler}>
           <Form.Group controlId="formBasicEmail">
             <Form.Label>Email address</Form.Label>
            <Form.Control className = "inputbox"
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control className = "inputbox" 
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        <Row className="py-3">
          <Col>
            Not Registered Yet ? <Link to="/register">Register Here</Link>
          </Col>
        </Row>
      </div>
      </div>
    </>
  )
}

export default LoginScreen
