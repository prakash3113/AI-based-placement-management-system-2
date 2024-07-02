import React, { useState } from 'react'
import Navbar from './MainNavbar'
import '../Styles/Admin.css'
import axios from "axios";



function Admin() {
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [requiredWords, setrequiredWords] = useState('');
  const [message, setMessage] = useState("");
  

  const onChangeTopic = (e) => {
    setTopic({ topic: e.target.value });
  };
  const onChangeQuestion = (e) => {
    setQuestion({ question: e.target.value });
  };
  const onChangeAnswer = (e) => {
    setAnswer({ answer: e.target.value });
  };
  const onChangerequiredWords = (e) => {
    setrequiredWords({ requiredWords: e.target.value.split(',') });
  };
  const  onSubmit = async(e) => {
    e.preventDefault();

    const Data = {
      topic: topic,
      question: question,
      answer: answer,
      requiredWords: requiredWords
    };
    console.log(Data);
    // let newData = JSON.jsonify(Data)
    await axios
      .post("http://localhost:3000/technical/storeSingleQuestion", Data)
      .then((res) => {
        setTopic(topic);
        setQuestion(question);
        setAnswer(answer);
        setrequiredWords(requiredWords);
        setMessage("Data Saved Successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    // setData(true);
  };


  return (
    <>
    <Navbar />
    <button onClick ={event =>  window.location.href='/CodeAdmin'}>Coding Round</button>
    <div className= "container">
    <form className="form-control" onSubmit={onSubmit}>
        <div className="form-group">
            <label for="topic">Enter Topic Name</label>
            <input type="text" className="form-control" id="topic" onChange={onChangeTopic}/>
        </div>
        <div className="form-group">
            <label for="question">Enter Question</label>
            <textarea className="form-control" name= "question" id = "question" cols={10} rows={2} onChange={onChangeQuestion}></textarea>
        </div>
        <div className="form-group form-check">
            <label for="answer">Enter Answer</label>
            <input type="text" className="form-control" name = "answer" id="answer" onChange={onChangeAnswer}
            />
        </div>
        <div className="form-group form-check">
            <label for="requiredWords">Enter Keywords</label>
            <input type="text" className="form-control" name = "requiredWords" id="requiredWords" onChange={onChangerequiredWords}
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