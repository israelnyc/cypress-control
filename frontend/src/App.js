import React, {useEffect, useState} from 'react'
import logo from './logo.svg'
import './App.css'
import io from 'socket.io-client'

function App() {
  const [passedCount, setPassedCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)

  useEffect(() => {
    const socket = io('http://localhost:8686')
    
    socket.on('cypress_dashboard_test_passed', (data) => {
      setPassedCount(data.status.passed)
    })

    socket.on('cypress_dashboard_test_failed', (data) => {
      setFailedCount(data.status.failed)
    })

    return () => socket.disconnect()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>{passedCount} tests passed</p>
        <p>{failedCount} tests failed</p>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
