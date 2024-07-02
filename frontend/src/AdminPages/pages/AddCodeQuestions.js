import React, { useEffect, useState } from 'react'
import axios from "axios";
import { v4 as uuid } from 'uuid';
function AddCodeQuestions() {
    const [problemStatement, setproblemStatement] = useState('');
    const [testInput, settestInput] = useState([])
    const [expectedOutput, setexpectedOutput] = useState([]);
    const [instructions, setInstructions] = useState('');
    const [message, setMessage] = useState("");
    

   
  
    const onChangeQuestion = (e) => {
      setproblemStatement({ problemStatement: e.target.value });
    };
    const onChangeInput = (e) => {
        settestInput({ testInput: e.target.value.split(',') });
      };
    const onChangeOutput = (e) => {
        setexpectedOutput({ expectedOutput: e.target.value.split(',') });
    };
    const onChangeInstructions = (e) => {
      setInstructions({ instructions: e.target.value});
    };
    
    const  onSubmit = async(e) => {
      e.preventDefault();
  
      const data = {
        problemStatement: problemStatement,
        testInput: testInput,
        expectedOutput: expectedOutput,
        instructions: instructions     
      };
      console.log(data);
      fetch('http://localhost:5000/coding/storeTestCases', {
		method: 'POST',
		headers:{
		  'Accept': 'application/json',
		  'Content-type': 'application/json'
		},
	   body:JSON.stringify(data)
	  }).then((res) => {
			console.log(res.data);
            setMessage("Data Saved Successfully");			
		  })
		  .catch((error) => {
			console.log(error);
		  });
}
  
  
    return (
      <>
      <div className= "container">
      <form className="form-control" onSubmit={onSubmit}>
          <div className="form-group">
              <label for="problemStatement">Enter Problem Statement</label>
              <input type="text" className="form-control" name = "problemStatement" id="problemStatement" onChange={onChangeQuestion}/>
          </div>
          <div className="form-group">
              <label for="testInput">Enter Input for test cases (with ',' seperated)</label>
              <input type="text" className="form-control" name= "testInput" id = "testInput" onChange={onChangeInput}/>
          </div>
          <div className="form-group">
              <label for="instructions">Enter Expected Output for test cases (with ',' seperated)</label>
              <input type="text" className="form-control" name= "instructions" id = "instructions" onChange={onChangeOutput}/>
          </div>
          <div className="form-group">
              <label for="instructions">Enter Instructions</label>
              <textarea className="form-control" name= "instructions" id = "instructions" cols={10} rows={2} onChange={onChangeInstructions}></textarea>
          </div>
         
         
    <button type="submit" class="btn btn-primary">Submit</button>
    <div className="message form-group">{message ? <p>{message}</p> : null}</div>
  </form>
      </div>
  
      
      </>
    )
}

export default AddCodeQuestions