# Cypress Control

[![npm version](https://badge.fury.io/js/%40israelnyc%2Fcypress-control.svg)](https://badge.fury.io/js/%40israelnyc%2Fcypress-control)

Cypress Control adds a frontend to Cypress to start and stop Cypress, selectively run a subset of specs and to visualize the run in real-time.

## Install

```bash
npm install @israelnyc/cypress-control
```

Require Cypress Control in a directory with Cypress installed.

```javascript
const cypressControl = require('@israelnyc/cypress-control')();
```

## Runner

The runner can be started via the frontend but is also returned as a result of requiring and starting the server. So it can be started programatically.

```javascript
const cypressControl = require('@israelnyc/cypress-control')({
    port: 5000,
});

cypressControl.runner.start();
```

Along with the runner, the socket client and an object containing Cypress Control event constants are also returned, which allows for listening for the custom runner and reporter status events which the server emits.

```javascript
const cypressControl = require('@israelnyc/cypress-control')({
    port: 5000,
});

const { events, runner, socket } = cypressControl;

socket.on(events.CYPRESS_CONTROL_STATUS, data => {
    if (data.eventType === events.CYPRESS_CONTROL_TEST_END) {
        console.log('test ended');
    }
});

runner.start();
```

## Configuration

| Option | Description                         | Default |
| ------ | ----------------------------------- | ------- |
| `port` | Specify port to start the server on | 8686    |

## Runner Results

View runner results in real-time in the browser via the port the server started on.

The following image shows the completed run results of the default Cypress examples specs. The green filter icon by the runner play button indicates that a subset of tests are selected. In this case, just two specs were selected when Cypress ran.

![Completed Cypress Run](https://raw.githubusercontent.com/israelnyc/cypress-control/master/assets/images/completed_run_passing_failing_specs.png)
