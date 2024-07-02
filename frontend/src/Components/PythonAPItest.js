import React, { useState } from 'react'
import Navbar from './MainNavbar'
import '../Styles/Admin.css'
import axios from "axios";
import { v4 as uuid } from 'uuid';


function Admin() {
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState('');
  const [userAnswer, setuserAnswer] = useState('');
  const [requiredKeywords, setrequiredKeywords] = useState('');
  const [message, setMessage] = useState("");

  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  headers.append('Access-Control-Allow-Credentials', 'true');

  headers.append('GET', 'POST', 'OPTIONS');

  const onChangeAnswer = (e) => {
    setAnswer({ answer: e.target.value });
  };
  const onChangeQuestion = (e) => {
    setQuestion({ question: e.target.value });
  };
  const onChangeuserAnswer = (e) => {
    setuserAnswer({ userAnswer: e.target.value });
  };
  const onChangerequiredKeywords = (e) => {
    setrequiredKeywords({ requiredKeywords: e.target.value.split(',') });
  };
// let testUUID = uuid();

  const  onSubmit = async(e) => {
    e.preventDefault();

    const Data = {
      answer: answer,
      question: question,
      userAnswer: userAnswer,
      requiredKeywords: requiredKeywords,
      testUUID: uuid()
    };
    console.log(Data);
    let newData = JSON.stringify(Data)
    await axios
      .post("http://127.0.0.1:5000/users", {
        //mode: 'no-cors',
        method: 'POST',
        headers: headers
      }, Data)
      .then((res) => {
        console.log(res.data);
        setAnswer(answer);
        setQuestion(question);
        setuserAnswer(userAnswer);
        setrequiredKeywords(requiredKeywords);
        
      })
      .catch((error) => {
        console.log(error);
      });
    // setData(true);
  };


  return (
    <>
    
    <div className= "container">
    <form className="form-control" onSubmit={onSubmit}>
        <div className="form-group">
            <label for="question">Enter Question Name</label>
            <input type="text" className="form-control" id="question" onChange={onChangeQuestion}/>
        </div>
        <div className="form-group">
            <label for="answer">Enter Admin Answer</label>
            <textarea className="form-control" name= "answer" id = "answer" cols={10} rows={2} onChange={onChangeAnswer}></textarea>
        </div>
        <div className="form-group form-check">
            <label for="userAnswer">Enter userAnswer</label>
            <input type="text" className="form-control" name = "userAnswer" id="answer" onChange={onChangeuserAnswer}
            />
        </div>
        <div className="form-group form-check">
            <label for="requiredKeywords">Enter Required Keywords with , seperated</label>
            <input type="text" className="form-control" name = "requiredKeywords" id="requiredKeywords" onChange={onChangerequiredKeywords}
            />
        </div>
       
  <button type="submit" class="btn btn-primary">Submit</button>
  <div className="message form-group">{message ? <p>{message}</p> : null}</div>
</form>
    </div>

    
    </>
  )
}

export default Admin