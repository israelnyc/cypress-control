const runner = require('./runner')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const { events } = require('./status-events')
const { handleSIGINT } = require('./process-manager')
// const { database, getDatabaseStatus, resetProcessStatus } = require('./database.js')
const path = require('path')
const { broadcastStatus, getStatus, setStatus, resetProcessStatus, resetTestStatus } = require('./status')
const io = require('socket.io')(http, {
  cors: {
    origin: ['http://localhost:3000']
  }
})

app.use(express.static(path.join(__dirname, '../frontend/build/')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/', 'index.html'))
})

io.on('connection', socket => {  
  socket.emit(events.CYPRESS_DASHBOARD_STATUS, getStatus())

  socket.on(events.CYPRESS_DASHBOARD_STATUS, (data, callback) => {
    if(callback) callback(getStatus())
    io.emit(events.CYPRESS_DASHBOARD_STATUS, getStatus())
  })

  socket.on(events.CYPRESS_DASHBOARD_RESET_PROCESS_STATUS, (data, callback) => {
    setStatus({
      cypressPID: null,
      isRunning: false
    })

    if(callback) callback()
  })

  socket.on(events.CYPRESS_DASHBOARD_RESET_TEST_STATUS, (data, callback) => {
    setStatus({
      failed: 0,
      passed: 0,
      totalSpecs: 0,
      totalSpecsRan: 0
    })

    if(callback) callback()
  })

  socket.on(events.CYPRESS_DASHBOARD_BEFORE_RUN, data => {
    resetTestStatus().then(() => {
      setStatus({
        totalSpecs: data.totalSpecs
      })
    })
  })

  socket.on(events.CYPRESS_DASHBOARD_RUN_BEGIN, () => {
    io.emit(events.CYPRESS_DASHBOARD_RUN_BEGIN, getStatus())
  })

  socket.on(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data => {
    io.emit(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data)
  })
  
  socket.on(events.CYPRESS_DASHBOARD_SUITE_END, data => {
    if(data.isRootSuite) {
      setStatus({
        totalSpecsRan: getStatus().totalSpecsRan + 1
      })
    }
    io.emit(events.CYPRESS_DASHBOARD_SUITE_END, data)
  })

  socket.on(events.CYPRESS_DASHBOARD_TEST_BEGIN, data => {
    io.emit(events.CYPRESS_DASHBOARD_TEST_BEGIN, data)
  })

  socket.on(events.CYPRESS_DASHBOARD_TEST_PENDING, data => {
    io.emit(events.CYPRESS_DASHBOARD_TEST_PENDING, data)
  })

  socket.on(events.CYPRESS_DASHBOARD_TEST_PASSED, data => {
    setStatus({passed: getStatus().passed + 1})
    io.emit(events.CYPRESS_DASHBOARD_TEST_PASSED, { ...data, ...getStatus() })
  })

  socket.on(events.CYPRESS_DASHBOARD_TEST_FAILED, data => {
    setStatus({failed: getStatus().failed + 1})
    io.emit(events.CYPRESS_DASHBOARD_TEST_FAILED, { ...data, ...getStatus() })
  })

  socket.on(events.CYPRESS_DASHBOARD_RUN_COMPLETED, data => {
    console.log('server:run:completed', getStatus())
    io.emit(events.CYPRESS_DASHBOARD_RUN_COMPLETED, { ...data, ...getStatus() })
  })

  socket.on(events.CYPRESS_DASHBOARD_START_RUNNER, () => {
    console.log('Attempting to start runner...')
    
    runner.start()

    io.emit(events.CYPRESS_DASHBOARD_START_RUNNER, getStatus())
  })

  socket.on(events.CYPRESS_DASHBOARD_STOP_RUNNER, () => {
    console.log('Stopping runner...')
    
    io.emit(events.CYPRESS_DASHBOARD_STOP_RUNNER, getStatus())

    runner.stop()
  })

  socket.on('disconnect', () => {
    socket.removeAllListeners()
  })
})

handleSIGINT()
resetProcessStatus()

http.listen(8686, () => {
  console.log('listening on *:8686')
})

module.exports.runner = runner