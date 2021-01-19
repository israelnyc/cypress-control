const childProcess = require('child_process')
const { resetProcessStatus, database } = require('./database.js')
const processManager = require('./process-manager')
const { socket } = require('./socket')
const { events } = require('./status-events')

module.exports = {
    start: function(runnerMessageCallback) {
        const { isRunning } = database.read('status').value().status

        if(isRunning) {
            console.log('Cypress process is already running...')
            return
        }

        let cypressProcess= childProcess.fork(`${__dirname}/cypress`)

        cypressProcess.on('message', message => {
            if(typeof runnerMessageCallback === 'function') {
                runnerMessageCallback(message)
            }

            if(message.type === events.CYPRESS_DASHBOARD_RUN_COMPLETED) {
                resetProcessStatus()
            }

            socket.emit(message.type, message.data)
        })

        cypressProcess.on('close', function(data) {
            resetProcessStatus()
        })
    },
    stop: function() {
        processManager.killCypressProcess()
    }
}