const runner = require('./runner');
const { events } = require('./status-events');
const {
    getStatus,
    setStatus,
    updateCurrentSpecTestStatus,
} = require('./status');

let io = null;

function dispatchCypressStatus(data = {}, callback) {
    if (callback) callback(getStatus());

    io.emit(events.CYPRESS_CONTROL_STATUS, {
        status: getStatus(),
        eventType: data.eventType,
        payload: data.payload,
    });
}

function getCypressStatus(data, callback) {
    if (callback) callback(getStatus());
}

function resetCypressProcessStatus(data, callback) {
    setStatus(
        {
            cypressPID: null,
            isStarting: false,
            isRunning: false,
        },
        events.CYPRESS_CONTROL_RESET_PROCESS_STATUS
    );

    if (callback) callback();
}

function resetTestStatus(data, callback) {
    setStatus(
        {
            failed: 0,
            passed: 0,
            pending: 0,
            totalSpecs: 0,
            totalSpecsRan: 0,
            completedSpecs: [],
            currentSpec: {},
            currentSpecFailures: {},
            currentTest: {},
            totalDuration: null,
        },
        events.CYPRESS_CONTROL_RESET_TEST_STATUS
    );

    if (callback) callback();
}

function startRunner(specSelections = {}) {
    console.log('Attempting to start runner...');

    runner.start(specSelections.isFiltered ? specSelections.selectedSpecs : []);

    dispatchCypressStatus({ eventType: events.CYPRESS_CONTROL_START_RUNNER });
}

function stopRunner() {
    console.log('Stopping runner...');

    setStatus({ currentSpec: {} }, events.CYPRESS_CONTROL_STOP_RUNNER);

    runner.stop();
}

function onBeforeRun(data) {
    setStatus(
        { totalSpecs: data.totalSpecs },
        events.CYPRESS_CONTROL_BEFORE_RUN,
        data
    );
}

function onRunCompleted(data) {
    setStatus(
        {
            currentSpec: {},
            totalDuration: data.totalDuration,
        },
        events.CYPRESS_CONTROL_RUN_COMPLETED,
        data
    );
}

function onSpecRunBegin() {
    setStatus(
        {
            isRunning: true,
            isStarting: false,
        },
        events.CYPRESS_CONTROL_SPEC_RUN_BEGIN
    );
}

function onSpecRunEnd(data) {
    const { completedSpecs, currentSpec, totalSpecsRan } = getStatus();

    setStatus(
        {
            totalSpecsRan: totalSpecsRan + 1,
            completedSpecs: [
                ...completedSpecs,
                {
                    ...currentSpec,
                    hasCompleted: true,
                    stats: data,
                },
            ],
        },
        events.CYPRESS_CONTROL_SPEC_RUN_END,
        data
    );
}

function onSuiteBegin(data) {
    if (data.isRootSuite) {
        setStatus(
            {
                currentSpec: data,
                currentSpecFailures: {},
            },
            events.CYPRESS_CONTROL_SUITE_BEGIN,
            data
        );
    }
}

function onSuiteEnd(data) {
    dispatchCypressStatus({
        eventType: events.CYPRESS_CONTROL_SUITE_END,
        payload: data,
    });
}

function onTestBegin(data) {
    setStatus({ currentTest: data }, events.CYPRESS_CONTROL_TEST_BEGIN, data);
}

function onTestPending(data) {
    const { pending } = getStatus();

    setStatus({ pending: pending + 1 }, events.CYPRESS_CONTROL_TEST_PENDING);

    onTestEnd(data);
}

function onTestPassed(data) {
    const { passed } = getStatus();

    setStatus({ passed: passed + 1 }, events.CYPRESS_CONTROL_TEST_PASSED, data);
}

function onTestFailed(data) {
    const { currentSpecFailures, failed } = getStatus();

    if (!currentSpecFailures.hasOwnProperty(data.id)) {
        setStatus(
            {
                failed: failed + 1,
                currentSpecFailures: {
                    [data.id]: true,
                    ...currentSpecFailures,
                },
            },
            events.CYPRESS_CONTROL_TEST_FAILED,
            data
        );
    }
}

function onTestEnd(data) {
    updateCurrentSpecTestStatus(data, events.CYPRESS_CONTROL_TEST_END);
}

module.exports.init = _io => {
    io = _io;

    io.on('connection', socket => {
        socket.emit(events.CYPRESS_CONTROL_STATUS, {
            status: getStatus(),
            eventType: events.CYPRESS_CONTROL_STATUS,
        });

        socket.on(events.CYPRESS_CONTROL_STATUS, dispatchCypressStatus);
        socket.on(events.CYPRESS_CONTROL_GET_STATUS, getCypressStatus);
        socket.on(
            events.CYPRESS_CONTROL_RESET_PROCESS_STATUS,
            resetCypressProcessStatus
        );
        socket.on(events.CYPRESS_CONTROL_RESET_TEST_STATUS, resetTestStatus);

        socket.on(events.CYPRESS_CONTROL_START_RUNNER, startRunner);
        socket.on(events.CYPRESS_CONTROL_STOP_RUNNER, stopRunner);

        socket.on(events.CYPRESS_CONTROL_BEFORE_RUN, onBeforeRun);
        socket.on(events.CYPRESS_CONTROL_RUN_COMPLETED, onRunCompleted);

        socket.on(events.CYPRESS_CONTROL_SPEC_RUN_BEGIN, onSpecRunBegin);
        socket.on(events.CYPRESS_CONTROL_SPEC_RUN_END, onSpecRunEnd);

        socket.on(events.CYPRESS_CONTROL_SUITE_BEGIN, onSuiteBegin);
        socket.on(events.CYPRESS_CONTROL_SUITE_END, onSuiteEnd);
        socket.on(events.CYPRESS_CONTROL_TEST_BEGIN, onTestBegin);
        socket.on(events.CYPRESS_CONTROL_TEST_PENDING, onTestPending);
        socket.on(events.CYPRESS_CONTROL_TEST_PASSED, onTestPassed);
        socket.on(events.CYPRESS_CONTROL_TEST_FAILED, onTestFailed);
        socket.on(events.CYPRESS_CONTROL_TEST_END, onTestEnd);

        socket.on('disconnect', () => socket.removeAllListeners());
    });
};
