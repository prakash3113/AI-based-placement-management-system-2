import React from 'react'
import { useHistory } from "react-router-dom";
function AptiResult() {


  const history = useHistory();
  const handleRoute = () =>{ 
      history.push("/admincreateAptitest");
    }

  return (
    <>
    <button className="gd-btn" onClick={handleRoute}>Create New Test</button>
    </>
  )
}

export default AptiResult