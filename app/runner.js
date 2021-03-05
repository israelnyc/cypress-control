const childProcess = require('child_process');
const processManager = require('./process-manager');
const { socket } = require('./socket');
const { events } = require('./status-events');
const {
    getStatus,
    setStatus,
    resetTestStatus,
    resetProcessStatus,
} = require('./status');

module.exports = {
    start: function (runnerMessageCallback) {
        const { isRunning, isStarting } = getStatus();

        if (isRunning || isStarting) {
            console.log('Cypress process is already running...');
            return;
        }

        let cypressProcess = childProcess.fork(`${__dirname}/cypress`);

        resetTestStatus();

        setStatus({
            cypressPID: cypressProcess.pid,
            isStarting: true,
        });

        cypressProcess.on('message', message => {
            if (typeof runnerMessageCallback === 'function') {
                runnerMessageCallback(message);
            }

            if (message.type === events.CYPRESS_DASHBOARD_RUN_COMPLETED) {
                console.log('runner:passed:', getStatus().passed);
                resetProcessStatus();
            }

            socket.emit(message.type, message.data);
        });
    },
    stop: function () {
        processManager.killCypressProcess();
    },
};
