import React, {useEffect, useState} from 'react'
import './App.css'
import { startCypressRunner, stopCypressRunner, getSocket } from './utils'
import events from './status-events'

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
    
    socket.on(events.CYPRESS_DASHBOARD_STATUS, data => {
      console.log('receiving status update from server')
      updateTestStats(data)
    })

    socket.on(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data => {
      console.log('suite begin: ', data)
    })

    socket.on(events.CYPRESS_DASHBOARD_TEST_BEGIN, data => {
      console.log('test begin: ', data)
    })
    
    socket.on(events.CYPRESS_DASHBOARD_TEST_PENDING, data => {
      console.log('test pending: ', data)
    })

    socket.on(events.CYPRESS_DASHBOARD_START_RUNNER, () => {
      console.log('Runner started...')
      setCypressIsRunning(true)
    })
  
    socket.on(events.CYPRESS_DASHBOARD_STOP_RUNNER, () => {
      console.log('Runner stopped...')
      setCypressIsRunning(false)
    })

    socket.on(events.CYPRESS_DASHBOARD_TEST_PASSED, data => {
      console.log('test passed', data)
      setPassedCount(data.status.passed)
    })

    socket.on(events.CYPRESS_DASHBOARD_TEST_FAILED, data => {
      console.log('test failed', data)
      setFailedCount(data.status.failed)
    })

    socket.on(events.CYPRESS_DASHBOARD_RUN_COMPLETED, data => {
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
