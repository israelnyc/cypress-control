const { events } = require('./status-events')
const { socket } = require('./socket')
const status = {
    "cypressPID": null,
    "isRunning": false,
    "failed": 0,
    "passed": 0,
    "totalSpecs": 0,
    "totalSpecsRan": 0,
    "currentSuiteFailures": {}
}

function broadcastStatus() {
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_DASHBOARD_STATUS, {}, status => resolve(status))
    })
}

function setStatus(newStatus) {    
    Object.assign(status, newStatus)
    
    broadcastStatus()
}

function getStatus() {
    return status
}

function getStatusFromServer() {
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_DASHBOARD_GET_STATUS, {}, status => resolve(status))
    })
}

function resetProcessStatus() {
    console.log('resetting process status')
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_DASHBOARD_RESET_PROCESS_STATUS, {}, () => resolve())
    })
}

function resetTestStatus() {
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_DASHBOARD_RESET_TEST_STATUS, {}, () => resolve())
    })
}

module.exports = {
    broadcastStatus,
    getStatus,
    getStatusFromServer,
    setStatus,
    resetProcessStatus,
    resetTestStatus
}