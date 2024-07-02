import React, { useEffect, useState, useRef } from "react";
import './App.css';
import Editor from "@monaco-editor/react";
import Navbar from './Components/Navbar';
import MainNavbar from './Components/MainNavbar'
import Axios from 'axios';
import spinner from './spinner.svg';
import { v4 as uuid } from 'uuid';
import Selfie from './Components/selfie'
import ls from 'local-storage'
function App() {

	const [testUUID, settestUUID] = useState('');
	const [imageArray, setimageArray] = useState([])
	const [codeQuestions, setcodeQuestions] = useState([])
	const [adminInput, setAdminInput] = useState([])
	const [adminOutput, setAdminOutput] = useState([])
	const [accuracy, setAccuracy] = useState([])



	const getcodingQuestions = async () => {

		//get code Questions randomly __________Start___________________


		var someData = []
		var someData4 = []
		var saveAccuracy = []
		fetch('http://localhost:5000/coding/getTestCases', {
			method: 'POST',
		})
			.then((response) => {
				return response.json();

			})
			.then(async (myJson) => {
				console.log(myJson)

				for (var i = 0; i < myJson.length; i++) {

					var mycodequestionArray = []
					mycodequestionArray = myJson[i].testInput.map(obj => ({ ...obj }));
					var mycodeOutputArray = myJson[i].expectedOutput.map(obj => ({ ...obj }));
					console.log(myJson)
					for (var j = 0; j < mycodequestionArray.length; j++) {
						someData = mycodequestionArray[j]
						var someData2 = someData[0]
						adminInput.push(someData2)
						console.log(adminInput)
						await Axios.post(`http://localhost:3000/compile`, {
							code: userCode,
							language: userLang,
							input: adminInput[0].toString()
						}).then((res) => {
							adminOutput.push(res.data.output)
							someData4 = mycodeOutputArray[j]
							var someData3 = someData4[0]
							if(someData3 + "\n" === (res.data.output)){
								accuracy.push("Test Case" + " " + (j+1) + " " +  "Passed")
								saveAccuracy.push("Test Case" + " " + (j+1) + " " +  "Passed" + " || ")
							}else{
								accuracy.push("Test Case" + " " + (j+1) + " " +  "Failed")
								saveAccuracy.push("Test Case" + " " + (j+1) + " " +  "Failed" + " || ")
							}
							console.log(adminOutput)
							console.log(accuracy)
							adminInput.pop()
							adminOutput.pop()
							accuracy.pop()
						}).then(() => {
							setLoading(false);
							setUserOutput(saveAccuracy)
						})
					}
				}
			});


		//get code Questions randomly __________End___________________
	}

	// const [myImage, setmyImage] = useState('')
	const newArray = []
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

		ctx.clearRect(0, 0, photo.width, photo.height)

	}
	useEffect(() => {
		getVideo()
		Interval1()
		Interval2()
	}, [videoRef]);

	const Interval1 = () => {
		const id1 = setInterval(takePicture, 40000)
		return () => clearInterval(id1)
	}

	const Interval2 = () => {
		const id3 = setInterval(clearImage, 42000)
		return () => clearInterval(id3)
	}

	const savebtn = () => {

		const data1 = {
			userCode: userCode,
			userInput: userInput.toString(),
			userOutput: userOutput,
			imageArray: imageArray,
			testUUID: uuid()

		}; console.log(typeof (data1))
		fetch('http://localhost:5000/proctoring/saveImages', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(data1)
		}).then((res) => {
			console.log(res.data);
		})
			.catch((error) => {
				console.log(error);
			});
	}




	//Take Pictures using webcam __________End________________________


	//State Variable to display Questions Questions
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const tick = () => setIndex(i => i + 1);
		const id = setInterval(tick, 10000);
		return () => clearInterval(id);
	}, []);
	// State variable to set users source code
	const [userCode, setUserCode] = useState(``);

	// State variable to set editors default language
	const [userLang, setUserLang] = useState("python");

	// State variable to set editors default theme
	const [userTheme, setUserTheme] = useState("vs-dark");

	// State variable to set editors default font size
	const [fontSize, setFontSize] = useState(20);

	// State variable to set users input
	const [userInput, setUserInput] = useState("");

	// State variable to set users output
	const [userOutput, setUserOutput] = useState("");

	// Loading state variable to show spinner
	// while fetching data
	const [loading, setLoading] = useState(false);

	const options = {
		fontSize: fontSize
	}



	// Function to call the compile endpoint


	// Function to call the compile endpoint
	function compile() {
		setLoading(true);
		if (userCode === ``) {
			return
		}

		// Post request to compile endpoint
		Axios.post(`http://localhost:3000/compile`, {
			code: userCode,
			language: userLang,
			input: userInput
		}).then((res) => {
			setUserOutput(res.data.output);

		}).then(() => {
			setLoading(false);
		})
	}

	// Function to clear the output screen
	function clearOutput() {
		setUserOutput("");
	}

	return (
		<>
			<button onClick={getcodingQuestions}>Get your Questions</button>


			<MainNavbar />
			<div className="App">
				<h1>{codeQuestions[index % codeQuestions.length]}</h1>
				<Navbar

					userLang={userLang} setUserLang={setUserLang}
					userTheme={userTheme} setUserTheme={setUserTheme}
					fontSize={fontSize} setFontSize={setFontSize}
				/>
				<div className="main">
					<div className="left-container">
						<Editor
							options={options}
							height="calc(100vh - 50px)"
							width="100%"
							theme={userTheme}
							language={userLang}
							defaultLanguage="python"
							defaultValue="# Enter your code here"
							onChange={(value) => { setUserCode(value) }}
						/>
						<button className="run-btn" onClick={() => compile()}>
							Run
						</button>
						{/* <button className="run-btn" onClick={() => TestCasecompile()}>
							check Test Cases
						</button> */}
					</div>
					<div className="right-container">
						<h4>Input:</h4>
						<div className="input-box">
							<textarea id="code-inp" onChange=
								{(e) => setUserInput(e.target.value)}>
							</textarea>
						</div>
						<h4>Output:</h4>
						{loading ? (
							<div className="spinner-box">
								<img src={spinner} alt="Loading..." />
							</div>
						) : (
							<div className="output-box">
								<pre>{userOutput}</pre>
								<button onClick={() => { clearOutput() }}
									className="clear-btn">
									Clear
								</button>

							</div>

						)}
						<button onClick={() => { savebtn() }}
							className="clear-btn">
							Save
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
