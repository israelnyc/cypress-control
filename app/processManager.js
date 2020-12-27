const { database, resetProcessStatus } = require('./database')

function killCypressProcess () {
    const {
        cypressPID,
        isRunning
    } = database.get('status').value()

    if(isRunning && cypressPID) {
        process.kill(cypressPID)

        resetProcessStatus()
    }
}

module.exports = {
    killCypressProcess
}