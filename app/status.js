const { events } = require('./status-events');
const { socket } = require('./socket');
const status = {
    cypressPID: null,
    isStarting: false,
    isRunning: false,
    failed: 0,
    passed: 0,
    totalSpecs: 0,
    totalSpecsRan: 0,
    completedSpecs: [],
    currentSpec: {},
    currentSpecFailures: {},
    currentTest: {},
};

function broadcastStatus(eventType, payload = {}) {
    return new Promise(resolve => {
        socket.emit(
            events.CYPRESS_DASHBOARD_STATUS,
            { eventType, payload },
            status => resolve(status)
        );
    });
}

function setStatus(newStatus, eventType, payload) {
    Object.assign(status, newStatus);

    broadcastStatus(eventType, payload);
}

function updateCurrentSpecTestStatus(testId, testStatus, eventType) {
    const currentSpecTest = status.currentSpec.suites
        .reduce((prev, curr) => {
            return prev.concat(curr.tests);
        }, [])
        .filter(test => test.id === testId)[0];

    if (currentSpecTest) {
        currentSpecTest.hasCompleted = true;
        currentSpecTest.status = testStatus;
    }

    broadcastStatus(eventType, currentSpecTest);
}

function getStatus() {
    return status;
}

function getStatusFromServer() {
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_DASHBOARD_GET_STATUS, {}, status =>
            resolve(status)
        );
    });
}

function resetProcessStatus() {
    console.log('resetting process status');
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_DASHBOARD_RESET_PROCESS_STATUS, {}, () =>
            resolve()
        );
    });
}

function resetTestStatus() {
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_DASHBOARD_RESET_TEST_STATUS, {}, () =>
            resolve()
        );
    });
}

module.exports = {
    broadcastStatus,
    getStatus,
    getStatusFromServer,
    setStatus,
    resetProcessStatus,
    resetTestStatus,
    updateCurrentSpecTestStatus,
};
