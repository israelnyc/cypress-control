import React, {useEffect, useState} from 'react'
import './App.css'
import { startCypressRunner, stopCypressRunner, getSocket } from './utils'

function App() {
  const [passedCount, setPassedCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const [cypressIsRunning, setCypressIsRunning] = useState(false)

  useEffect(() => {
    const socket = getSocket()

    function updateTestStats(data) {
      setPassedCount(data.status.passed)
      setFailedCount(data.status.failed)
      setCypressIsRunning(data.status.isRunning)
    }
    
    socket.on('cypress_dashboard_status', data => {
      console.log('receiving status update from server')
      updateTestStats(data)
    })

    socket.on('cypress_dashboard_start_runner', () => {
      console.log('Runner started...')
      setCypressIsRunning(true)
    })
  
    socket.on('cypress_dashboard_stop_runner', () => {
      console.log('Runner stopped...')
      setCypressIsRunning(false)
    })

    socket.on('cypress_dashboard_test_passed', data => {
      console.log('test passed')
      setPassedCount(data.status.passed)
    })

    socket.on('cypress_dashboard_test_failed', data => {
      console.log('test failed')
      setFailedCount(data.status.failed)
    })

    socket.on('cypress_dashboard_run_completed', data => {
      console.log('Run completed')
      updateTestStats(data)
    })

    return () => socket.disconnect()
  }, [])  

  return (
    <div className="App">
      <header className="App-header">
        <p>{passedCount} tests passed</p>
        <p>{failedCount} tests failed</p>
        <button onClick={startCypressRunner}>Start Cypress Runner</button>
        <button onClick={stopCypressRunner}>Stop Cypress Runner</button>
        <span className={`runner-status ${cypressIsRunning ? "running" : "stopped"}`}></span>
      </header>
    </div>
  )
}

export default App
