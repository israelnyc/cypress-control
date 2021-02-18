// const { database, resetProcessStatus } = require('./database')
const { broadcastStatus, resetProcessStatus } = require('./status')
const { socket } = require('./socket')

function killCypressProcess() {
    // const {
    //     cypressPID,
    //     isRunning
    // } = database.read('status').value().status
    broadcastStatus(status => {
        if(status.isRunning && status.cypressPID) {
            process.kill(status.cypressPID)
    
            resetProcessStatus()
        }
    })
}

function handleSIGINT() {
    if(process.platform === "win32") {
        const rl = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        })
    
        rl.on("SIGINT", function() {
            process.emit("SIGINT")
        })
    }
    
    process.on('SIGINT', function() {
        resetProcessStatus()
        process.exit()
    })
}

module.exports = {
    killCypressProcess,
    handleSIGINT
}