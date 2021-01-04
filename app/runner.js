const childProcess = require('child_process')
const { resetProcessStatus } = require('./database.js')
const processManager = require('./process-manager')

module.exports = {
    start: function(runnerMessageCallback) {
        let cypressProcess= childProcess.fork(`${__dirname}/cypress`)

        cypressProcess.on('message', message => {
            if(typeof runnerMessageCallback === 'function') {
                runnerMessageCallback(message)
            }
        })

        cypressProcess.on('close', function() {
            resetProcessStatus()
        })
    },
    stop: function() {
        processManager.killCypressProcess()
    }
}