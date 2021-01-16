const createStatsCollector = require('mocha/lib/stats-collector')
const Mocha = require('mocha')
const Base = Mocha.reporters.Base
const { database } = require('./database.js')
const { constants } = require('./status-events')
const { socket } = require('./socket')

const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END
} = Mocha.Runner.constants

class CypressDashboardReporter {
    constructor(runner) {
        createStatsCollector(runner)
    
        Base.call(this, runner)

        runner.on(EVENT_RUN_BEGIN, () => {
            socket.emit(constants.CYPRESS_DASHBOARD_RUN_BEGIN)
        })

        runner.on(EVENT_TEST_PASS, test => {
            database.update('status.passed', passed => passed + 1).write()
            socket.emit(constants.CYPRESS_DASHBOARD_TEST_PASSED)
        })

        runner.on(EVENT_TEST_FAIL, test => {
            database.update('status.failed', failed => failed + 1).write()
            socket.emit(constants.CYPRESS_DASHBOARD_TEST_FAILED)
        })
    }
}

module.exports = CypressDashboardReporter