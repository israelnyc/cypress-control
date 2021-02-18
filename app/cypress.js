const { handleSIGINT } = require('./process-manager')
const { events } = require('./status-events')
const glob = require('glob')
const path = require('path')

try {
    const cypress = require(process.cwd() + '\\node_modules\\cypress')
    const {
        componentFolder,
        integrationFolder = 'cypress/integration/'
    } = require(process.cwd() + '\\cypress.json')

    const specPattern = [path.normalize(`./${integrationFolder}/**/**`)]

    if(componentFolder) {
        specPattern.push(path.normalize(`./${componentFolder}/**/**`))
    }

    console.log('config componentFolder:', componentFolder)
    console.log('config integrationFolder:', integrationFolder)
    console.log('spec pattern:', specPattern)
    console.log('cwd:', process.cwd())

    const globPattern = `{${specPattern.join(',')}}`

    glob(globPattern, { nodir: true }, (err, matches) => {
        process.send({
            type: events.CYPRESS_DASHBOARD_BEFORE_RUN,
            data: {
                totalSpecs: matches.length
            }
        })
    })

    cypress.run({
        config: {
            "reporter": __dirname + "/reporter.js"
        },
        spec: specPattern
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