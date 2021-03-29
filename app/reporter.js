const createStatsCollector = require('mocha/lib/stats-collector');
const Mocha = require('mocha');
const Base = Mocha.reporters.Base;
const Spec = require('mocha/lib/reporters/spec');
const { events } = require('./status-events');
const { socket } = require('./socket-client');
const { v4: uuidv4 } = require('uuid');

const {
    EVENT_RUN_BEGIN,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_TEST_END,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END,
    EVENT_TEST_BEGIN,
    EVENT_TEST_PENDING,
    EVENT_HOOK_END,
} = Mocha.Runner.constants;

class CypressControlReporter {
    constructor(runner) {
        createStatsCollector(runner);

        Base.call(this, runner);

        new Spec(runner);

        runner.on(EVENT_RUN_BEGIN, () => {
            socket.emit(events.CYPRESS_CONTROL_RUN_BEGIN);
        });

        runner.on(EVENT_SUITE_BEGIN, data => {
            let _suites = [];
            let testsCount = 0;

            if (data.root) {
                getSuiteAndTestData(data.suites);

                function getSuiteAndTestData(suites) {
                    suites.forEach(suite => {
                        testsCount += suite.tests.length;

                        suite.uuid = uuidv4();

                        _suites.push({
                            title: suite.title,
                            id: suite.id,
                            uuid: suite.uuid,
                            file: data.file,
                            isParentRootSuite:
                                suite.parent && suite.parent.root,
                            tests: suite.tests.map(test => {
                                test.uuid = uuidv4();

                                return {
                                    title: test.title,
                                    id: test.id,
                                    uuid: test.uuid,
                                    body: test.body,
                                    file: data.file,
                                };
                            }),
                        });

                        if (suite.suites.length)
                            getSuiteAndTestData(suite.suites);
                    });
                }
            } else {
                testsCount += data.tests.length;
            }

            socket.emit(events.CYPRESS_CONTROL_SUITE_BEGIN, {
                ...this.getEventDataObject(data),
                suites: _suites,
                totalTests: testsCount,
            });
        });

        runner.on(EVENT_SUITE_END, data => {
            socket.emit(events.CYPRESS_CONTROL_SUITE_END, {
                ...this.getEventDataObject(data),
                isRootSuite: data.root,
            });
        });

        runner.on(EVENT_TEST_BEGIN, data => {
            socket.emit(
                events.CYPRESS_CONTROL_TEST_BEGIN,
                this.getEventDataObject(data)
            );
        });

        runner.on(EVENT_TEST_PENDING, data => {
            socket.emit(
                events.CYPRESS_CONTROL_TEST_PENDING,
                this.getEventDataObject(data)
            );
        });

        runner.on(EVENT_TEST_PASS, data => {
            socket.emit(
                events.CYPRESS_CONTROL_TEST_PASSED,
                this.getEventDataObject(data)
            );
        });

        runner.on(EVENT_TEST_FAIL, data => {
            socket.emit(
                events.CYPRESS_CONTROL_TEST_FAILED,
                this.getEventDataObject(data)
            );
        });

        runner.on(EVENT_TEST_END, data => {
            socket.emit(
                events.CYPRESS_CONTROL_TEST_END,
                this.getEventDataObject(data)
            );
        });
    }

    getEventDataObject(data) {
        return {
            id: data.id,
            title: data.title,
            ...(data.uuid && { uuid: data.uuid }),
            ...(data.state && { status: data.state }),
            ...(data.err && { error: data.err }),
            ...(data.root && { isRootSuite: data.root }),
            ...(data.file && { file: data.file }),
            ...(data.duration && { duration: data.duration }),
            ...(data.body && { body: data.body }),
        };
    }
}

module.exports = CypressControlReporter;
