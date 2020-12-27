const childProcess = require('child_process')
const { resetProcessStatus } = require('./database.js')
const processManager = require('./processManager')

module.exports = {
    start: function() {
        console.log('forking cypress process...')

        let cypressProcess = childProcess.fork(`${__dirname}/cypress`)

        console.log('forked process:', cypressProcess.pid)
        
        cypressProcess.on('close', function() {
            resetProcessStatus()
        })
    },
    stop: function() {
        processManager.killCypressProcess()
    }
}