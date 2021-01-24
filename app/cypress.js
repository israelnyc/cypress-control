const { database, resetTestCounts } = require('./database.js')
const { handleSIGINT } = require('./process-manager')
const { events } = require('./status-events')
const glob = require('glob')
const path = require('path')

try {
    const cypress = require(process.cwd() + '\\node_modules\\cypress')
    const {
        integrationFolder = 'cypress/integration/'
    } = require(process.cwd() + '\\cypress.json')

    let specPattern = path.normalize(`./${integrationFolder}/*/**`)

    console.log('spec pattern:', specPattern)

    glob(specPattern, { nodir: true }, (err, matches) => {
        database.update('status.totalSpecs', () => matches.length).write()
    })

    database.get('status').assign({
        cypressPID: process.pid,
        isRunning: true
    }).write()

    resetTestCounts()

    process.send({
        type: events.CYPRESS_DASHBOARD_BEFORE_RUN
    })

    cypress.run({
        config: {
            "reporter": __dirname + "/reporter.js"
        }
    }).then(results => {
        process.send({
            type: events.CYPRESS_DASHBOARD_RUN_COMPLETED,
            data: results
        })

        process.exit(0)
    }).catch((error) => {
        process.send({
            type: events.CYPRESS_DASHBOARD_RUN_ERROR,
            data: error
        })

        process.exit(1)
    })
} catch(error) {
    process.send({
        type: events.CYPRESS_DASHBOARD_MODULE_INCLUDE_ERROR,
        data: error
    })

    process.exit(1)
}

handleSIGINT()