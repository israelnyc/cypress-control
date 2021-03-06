const runner = require('./runner');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { events } = require('./status-events');
const { handleSIGINT } = require('./process-manager');
const path = require('path');
const {
    getStatus,
    setStatus,
    resetProcessStatus,
    updateCurrentSpecTestStatus,
    broadcastStatus,
} = require('./status');
const fs = require('fs');
const cors = require('cors');
const io = require('socket.io')(http, {
    cors: {
        origin: ['http://localhost:3000'],
    },
});

app.use(express.static(path.join(__dirname, '../frontend/build/')));

app.use(
    cors({
        origin: ['http://localhost:3000'],
    })
);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/', 'index.html'));
});

app.get('/cypress-log', (req, res) => {
    fs.readFile(path.join(__dirname, 'cypress.log'), 'utf8', (err, data) => {
        if (err) throw err;

        res.send(data);
    });
});

io.on('connection', socket => {
    socket.emit(events.CYPRESS_DASHBOARD_STATUS, getStatus());

    socket.on(events.CYPRESS_DASHBOARD_STATUS, (data, callback) => {
        if (callback) callback(getStatus());

        io.emit(events.CYPRESS_DASHBOARD_STATUS, getStatus());
    });

    socket.on(events.CYPRESS_DASHBOARD_GET_STATUS, (data, callback) => {
        if (callback) callback(getStatus());
    });

    socket.on(
        events.CYPRESS_DASHBOARD_RESET_PROCESS_STATUS,
        (data, callback) => {
            setStatus({
                cypressPID: null,
                isStarting: false,
                isRunning: false,
            });

            if (callback) callback();
        }
    );

    socket.on(events.CYPRESS_DASHBOARD_RESET_TEST_STATUS, (data, callback) => {
        setStatus({
            failed: 0,
            passed: 0,
            totalSpecs: 0,
            totalSpecsRan: 0,
            completedSpecs: [],
            currentSpec: {},
        });

        if (callback) callback();
    });

    socket.on(events.CYPRESS_DASHBOARD_BEFORE_RUN, data => {
        setStatus({
            totalSpecs: data.totalSpecs,
        });

        io.emit(events.CYPRESS_DASHBOARD_BEFORE_RUN);
    });

    socket.on(events.CYPRESS_DASHBOARD_RUN_BEGIN, () => {
        setStatus({
            isRunning: true,
            isStarting: false,
        });
        io.emit(events.CYPRESS_DASHBOARD_RUN_BEGIN, getStatus());
    });

    socket.on(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data => {
        if (data.isRootSuite) {
            setStatus({
                currentSpec: data,
                currentSpecFailures: {},
            });
        }
        io.emit(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data);
    });

    socket.on(events.CYPRESS_DASHBOARD_SUITE_END, data => {
        if (data.isRootSuite) {
            const { totalSpecsRan, completedSpecs, currentSpec } = getStatus();

            setStatus({
                totalSpecsRan: totalSpecsRan + 1,
                completedSpecs: [
                    ...completedSpecs,
                    {
                        ...currentSpec,
                        hasCompleted: true,
                    },
                ],
            });
            broadcastStatus();
        }
        io.emit(events.CYPRESS_DASHBOARD_SUITE_END, data);
    });

    socket.on(events.CYPRESS_DASHBOARD_TEST_BEGIN, data => {
        io.emit(events.CYPRESS_DASHBOARD_TEST_BEGIN, data);
    });

    socket.on(events.CYPRESS_DASHBOARD_TEST_PENDING, data => {
        io.emit(events.CYPRESS_DASHBOARD_TEST_PENDING, data);
    });

    socket.on(events.CYPRESS_DASHBOARD_TEST_PASSED, data => {
        setStatus({
            passed: getStatus().passed + 1,
        });

        io.emit(events.CYPRESS_DASHBOARD_TEST_PASSED, {
            ...data,
            ...getStatus(),
        });
    });

    socket.on(events.CYPRESS_DASHBOARD_TEST_FAILED, data => {
        const { currentSpecFailures } = getStatus();

        if (!currentSpecFailures.hasOwnProperty(data.id)) {
            setStatus({
                failed: getStatus().failed + 1,
                currentSpecFailures: {
                    [data.id]: true,
                    ...currentSpecFailures,
                },
            });
        }

        io.emit(events.CYPRESS_DASHBOARD_TEST_FAILED, {
            ...data,
            ...getStatus(),
        });
    });

    socket.on(events.CYPRESS_DASHBOARD_TEST_END, data => {
        updateCurrentSpecTestStatus(data.id, data.status);

        io.emit(events.CYPRESS_DASHBOARD_TEST_END, { ...data, ...getStatus() });
    });

    socket.on(events.CYPRESS_DASHBOARD_RUN_COMPLETED, data => {
        setStatus({
            currentSpec: {},
        });

        io.emit(events.CYPRESS_DASHBOARD_RUN_COMPLETED, {
            ...data,
            ...getStatus(),
        });
    });

    socket.on(events.CYPRESS_DASHBOARD_START_RUNNER, () => {
        console.log('Attempting to start runner...');

        runner.start();

        io.emit(events.CYPRESS_DASHBOARD_START_RUNNER, getStatus());
    });

    socket.on(events.CYPRESS_DASHBOARD_STOP_RUNNER, () => {
        console.log('Stopping runner...');

        setStatus({
            currentSpec: {},
        });

        io.emit(events.CYPRESS_DASHBOARD_STOP_RUNNER, getStatus());

        runner.stop();
    });

    socket.on('disconnect', () => {
        socket.removeAllListeners();
    });
});

handleSIGINT();
resetProcessStatus();

http.listen(8686, () => {
    console.log('listening on *:8686');
});

module.exports.runner = runner;
