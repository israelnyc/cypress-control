const { getStatusFromServer, resetProcessStatus } = require('./status');

async function killCypressProcess() {
    const status = await getStatusFromServer();

    if ((status.isRunning || status.isStarting) && status.cypressPID) {
        // Use negative process id for non-windows so that the entire detached process group
        // is killed; not just the initial cypress.js process but any processes it itself
        // spawned when running cypress.run().
        const cypressPID =
            process.platform === 'win32'
                ? status.cypressPID
                : -status.cypressPID;

        console.log('killing cypress process:', cypressPID);

        try {
            process.kill(cypressPID, 'SIGKILL');
        } catch (e) {
            console.log(
                `Could not kill cypress process with id: ${cypressPID}`
            );
            console.log(e);
        }

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

    process.on('SIGINT', async function () {
        await killCypressProcess();

        process.exit();
    });
}

module.exports = {
    killCypressProcess,
    handleSIGINT,
};
