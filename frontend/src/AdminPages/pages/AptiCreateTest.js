import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";



function AptiCreateTest({ history }) {
    const [testId, settestId] = useState('')
    const [question, setquestion] = useState('');
    const [correctOption, setcorrectOption] = useState('')
    const [marks, setmarks] = useState('');
    const [options, setoptions] = useState([]);
    const [message, setMessage] = useState("");


    
    const userLogin = useSelector((state) => state.userLogin);
    const LoginInfo = JSON.parse(localStorage.userInfo)
   
    const orgName = LoginInfo.orgname
    console.log(orgName)

    const onChangetestId = (e) => {
        settestId({ testId: e.target.value });
      };
    const onChangeQuestion = (e) => {
      setquestion({ question: e.target.value });
    };
    const onChangeCorrectOption = (e) => {
        setcorrectOption({ correctOption: e.target.value});
      };
    const onChangeMarks = (e) => {
        setmarks({ marks: e.target.value});
    };
    const onChangeOptions = (e) => {
      setoptions({ options:  e.target.value.split(',')});
     
    };
    
    const  onSubmit = async(e) => {
      e.preventDefault();
  
      const data = {
        question: question,
        correctOption: correctOption,
        marks: marks,
        orgName: orgName,
        options: options,
        testId: testId    
      };
      console.log(data);
      fetch('http://localhost:5000/aptitude/saveQuestions', {
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
            <div className="row">
                <div className="col-12">
                    <div className="card">


                    <div className= "container">
                    <div>Create Test</div>
      <form className="form-control" onSubmit={onSubmit}>
      <div>Keep Test ID Same if you want to add question for Same TestID</div><br/>
      <div className="form-group">
              <label for="testId">Enter testId</label>
              <input type="text" className="form-control" name = "testId" id="testId" onChange={onChangetestId}/>
          </div>
          <div className="form-group">
              <label for="question">Enter Question</label>
              <input type="text" className="form-control" name = "question" id="question" onChange={onChangeQuestion}/>
          </div>
          <div className="form-group">
              <label for="options">Enter Options with ',' Seperated Value</label>
              <input type="text" className="form-control" name= "options" id = "options" onChange={onChangeOptions}/>
          </div>
          <div className="form-group">
              <label for="correctOption">Enter Correct Option Value</label>
              <input type="text" className="form-control" name= "correctOption" id = "correctOption" onChange={onChangeCorrectOption}/>
          </div>
         
          <div className="form-group">
              <label for="marks">Enter Marks</label>
              <input type="text" className="form-control" name= "marks" id = "marks" onChange={onChangeMarks}/>
          </div>
         
         
    <button type="submit" class="btn btn-primary">Submit</button>
    <div className="message form-group">{message ? <p>{message}</p> : null}</div>
  </form>
      </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AptiCreateTest