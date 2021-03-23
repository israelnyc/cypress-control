const runner = require('./runner');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const { events } = require('./status-events');
const { handleSIGINT } = require('./process-manager');
const path = require('path');
const directoryTree = require('directory-tree');
const {
    getStatus,
    setStatus,
    resetProcessStatus,
    updateCurrentSpecTestStatus,
    broadcastStatus,
} = require('./status');
const fs = require('fs');
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '../frontend/build/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/', 'index.html'));
});

app.get('/cypress-log', (req, res) => {
    fs.readFile(path.join(__dirname, 'cypress.log'), 'utf8', (err, data) => {
        if (err) throw err;

        res.send(data);
    });
});

app.get('/cypress-spec-directories', (req, res) => {
    const {
        componentFolder = '',
        integrationFolder = path.join('cypress', 'integration'),
    } = require(path.join(process.cwd(), 'cypress.json'));

    const combinedTrees = [];

    if (componentFolder) {
        combinedTrees.push(directoryTree(componentFolder));
    }

    combinedTrees.push(directoryTree(integrationFolder));

    res.send(combinedTrees);
});

io.on('connection', socket => {
    socket.emit(events.CYPRESS_CONTROL_STATUS, getStatus());

    socket.on(events.CYPRESS_CONTROL_STATUS, (data, callback) => {
        if (callback) callback(getStatus());

        io.emit(events.CYPRESS_CONTROL_STATUS, {
            status: getStatus(),
            eventType: data.eventType,
            payload: data.payload,
        });
    });

    socket.on(events.CYPRESS_CONTROL_GET_STATUS, (data, callback) => {
        if (callback) callback(getStatus());
    });

    socket.on(events.CYPRESS_CONTROL_RESET_PROCESS_STATUS, (data, callback) => {
        setStatus(
            {
                cypressPID: null,
                isStarting: false,
                isRunning: false,
            },
            events.CYPRESS_CONTROL_RESET_PROCESS_STATUS
        );

        if (callback) callback();
    });

    socket.on(events.CYPRESS_CONTROL_RESET_TEST_STATUS, (data, callback) => {
        setStatus(
            {
                failed: 0,
                passed: 0,
                totalSpecs: 0,
                totalSpecsRan: 0,
                completedSpecs: [],
                currentSpec: {},
            },
            events.CYPRESS_CONTROL_RESET_TEST_STATUS
        );

        if (callback) callback();
    });

    socket.on(events.CYPRESS_CONTROL_BEFORE_RUN, data => {
        setStatus(
            {
                totalSpecs: data.totalSpecs,
            },
            events.CYPRESS_CONTROL_BEFORE_RUN,
            data
        );
    });

    socket.on(events.CYPRESS_CONTROL_RUN_BEGIN, () => {
        setStatus(
            {
                isRunning: true,
                isStarting: false,
            },
            events.CYPRESS_CONTROL_RUN_BEGIN
        );
    });

    socket.on(events.CYPRESS_CONTROL_SUITE_BEGIN, data => {
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
    });

    socket.on(events.CYPRESS_CONTROL_SUITE_END, data => {
        if (data.isRootSuite) {
            const { totalSpecsRan, completedSpecs, currentSpec } = getStatus();

            setStatus(
                {
                    totalSpecsRan: totalSpecsRan + 1,
                    completedSpecs: [
                        ...completedSpecs,
                        {
                            ...currentSpec,
                            hasCompleted: true,
                        },
                    ],
                },
                events.CYPRESS_CONTROL_SUITE_END,
                data
            );
        }
    });

    socket.on(events.CYPRESS_CONTROL_TEST_BEGIN, data => {
        setStatus(
            {
                currentTest: data,
            },
            events.CYPRESS_CONTROL_TEST_BEGIN,
            data
        );
    });

    socket.on(events.CYPRESS_CONTROL_TEST_PENDING, data => {
        broadcastStatus(events.CYPRESS_CONTROL_TEST_PENDING, data);
    });

    socket.on(events.CYPRESS_CONTROL_TEST_PASSED, data => {
        const { passed } = getStatus();

        setStatus(
            {
                passed: passed + 1,
            },
            events.CYPRESS_CONTROL_TEST_PASSED,
            data
        );
    });

    socket.on(events.CYPRESS_CONTROL_TEST_FAILED, data => {
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
    });

    socket.on(events.CYPRESS_CONTROL_TEST_END, data => {
        updateCurrentSpecTestStatus(
            data.id,
            data.status,
            events.CYPRESS_CONTROL_TEST_END
        );
    });

    socket.on(events.CYPRESS_CONTROL_RUN_COMPLETED, data => {
        setStatus(
            {
                currentSpec: {},
            },
            events.CYPRESS_CONTROL_RUN_COMPLETED,
            data
        );
    });

    socket.on(events.CYPRESS_CONTROL_START_RUNNER, specSelections => {
        console.log('Attempting to start runner...');

        runner.start(
            specSelections.isFiltered ? specSelections.selectedSpecs : []
        );

        broadcastStatus(events.CYPRESS_CONTROL_START_RUNNER);
    });

    socket.on(events.CYPRESS_CONTROL_STOP_RUNNER, () => {
        console.log('Stopping runner...');

        setStatus(
            {
                currentSpec: {},
            },
            events.CYPRESS_CONTROL_STOP_RUNNER
        );

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
