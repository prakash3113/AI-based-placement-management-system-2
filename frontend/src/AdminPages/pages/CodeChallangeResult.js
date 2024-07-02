import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom";
function CodeChallangeResult() {
  const [coderesultData, setcoderesultData] = useState([])
  const history = useHistory();
  
  const handleRoute = () =>{ 
    history.push("/adminaddCodeQuestions");
  }
  var myNewArray = [];


  const loadData = () => {
    fetch('http://localhost:5000/proctoring/getSavedImagesResult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testUUID: "testUUID" })
    })
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        var myNewArray = myJson.map(obj => ({ ...obj }));
        console.log(myNewArray)
        setcoderesultData(myNewArray)
        // console.log(coderesultData)
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
                <button className="gd-btn" onClick={handleRoute}>Create New Code Challange</button>
              </div>
              <div className="card__body">
                <div className="content-result">
                  {coderesultData.map((item, index) => (
                    <div key={index}>
                      <h5>Test ID: {item.testUUID}</h5>
                      <p>User Name: Something</p>
                      <p>User Email: mail@mail.com</p>
                      {(() => {
                        if (item.flags.multiplePersons) {
                          return (
                            <h2 className="title-result">Multiple Persons Found</h2>
                          )
                        } else if (item.flags.tvmonitor) {
                          return (
                            <h2 className="title-result">Mobile or Other Digital Device Found</h2>
                          )
                        } else {
                          return (
                            <h2 className="title-result">Proctoring Approved</h2>
                          )
                        }
                      })()}
                      <hr className = "btm-line"/>
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

export default CodeChallangeResult