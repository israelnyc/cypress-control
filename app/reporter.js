const createStatsCollector = require('mocha/lib/stats-collector')
const Mocha = require('mocha')
const Base = Mocha.reporters.Base
const { events } = require('./status-events')
const { socket } = require('./socket')

const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_TEST_END,
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
            let _suites = []

            if(data.root) {
                getSuiteAndTestData(data.suites)

                function getSuiteAndTestData(suites) {
                    suites.forEach(suite => {
                        _suites.push({
                            title: suite.title,
                            id: suite.id,
                            file: data.file,
                            isParentRootSuite: suite.parent && suite.parent.root,
                            tests: suite.tests.map(test => {
                                return {
                                    title: test.title,
                                    id: test.id,
                                    body: test.body,
                                    file: data.file
                                }
                            })
                        })
                        
                        if(suite.suites.length) getSuiteAndTestData(suite.suites)
                    })
                }
            }
            
                
            socket.emit(events.CYPRESS_DASHBOARD_SUITE_BEGIN, {
                title: data.title, 
                id: data.id,
                isRootSuite: data.root,
                suites: _suites,
                file: data.file
            })
        })

        runner.on(EVENT_SUITE_END, data => {            
            socket.emit(events.CYPRESS_DASHBOARD_SUITE_END, {
                title: data.title, 
                id: data.id,
                isRootSuite: data.root
            })
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
            socket.emit(events.CYPRESS_DASHBOARD_TEST_PASSED, {
                id: data.id,
                title: data.title
            })
        })

        runner.on(EVENT_TEST_FAIL, data => {
            console.log('fail:', data)
            console.log('message:', data.err.message)

            socket.emit(events.CYPRESS_DASHBOARD_TEST_FAILED, {
                id: data.id,
                title: data.title,
                error: data.err
            })
        })

        runner.on(EVENT_TEST_END, data => {
            socket.emit(events.CYPRESS_DASHBOARD_TEST_END, {
                id: data.id,
                title: data.title,
                status: data.state
            })
        })
    }
}

module.exports = CypressDashboardReporter