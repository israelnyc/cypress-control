const { database, resetProcessStatus } = require('./database')

function killCypressProcess() {
    const {
        cypressPID,
        isRunning
    } = database.read('status').value().status
    
    if(isRunning && cypressPID) {
        process.kill(cypressPID)

        resetProcessStatus()
    }
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
        process.exit()
    })
}

module.exports = {
    killCypressProcess,
    handleSIGINT
}