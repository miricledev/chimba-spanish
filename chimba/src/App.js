import React, {useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {

  const [data, setData] = useState([{}])
  const [responseData, setResponseData] = useState()

  useEffect(() => {
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  const sendData = async() =>{
    try{
      const response = await axios.post("/api/data", {
        message: data
      });
      console.log(response.data.reply)

      setResponseData(response.data.reply)
    } catch(error){
      console.log("Error:", error)
    }

  }

  return (
    <div>
      <button onClick={sendData}>
        Send data
      </button>
      {responseData &&(<p> Response: {responseData}</p>)}
    </div>
  )
}

export default App
