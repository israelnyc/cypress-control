const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(`${__dirname}/db.json`)
const database = low(adapter)
const { socket } = require('./socket')
const { events } = require('./status-events')

database.defaults({
    status: {
        cypressPID: null,
        isRunning: false, 
        failed: 0, 
        passed: 0,
        totalSpecs: 0,
        totalSpecsRan: 0,
    }
}).write()

function getDatabaseStatus() {
    return database.read('status').value()
}

function emitDatabaseStatus() {
    socket.emit(events.CYPRESS_DASHBOARD_STATUS, getDatabaseStatus())
}

function resetProcessStatus() {
    console.log('----- resetting process status -----')
    database.get('status').assign({
        cypressPID: null,
        isRunning: false,
    }).write()

    emitDatabaseStatus()
}

function resetTestCounts() {
    console.log('----- resetting test counts -----')
    database.get('status').assign({
        failed: 0,
        passed: 0,
        totalSpecs: 0,
        totalSpecsRan: 0,
    }).write()

    emitDatabaseStatus()
}

module.exports = {
    getDatabaseStatus,
    database,
    resetProcessStatus,
    resetTestCounts
}