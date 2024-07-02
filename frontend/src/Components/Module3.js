import React, { useEffect, useState, useRef } from "react";
import './module3.css'
import { useSpeechSynthesis } from "react-speech-kit"
import Navbar from './MainNavbar';
import { v4 as uuid } from 'uuid';
import axios from "axios";
import { FaBorderStyle } from 'react-icons/fa';


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'



function App() {
  let flag = false;
  var skipValue = false;
  const [imageArray, setimageArray] = useState([])
  // const [myImage, setmyImage] = useState('')
  const newArray = []
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [userAnswer, setuserAnswer] = useState([])
  const [getQuestions, setgetQuestions] = useState([])
  const { speak } = useSpeechSynthesis();

  // Post Data UseState

  const [answer, setAnswer] = useState([]);
  const [question, setQuestion] = useState([]);
  const [requiredWords, setrequiredWords] = useState([]);
  const [topic, setTopic] = useState([]);
  const [fetchQuestions, setfetchQuestions] = useState([])

//Take Pictures using webcam __________Start________________________



let videoRef = useRef(null);
 
let photoRef = useRef(null)
var TestArray = []
const getVideo = () => {
  navigator.mediaDevices
	.getUserMedia({
	  video: true
	})
	.then((stream) => {
	  let video = videoRef.current;
	  video.srcObject = stream;
	  video.play();
	})
	.catch((err) => {
	  console.error(err);
	});
};
 

  const takePicture = () => {
    const width = 400;
    const height = width / (16 / 9);
    
    let video = videoRef.current
 
    let photo = photoRef.current
 
    photo.width = width
 
    photo.height = height

	let ctx = photo.getContext('2d')


    ctx.drawImage(video, 0, 0, width, height)
	const imageDataURL = photo.toDataURL('image/png');
	// setimageArray(imageDataURL)
	// setimageArray([...imageArray, imageDataURL]);
	imageArray.push(imageDataURL)

	
	

    
  }
 
  const clearImage = () => {
	let photo = photoRef.current
 
    let ctx = photo.getContext('2d')
 
    ctx.clearRect(0,0,photo.width,photo.height)

  }
  useEffect(() => {
  //  getVideo()
	//  Interval1()  
	// Interval2()
  }, [videoRef]);

const Interval1 = () =>{
	const id1 = setInterval(takePicture, 40000)
  return () => clearInterval(id1)
}

const Interval2 = () =>{
	const id3 = setInterval(clearImage, 42000)
  return () => clearInterval(id3)
}

const savebtn = () =>{
	var userCode;
  var userInput;
  var userOutput;
	const data1 = {
		userCode: "userCode",
		userInput: "userInput",
		userOutput: "userOutput",
		imageArray: imageArray,
		testUUID: uuid()
		
	  };console.log(typeof(data1))
	  fetch('http://localhost:5000/proctoring/saveImages', {
		method: 'POST',
		headers:{
		  'Accept': 'application/json',
		  'Content-type': 'application/json'
		},
	   body:JSON.stringify(data1)
	  }).then((res) => {
			console.log(res.data);			
		  })
		  .catch((error) => {
			console.log(error);
		  });
}
  
  


//Take Pictures using webcam __________End________________________


  useEffect(() => {
    handleListen()
  }, [isListening])

  useEffect(() => {

  }, [userAnswer])


  var myquestionArray = []

  fetch('http://localhost:5000/technical/getTechnicalQuestions', {
    method: 'POST',
    // body: JSON.stringify({topic:'java'})
  })
    .then((response) => {
      return response.json();

    })
    .then((myJson) => {
      myquestionArray = myJson.map(obj => ({ ...obj }));
    });


  const startInterview = () => {
    let tempArray = []
    tempArray = myquestionArray;
    let secondArray = [];
    //   var secondArray = [tempArray.length-1];
    let result
    function getRandome(min, max) {
      let step1 = max - min + 1;
      let step2 = Math.random() * step1;
      result = Math.floor(step2) + min;
      return result;
    }

    for (let i = 0; i <= tempArray.length; i++) {
      let index = getRandome(0, tempArray.length - 1);
      secondArray.push(tempArray[index]);
      tempArray.splice(index, 1)
    }


    if (tempArray.length == 1) {
      secondArray.push(tempArray[0]);
    }
    //Ask Question to User            

    var i = 0;
    while (i <= secondArray.length - 1) {
      speak({ text: secondArray[i].question });
      setInterval(setIsListening(prevState => !prevState), 30000)
      setQuestion({ question: secondArray[i].question });
      setAnswer({ answer: secondArray[i].answer });
      setrequiredWords({ requiredWords: secondArray[i].requiredWords });
      setTopic({ topic: secondArray[i].topic });
      if (flag === true) {
        i++;
      } else {
        i--;
      }

    }
    //End of Ask Question to User  
  }

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()

      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }

  }

  // const handleSaveNote = (e) => {
  //   setuserAnswer([...userAnswer, note])
  //   setNote('')

  // }
  const handleSaveNote = async (e) => {
    //  setuserAnswer([...userAnswer, note])
    userAnswer.push(note)
    setNote('')
    const Data = {
      topic: topic,
      answer: answer,
      question: question,
      userAnswer: userAnswer.toString(),
      requiredWords: requiredWords,
      testUUID: uuid()
    };
    console.log(Data);
    fetch('http://localhost:5000/technical/updateSingleTechnicalAccuracy', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(Data)
    }).then((res) => {
      console.log(res.data);
      setTopic(topic)
      setAnswer(answer);
      setQuestion(question);
      setuserAnswer(userAnswer);
      setrequiredWords(requiredWords);

    })
      .catch((error) => {
        console.log(error);
      });
    // let newData = JSON.stringify(Data)
    // await axios
    //   .post("http://localhost:5000/technical/updateSingleTechnicalAccuracy", {
    //     method: 'POST',
    //     // headers: headers
    //   }, Data)
    //   .then((res) => {
    //     console.log(res.data);
    //     setTopic(topic)
    //     setAnswer(answer);
    //     setQuestion(question);
    //     setuserAnswer(userAnswer);
    //     setrequiredWords(requiredWords);

    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    flag = true;

  }


  return (
    <>
      <Navbar />

      <h1>Technical round</h1>
      <div className="group">
      <button onClick={savebtn}>End Interview</button>
        <button onClick={() => startInterview()}>Start Interview</button>
        
      </div>
      <div className="group">
        <button onClick={() => skipValue = true}>Skip Question</button>
      </div>
      <div className="container1">

        {/* <div className="box1">
          <h2>AI BOT NOTES</h2>
          {userAnswer.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div> */}
        <div className="group">
          <button onClick={() => speak({ text: userAnswer })}>Speech</button>
        </div>
        <div className="box1">
          <h2>AI BOT</h2>
          {isListening ? <span>🎙️Listenining...</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Submit Answer
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box1">
          <h2>user NOTES</h2>
          {userAnswer.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
        
        {/* <div className="group">
          <button onClick={() => speak({ text: userAnswer })}>Speech</button>
        </div> */}
        
      </div>
    </>
  )
}

export default App
