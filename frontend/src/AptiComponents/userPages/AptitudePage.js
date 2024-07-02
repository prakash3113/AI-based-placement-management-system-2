import "./aptistyles.css";
import React, { useEffect, useState } from "react";


function AptitudePage({ history }) {
  const [startExam, setstartExam] = useState(false)
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  // const [sendRequest, setSendRequest] = useState(false);
  const [testId, settestId] = useState()
  const [orgName, setorgName] = useState()
  const [data, setData] = useState([])

  //Timer Logic____________________________Start_______________________________


  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running]);


  var min = ("0" + Math.floor((time / 1000) % 60)).slice(-2)
  var min2 = min.toString()



  //Timer Logic____________________________End_______________________________



  // const startMyExam = () => {
  //   setstartExam(true);

  // }

  const orgName1 = "Tech Phantoms"
  const testID = "tech2022"
  //question data_______________________Start______________________
  // /aptitude/getQuestions
  if (!localStorage.userInfo) {
    history.push("/");
  }
  const LoginInfo = JSON.parse(localStorage.userInfo)
  // console.log(LoginInfo.orgname)
  // console.log(testId)
const data1 = {
  orgName: orgName,
  testId: testId
  
}
  const getData = () => {
    fetch('http://localhost:5000/aptitude/getQuestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data1)
    })
      .then((response) => {
        return response.json();
      }).then((myJson) => {
        console.log(myJson)
        setData(myJson);
        console.log(data)

      });
  }

  // const data = [
  //   {
  //     id: "1",
  //     question: "Which letter of the alphabet has the most water?",
  //     answer: "C",
  //     marks: 2,
  //     options: [`A`, `B`, `C`]
  //   },
  //   {
  //     id: "2",
  //     question: "What kind of dog keeps the best time?",
  //     answer: "Watchdog",
  //     marks: 2,
  //     options: [`Watchdog`, `hotdog`, `Cutedog`]
  //   },
  //   {
  //     id: "3",
  //     question: "Which letter of the alphabet has the most water?",
  //     answer: "C",
  //     marks: 2,
  //     options: [`A`, `B`, `C`]
  //   },
  //   {
  //     id: "4",
  //     question: "What kind of dog keeps the best time?",
  //     answer: "Watchdog",
  //     marks: 2,
  //     options: [`Watchdog`, `hotdog`, `Cutedog`]
  //   }

  // ]


  //question data_______________________End______________________




  const onChangetestId = (e) => {
    // settestId({ testId: e.target.value });
    const userValue = e.target.value
    settestId(userValue)
  };


  const startExamOnce = () =>{
    setTimeout(()=>{
      setstartExam(true);
    },3000)
    
    getData();
  }

  //user part________________________Start____________________
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [myAnswer, setMyAnswer] = useState("");
  var [score, setScore] = useState(0);
  const [finish, setFinish] = useState(false);
  const [show, setShow] = useState(false);
  const [clickAnswer, setClickAnswer] = useState(false);

  //user part________________________end____________________

  //Main Logic________________________Start________________________________

  //this will set user's answer when he/she click on a options
  const checkAnswer = (options) => {
    setMyAnswer(options);
    console.log(myAnswer)
    console.log(score)
  };

  //this will compare user's answer with the correct answer and setScore
  const checkCorrectAnswer = () => {
    if (myAnswer === data[currentQuestion].answer) {
      setScore(score + data[currentQuestion].marks);
    }
  };

  //this will determine the Exam is over or not
  const finishHandler = () => {
    if (currentQuestion === data.length - 1) {
      setFinish(true);
      
    }
  };

  //this will reset the show answer button for the next question otherwise it will show again even user does not click on any variant
  const reset = () => {
    setShow(false);
    setClickAnswer(false);
  };

  const gotoHomePage = () =>{
    history.push('/')
  }
  //Main Logic________________________End________________________________
const min3 = "20";
  if (min2 >= min3) {
    // checkCorrectAnswer();
    // setFinish(null)
    // setstartExam(false)
    
    return (
      <div className="container m-4 p-4 mx-auto h-min-screen grid grid-rows-1 grid-cols-1 items-center">
        <div className="wrapper">
          <h3 className="m-4 p-2 h-30 text-center text-2xl font-bold">
            {`Test Completed! Your Final Score is
    ${score}`}
          </h3>
          <button
            className="w-full h-14 mt-2 px-2 rounded-lg bg-gray-600 text-pink-400 font-bold hover:bg-gray-800 hover:text-pink-600"
            onClick={() => gotoHomePage()}
          >
            Go to Home
          </button>
        </div>
      </div>
      
    );
    
    
  }

  if (finish === true) {
    return (
      <div className="container m-4 p-4 mx-auto h-min-screen grid grid-rows-1 grid-cols-1 items-center">
        <div className="wrapper">
          <h3 className="m-4 p-2 h-30 text-center text-2xl font-bold">
            {`Test Completed! Your Final Score is
    ${score}`}
          </h3>
          <button
            className="w-full h-14 mt-2 px-2 rounded-lg bg-gray-600 text-pink-400 font-bold hover:bg-gray-800 hover:text-pink-600"
            onClick={() => gotoHomePage()}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  } else if (startExam === true) {
    return (

      <div className="container m-4 p-4 mx-auto h-min-screen grid grid-rows-1 grid-cols-1 items-center">
        <div className="numbers">
          <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
          <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
          <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
        </div>



        <div className="wrapper">
          <h2 className="m-4 p-2 h-30 text-center text-2xl font-bold">
            {data[currentQuestion].question}
          </h2>
          <span className="m-2 border-2 border-black mx-auto px-2 bg-gray-600 text-pink-400 rounded-lg text-center">
            {`${currentQuestion}/${data.length - 1}`}
          </span>
          {data[currentQuestion].options.map((options) => (
            <div className="m-2 h-14 border-2 border-black mx-auto text-center">
              <p
                key={options.id}
                className={`options ${myAnswer === options
                  ? myAnswer === data[currentQuestion].answer
                    ? "correctAnswer"
                    : "incorrectAnswer"
                  : null
                  }`}
                onClick={() => checkAnswer(options)}
              >
                {options}
              </p>
            </div>
          ))}

          {currentQuestion < data.length - 1 && (
            <button
              className="w-full h-14 mt-2 px-2 rounded-lg bg-gray-600 text-pink-400 font-bold hover:bg-gray-800 hover:text-pink-600"
              onClick={() => {
                {
                  if (myAnswer === data[currentQuestion].answer) {
                    const final_score = score + data[currentQuestion].marks
                    score = final_score
                    console.log(final_score)
                    console.log(score)
                    setScore(score)
                  }
                };
                setCurrentQuestion(currentQuestion + 1);

                reset();
              }}
            >
              NEXT
            </button>
          )}
          {currentQuestion === data.length - 1 && (
            <button
              className="w-full h-14 mt-2 px-2 rounded-lg bg-gray-600 text-pink-400 font-bold hover:bg-gray-800 hover:text-pink-600"
              onClick={() => { checkCorrectAnswer(); finishHandler();}}
            >
              FINISH
            </button>

          )}
         
        </div>
      </div>
    );
  } else{
    return (
      <>
        <h5>Select Organization/Institute Name</h5>
        <div>
      <select id="orgName" value={orgName} 
              onChange={(e) => setorgName(e.target.value)}>
              <option value=""></option>
        <option value="Tech Phantoms">Tech Phantoms</option>
        <option value="TAE">TAE</option>
        <option value="TCS">TCS</option>
      </select>
      
    </div>
    <br/>
    <div>
        <h5>Enter Test ID Provided by Organization/Institute</h5>
        <div className="form-group form-check">
            <input type="text" className="form-control" name = "testId" id="testId" onChange={onChangetestId}
            />
        </div>
        </div>
        <div>
        <br/>
        <button
          className="w-full h-14 mt-2 px-2 rounded-lg bg-gray-600 text-pink-400 font-bold hover:bg-gray-800 hover:text-pink-600"
           onClick={() => {setRunning(true);  startExamOnce();}}
        >

          Start Exam
        </button>
        </div>
      </>
    )
  }
}

export default AptitudePage



