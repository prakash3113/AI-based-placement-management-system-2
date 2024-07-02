import React, { useState } from 'react'
import Navbar from '../MainNavbar'
import '../../Styles/Admin.css'
import axios from "axios";




function CodeAdmin() {
  const [question, setQuestion] = useState('');
  const [output, setOutput] = useState('');
  const [instructions, setInstructions] = useState('');
  const [message, setMessage] = useState("");
  


  const onChangeQuestion = (e) => {
    setQuestion({ question: e.target.value });
  };
  const onChangeOutput = (e) => {
    setOutput({ output: e.target.value });
  };
  const onChangeInstructions = (e) => {
    setInstructions({ instructions: e.target.value});
  };
  const  onSubmit = async(e) => {
    e.preventDefault();

    const Data = {
      question: question,
      output: output,
      instructions: instructions
    };
    console.log(Data);
    // let newData = JSON.jsonify(Data)
    await axios
      .post("/api", Data)
      .then((res) => {
        setQuestion(question);
        setOutput(output);
        setInstructions(instructions);
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
  
    <div className= "container">
    <form className="form-control" onSubmit={onSubmit}>
        <div className="form-group">
            <label for="question">Enter Question</label>
            <input type="text" className="form-control" id="question" onChange={onChangeQuestion}/>
        </div>
        <div className="form-group">
            <label for="instructions">Enter Instructions & Test Cases Here</label>
            <textarea className="form-control" name= "instructions" id = "instructions" cols={10} rows={2} onChange={onChangeInstructions}></textarea>
        </div>
        <div className="form-group form-check">
            <label for="output">Enter Output</label>
            <input type="text" className="form-control" name = "output" id="output" onChange={onChangeOutput}
            />
        </div>
       
       
  <button type="submit" class="btn btn-primary">Submit</button>
  <div className="message form-group">{message ? <p>{message}</p> : null}</div>
</form>
    </div>

    
    </>
  )
}

export default CodeAdmin