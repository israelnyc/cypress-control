const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(`${__dirname}/db.json`)
const database = low(adapter)

database.defaults({
    status: {
        cypressPID: null,
        isRunning: false,
        tests: 0, 
        failed: 0, 
        passed: 0,
    }
}).write()

function resetProcessStatus() {
    database.get('status').assign({
        cypressPID: null,
        isRunning: false,
    }).write()
}

function resetTestCounts() {
    database.get('status').assign({
        tests: 0,
        failed: 0,
        passed: 0
    }).write()
}

module.exports = {
    database,
    resetProcessStatus,
    resetTestCounts
}