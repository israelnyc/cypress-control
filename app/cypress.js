const { database, resetTestCounts } = require('./database.js')
const { handleSIGINT } = require('./process-manager')
const { constants } = require('./status-events')

try {
    let cypress = require(process.cwd() + '\\node_modules\\cypress')

    database.get('status').assign({
        cypressPID: process.pid,
        isRunning: true
    }).write()

    resetTestCounts()

    process.send({
        type: constants.CYPRESS_DASHBOARD_BEFORE_RUN
    })

    cypress.run({
        config: {
            "reporter": __dirname + "/reporter.js"
        }
    }).then(results => {
        process.send({
            type: constants.CYPRESS_DASHBOARD_RUN_COMPLETED,
            data: results
        })

        process.exit(0)
    }).catch((error) => {
        process.send({
            type: constants.CYPRESS_DASHBOARD_RUN_ERROR,
            data: error
        })

        process.exit(1)
    })
} catch(error) {
    process.send({
        type: constants.CYPRESS_DASHBOARD_MODULE_INCLUDE_ERROR,
        data: error
    })

    process.exit(1)
}

handleSIGINT()