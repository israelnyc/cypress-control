const processManager = require('./process-manager');
const { socket } = require('./socket-client');
const { events } = require('./status-events');
const {
    getStatus,
    setStatus,
    resetTestStatus,
    resetProcessStatus,
} = require('./status');
const execa = require('execa');
const fs = require('fs');
const path = require('path');

module.exports = {
    /**
     * @param {object} [options] Cypress runner options
     * @param {function} [runnerMessageCallback] Callback method called when the runner receives messages from the spawned cypress process.
     */
    start: function (options = {}, runnerMessageCallback) {
        const { isRunning, isStarting } = getStatus();

        if (isRunning || isStarting) {
            console.log('Cypress process is already running...');
            return;
        }

        const cypressProcess = execa.node(
            path.join(__dirname, 'cypress'),
            [JSON.stringify(options)],
            {
                detached: true,
                env: process.env,
            }
        );

        cypressProcess.stdout.pipe(process.stdout);
        cypressProcess.stdout.pipe(
            fs.createWriteStream(path.join(__dirname, 'cypress.log'))
        );

        resetTestStatus();

        setStatus({
            cypressPID: cypressProcess.pid,
            isStarting: true,
        });

        cypressProcess.on('message', message => {
            if (typeof runnerMessageCallback === 'function') {
                runnerMessageCallback(message);
            }

            if (message.type === events.CYPRESS_CONTROL_RUN_COMPLETED) {
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
