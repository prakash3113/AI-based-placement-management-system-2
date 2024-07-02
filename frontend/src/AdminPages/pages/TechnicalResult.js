import React, { useEffect, useState } from "react"
import './resultStyle.css'

function TechnicalResult() {
    var myNewArray = [];
    const [techresultData, settechresultData] = useState([])
 
  const loadData = () => {
        fetch('http://localhost:5000/technical/getReportWithtestUUID',{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({testUUID:"04875132-a9ee-49d4-99f6-ea19198c3a10"})
        })
          .then((response) => {
            return response.json(); 
          })
          .then((myJson) => {
            var myNewArray = myJson.map(obj => ({...obj}));
            console.log(myNewArray)
            settechresultData(myNewArray)
            // console.log(techresultData)
          });
    }

  useEffect(() => {
    loadData()
  }, [])


  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="card">
            <div>
    <button className="gd-btn" onClick={loadData}>Create New Technical Test</button>
    </div>
              <div className="card__body">
                <div className = "content-result">
                  {techresultData.map((item, index) => (
                    <div key={index}> 
                    <h5>Test ID: {item.testUUID}</h5>
                    <p>User Name: Something</p>
                    <p>User Email: mail@mail.com</p>
                    <h2 className= "title-result">Topic: {item.topic}</h2>                 
                     <ul>
                     <li><h2>Question: </h2>{item.question}</li>
                        <li><h2>Original Answer: </h2>{item.answer}</li>
                        <li><h2>User Answer: </h2>{item.userAnswer}</li>
                        <li><h2>accuracy: </h2>{item.accuracy}</li>
                          <hr className = "btm-line"/>
                          </ul>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TechnicalResult