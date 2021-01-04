const runner = require('./runner')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const { constants } = require('./status-events')
const { handleSIGINT } = require('./process-manager')
const { database } = require('./database.js')
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
  Object.keys(constants).forEach(statusEvent => {
    socket.on(constants[statusEvent], () => {
      io.emit(constants[statusEvent], database.read('status').value())
    })
  })
})

handleSIGINT()

http.listen(8686, () => {
  console.log('listening on *:8686')
})

module.exports.runner = runner