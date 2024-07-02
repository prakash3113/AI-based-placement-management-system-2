import React, { useEffect, useState } from "react"

const Result = () => {
  const [gdresultData, setgdresultData] = useState([])

var myNewArray = [];
  // fetch result data
// const fetchData = () =>{
  fetch('http://localhost:5000/GD/getGDReportAccordingTestUUID',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({testUUID:"testUUID"})
  })
    .then((response) => {
      return response.json(); 
    })
    .then((myJson) => {
      myNewArray = myJson.map(obj => ({...obj}));
      console.log(myNewArray)
    });
// } 
// End of fetch Technical result data 


// fetch Technical result data
 const fetchTechnicalData = () =>{
  fetch('http://localhost:5000/technical/getReportWithtestUUID',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({testUUID:"testUUID"})
  })
    .then((response) => {
      return response.json(); 
    })
    .then((myJson) => {
      var myNewArray = myJson.map(obj => ({...obj}));
      console.log(myNewArray)
    });
} 
 // End of fetch Technical result data


  useEffect(() => {
    
  }, [])
  return (
      <>
      {/* <button onClick = {fetchData}>Fetch GD Result</button> */}
      <button onClick = {fetchTechnicalData}>Fetch Technical Result</button>
    <div className = "container">
    <table class="table">
  <thead class="thead-dark">
    <tr>
            <th>accuracy</th>
            <th>grammerReplacement</th>
            <th>point</th>
            <th>quality</th>
    </tr>
  </thead>
 
  <tbody>
          {myNewArray.map((item, i) => (
            <tr key={i}>
              <td>{item.result.accuracy}</td>
              <td>{item.result.grammerReplacement}</td>
              <td>{item.result.point}</td>
              <td>{item.result.quality}</td>
            </tr>
          ))}
    
   
  </tbody>
</table>

</div>
</>
  )
}

export default Result
