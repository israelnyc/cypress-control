const runner = require('./runner')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const { events } = require('./status-events')
const { handleSIGINT } = require('./process-manager')
const { database, resetProcessStatus } = require('./database.js')
const path = require('path')
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
  socket.emit(events.CYPRESS_DASHBOARD_STATUS, database.read('status').value())

  socket.on(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data => {
    io.emit(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data)
  })

  socket.on(events.CYPRESS_DASHBOARD_TEST_BEGIN, data => {
    io.emit(events.CYPRESS_DASHBOARD_TEST_BEGIN, data)
  })

  socket.on(events.CYPRESS_DASHBOARD_TEST_PENDING, data => {
    io.emit(events.CYPRESS_DASHBOARD_TEST_PENDING, data)
  })

  socket.on(events.CYPRESS_DASHBOARD_TEST_PASSED, data => {
    io.emit(events.CYPRESS_DASHBOARD_TEST_PASSED, { ...data, ...database.read('status').value() })
  })

  socket.on(events.CYPRESS_DASHBOARD_TEST_FAILED, data => {
    io.emit(events.CYPRESS_DASHBOARD_TEST_FAILED, { ...data, ...database.read('status').value() })
  })

  socket.on(events.CYPRESS_DASHBOARD_START_RUNNER, () => {
    console.log('Attempting to start runner...')
    
    runner.start()
  })

  socket.on(events.CYPRESS_DASHBOARD_STOP_RUNNER, () => {
    console.log('Stopping runner...')
    
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