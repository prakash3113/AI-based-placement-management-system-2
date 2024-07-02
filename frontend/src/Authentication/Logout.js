import React, { useEffect } from 'react'

function Logout({history}) {
    useEffect(()=>{
        history.push('/login')
    },3000)
  return (
    <div>You Successfully Logged Out Logout</div>
  )
}

export default Logout