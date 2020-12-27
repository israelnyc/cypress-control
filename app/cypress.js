const { database, resetTestCounts } = require('./database.js')

try {
    let cypress = require(process.cwd() + '\\node_modules\\cypress')
    
    console.log('Running cypress...')

    database.get('status').assign({
        cypressPID: process.pid,
        isRunning: true
    }).write()

    resetTestCounts()

    cypress.run({
        config: {
            
        }
    }).then(() => {
        process.exit(0)
    }, (error) => {
        console.log(error)
        process.exit(1)
    })
} catch(error) {
    console.log(error)
}

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