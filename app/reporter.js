const createStatsCollector = require('mocha/lib/stats-collector')
const Mocha = require('mocha')
const Base = Mocha.reporters.Base
const { database } = require('./database.js')
const { events } = require('./status-events')
const { socket } = require('./socket')

const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END,
    EVENT_TEST_BEGIN,
    EVENT_TEST_PENDING
} = Mocha.Runner.constants

class CypressDashboardReporter {
    constructor(runner) {
        createStatsCollector(runner)
    
        Base.call(this, runner)

        runner.on(EVENT_RUN_BEGIN, () => {
            socket.emit(events.CYPRESS_DASHBOARD_RUN_BEGIN)
        })

        runner.on(EVENT_SUITE_BEGIN, data => {
            if(data.root) {
                database.update('status.totalSpecsRan', totalSpecsRan => totalSpecsRan + 1).write()
                
                socket.emit(events.CYPRESS_DASHBOARD_SUITE_BEGIN, {
                    title: data.title
                })
            }
        })

        runner.on(EVENT_TEST_BEGIN, data => {
            socket.emit(events.CYPRESS_DASHBOARD_TEST_BEGIN, {
                id: data.id,
                title: data.title
            })
        })

        runner.on(EVENT_TEST_PENDING, data => {
            socket.emit(events.CYPRESS_DASHBOARD_TEST_PENDING, {
                id: data.id,
                title: data.title
            })
        })

        runner.on(EVENT_TEST_PASS, data => {
            database.update('status.passed', passed => passed + 1).write()
            socket.emit(events.CYPRESS_DASHBOARD_TEST_PASSED, {
                id: data.id,
                title: data.title
            })
        })

        runner.on(EVENT_TEST_FAIL, data => {
            database.update('status.failed', failed => failed + 1).write()
            socket.emit(events.CYPRESS_DASHBOARD_TEST_FAILED, {
                id: data.id,
                title: data.title
            })
        })
    }
}

module.exports = CypressDashboardReporter