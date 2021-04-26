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

## Runner Results

View runner results in real-time in the browser at http://localhost:8686

The following image shows the completed run results of the default Cypress examples specs. The green filter icon by the runner play button indicates that a subset of tests are selected. In this case, just two specs were selected when Cypress ran.

![Completed Cypress Run](https://raw.githubusercontent.com/israelnyc/cypress-control/master/assets/images/completed_run_passing_failing_specs.png)
