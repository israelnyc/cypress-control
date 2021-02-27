const { getStatusFromServer, resetProcessStatus } = require('./status');

async function killCypressProcess() {
    const status = await getStatusFromServer();

    if ((status.isRunning || status.isStarting) && status.cypressPID) {
        process.kill(status.cypressPID);

        resetProcessStatus();
    }
}

function handleSIGINT() {
    if (process.platform === 'win32') {
        const rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.on('SIGINT', function () {
            process.emit('SIGINT');
        });
    }

    process.on('SIGINT', function () {
        resetProcessStatus();
        process.exit();
    });
}

module.exports = {
    killCypressProcess,
    handleSIGINT,
};
