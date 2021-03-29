const { events } = require('./status-events');
const { socket } = require('./socket-client');
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
            events.CYPRESS_CONTROL_STATUS,
            { eventType, payload },
            status => resolve(status)
        );
    });
}

function setStatus(newStatus, eventType, payload) {
    Object.assign(status, newStatus);

    broadcastStatus(eventType, payload);
}

function updateCurrentSpecTestStatus(data, eventType) {
    let currentSpecTest = status.currentSpec.suites
        .reduce((prev, curr) => {
            return prev.concat(curr.tests);
        }, [])
        .filter(test => test.id === data.id)[0];

    if (currentSpecTest) {
        currentSpecTest.hasCompleted = true;
        currentSpecTest.status = data.status;
        currentSpecTest.duration = data.duration;

        if (data.error) currentSpecTest.error = data.error;
    }

    broadcastStatus(eventType, currentSpecTest);
}

function getStatus() {
    return status;
}

function getStatusFromServer() {
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_CONTROL_GET_STATUS, {}, status =>
            resolve(status)
        );
    });
}

function resetProcessStatus() {
    console.log('resetting process status');
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_CONTROL_RESET_PROCESS_STATUS, {}, () =>
            resolve()
        );
    });
}

function resetTestStatus() {
    return new Promise(resolve => {
        socket.emit(events.CYPRESS_CONTROL_RESET_TEST_STATUS, {}, () =>
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
