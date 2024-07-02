import React, { useEffect, useState } from "react"
import './resultStyle.css'

function GDResult() {
  const [gdresultData, setgdresultData] = useState([])
  var myNewArray = [];

  const loadData = () => {
    fetch('http://localhost:5000/GD/getGDReportAccordingTestUUID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testUUID: "testUUID" })
    })
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        myNewArray = myJson.map(obj => ({ ...obj }));
        setgdresultData(myNewArray)
        console.log(gdresultData)


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
    <button className="gd-btn" onClick={loadData}>Create New Group Descussion Topic</button>
    </div>
              <div className="card__body">
                <div className = "content-result">
                  {gdresultData.map((item, index) => (
                    <div key={index}> 
                    <h5>Test ID: {item.testUUID}</h5>
                    <p>User Name: Something</p>
                    <p>User Email: mail@mail.com</p>
                    <h2 className= "title-result">Topic: {item.topic}</h2>                 
                      {item.result.map((c, i) => (
                        <ul key={i}>
                        <li><h2>Point: </h2>{c.point}</li>
                        <li><h2>Accuracy: </h2>{c.accuracy}</li>
                        <li><h2>Grammer Replacements: </h2>{c.grammerReplacement}</li>
                        <li><h2>Quality: </h2>{c.quality}</li>
                          <hr className = "btm-line"/>
                        </ul>
                      ))}
                     
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

export default GDResult