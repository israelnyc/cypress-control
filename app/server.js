const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');
const directoryTree = require('directory-tree');

const socket = require('./socket');
const { handleSIGINT } = require('./process-manager');

handleSIGINT();

module.exports = () => {
    app.use(express.static(path.join(__dirname, '../frontend/build/')));

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build/', 'index.html'));
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

    http.listen(8686, () => {
        console.log('listening on *:8686');
    });
};
