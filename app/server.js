const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const directoryTree = require('directory-tree');

const DEFAULT_PORT = 8686;

module.exports = ({ port = DEFAULT_PORT } = {}) => {
    process.env['CYPRESS_CONTROL_PORT'] = port;

    const socket = require('./socket');
    const { handleSIGINT } = require('./process-manager');
    const runner = require('./runner');
    const { events } = require('./status-events');
    const { socket: socketClient } = require('./socket-client');

    app.use(express.static(path.join(__dirname, '../client/')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/', 'index.html'));
    });

    app.get('/cypress-log', (req, res) => {
        fs.readFile(
            path.join(__dirname, 'cypress.log'),
            'utf8',
            (err, data) => {
                if (err) throw err;

                res.send(data);
            }
        );
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

    socket.init(io);

    if (!fs.existsSync(path.join(__dirname, 'cypress.log'))) {
        fs.writeFileSync(path.join(__dirname, 'cypress.log'), '');
    }

    http.listen(port, () => {
        console.log(`listening on *:${port}`);
    });

    handleSIGINT();

    return { events, runner, socket: socketClient };
};
