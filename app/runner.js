const childProcess = require('child_process')
// const { resetProcessStatus, database } = require('./database.js')
const processManager = require('./process-manager')
const { socket } = require('./socket')
const { events } = require('./status-events')
const { getStatus, setStatus, resetTestStatus, resetProcessStatus } = require('./status')

module.exports = {
    start: function(runnerMessageCallback) {
        // const { isRunning } = database.read('status').value().status
        const { isRunning } = getStatus()

        if(isRunning) {
            console.log('Cypress process is already running...')
            return
        }

        let cypressProcess= childProcess.fork(`${__dirname}/cypress`)

        resetTestStatus()

        setStatus({
            cypressPID: cypressProcess.pid,
            isRunning: true
        })

        cypressProcess.on('message', message => {
            if(typeof runnerMessageCallback === 'function') {
                runnerMessageCallback(message)
            }

            if(message.type === events.CYPRESS_DASHBOARD_RUN_COMPLETED) {
                console.log('runner:passed:', getStatus().passed)
                resetProcessStatus()
            }

            socket.emit(message.type, message.data)
        })
    },
    stop: function() {
        processManager.killCypressProcess()
    }
}