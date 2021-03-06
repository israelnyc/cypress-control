import React from 'react';
import events from './status-events';
import { getSocket } from './utils';
import StatusBar from './components/StatusBar';
import TabNavigator from './components/TabNavigator';
import Spec from './components/Spec';
import ComponentPlaceholder from './components/ComponentPlaceholder';
import CurrentTestContext from './CurrentTestContext';
import styles from './App.module.css';

class App extends React.Component {
    constructor() {
        super();

        this.socket = getSocket();

        this.state = {
            passedCount: 0,
            failedCount: 0,
            cypressIsStarting: false,
            cypressIsRunning: false,
            isConnectedToServer: false,
            isSocketDisconnected: false,
            currentSpec: {
                file: 'cypress/integration/test.js',
                totalTests: 8,
                suites: [
                    {
                        id: 'r1',
                        title: 'Suite One',
                        isParentRootSuite: true,
                        tests: [
                            {
                                id: 'r2',
                                title: 'test one',
                                status: 'passed',
                                hasCompleted: true,
                            },
                            {
                                id: 'r3',
                                title: 'test two',
                                status: 'failed',
                                hasCompleted: true,
                            },
                            {
                                id: 'r4',
                                title: 'test three',
                                status: 'passed',
                                hasCompleted: true,
                            },
                            {
                                id: 'r5',
                                title: 'test four',
                                status: 'passed',
                                hasCompleted: true,
                            },
                        ],
                    },
                    {
                        id: 'r6',
                        title: 'Suite two',
                        tests: [
                            {
                                id: 'r7',
                                title: 'test one',
                                status: 'passed',
                                hasCompleted: true,
                            },
                            {
                                id: 'r8',
                                title: 'test two',
                                status: 'failed',
                                hasCompleted: true,
                            },
                            {
                                id: 'r9',
                                title: 'test three',
                                status: 'failed',
                                hasCompleted: true,
                            },
                            {
                                id: 'r10',
                                title: 'test four',
                                status: 'failed',
                                hasCompleted: true,
                            },
                        ],
                    },
                ],
            },
            currentTest: {},
            completedSpecs: [
                {
                    file: 'cypress/integration/test.js',
                    totalTests: 8,
                    hasCompleted: true,
                    suites: [
                        {
                            id: 'r1',
                            title: 'Suite One',
                            isParentRootSuite: true,
                            tests: [
                                {
                                    id: 'r2',
                                    title: 'test one',
                                    status: 'passed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r3',
                                    title: 'test two',
                                    status: 'failed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r4',
                                    title: 'test three',
                                    status: 'passed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r5',
                                    title: 'test four',
                                    status: 'passed',
                                    hasCompleted: true,
                                },
                            ],
                        },
                        {
                            id: 'r6',
                            title: 'Suite two',
                            tests: [
                                {
                                    id: 'r7',
                                    title: 'test one',
                                    status: 'passed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r8',
                                    title: 'test two',
                                    status: 'failed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r9',
                                    title: 'test three',
                                    status: 'failed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r10',
                                    title: 'test four',
                                    status: 'failed',
                                    hasCompleted: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    file: 'cypress/integration/test.js',
                    totalTests: 8,
                    hasCompleted: true,
                    suites: [
                        {
                            id: 'r1',
                            title: 'Suite One',
                            isParentRootSuite: true,
                            tests: [
                                {
                                    id: 'r2',
                                    title: 'test one',
                                    status: 'passed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r3',
                                    title: 'test two',
                                    status: 'failed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r4',
                                    title: 'test three',
                                    status: 'passed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r5',
                                    title: 'test four',
                                    status: 'passed',
                                    hasCompleted: true,
                                },
                            ],
                        },
                        {
                            id: 'r6',
                            title: 'Suite two',
                            tests: [
                                {
                                    id: 'r7',
                                    title: 'test one',
                                    status: 'passed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r8',
                                    title: 'test two',
                                    status: 'failed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r9',
                                    title: 'test three',
                                    status: 'failed',
                                    hasCompleted: true,
                                },
                                {
                                    id: 'r10',
                                    title: 'test four',
                                    status: 'failed',
                                    hasCompleted: true,
                                },
                            ],
                        },
                    ],
                },
            ],
            totalSpecs: 0,
            totalSpecsRan: 0,
        };

        this.pageTitle = '%customValues Cypress Dashboard';
        this.socketDisconnectTimer = null;

        this.setPageTitle();

        this.reconnectCypressSocket = this.reconnectCypressSocket.bind(this);
    }

    componentDidMount() {
        if (this.socket.disconnected) {
            this.startSocketDisconnectionTimer();
        }

        this.socket.on(events.CYPRESS_DASHBOARD_STATUS, status => {
            console.log('receiving status update from server', status);
            this.updateTestStats(status);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_BEFORE_RUN, () => {
            console.log('before run');
        });

        this.socket.on(events.CYPRESS_DASHBOARD_RUN_BEGIN, data => {
            console.log('cypress run begin...', data);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data => {
            console.log('suite begin: ', data);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_SUITE_END, data => {
            console.log('suite end: ', data);
            if (data.isRootSuite) {
                this.updateCypressLog();
            }
        });

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_BEGIN, data => {
            console.log('test begin: ', data);
            this.setState({ currentTest: data });
        });

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_PENDING, data => {
            console.log('test pending: ', data);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_START_RUNNER, () => {
            console.log('Runner started...');
            this.updatePageTitlePassedFailedStatus();
        });

        this.socket.on(events.CYPRESS_DASHBOARD_STOP_RUNNER, () => {
            console.log('Runner stopped...');
        });

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_PASSED, data => {
            console.log('test passed', data);
            this.setState({ passedCount: data.passed });
            this.updatePageTitlePassedFailedStatus(data);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_FAILED, data => {
            console.log('test failed', data);
            this.setState({ failedCount: data.failed });
            this.updatePageTitlePassedFailedStatus(data);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_END, data => {
            console.log('test end', data);

            this.updateTestStats(data);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_RUN_COMPLETED, data => {
            console.log('Run completed', data);
            this.updateCypressLog();
        });

        this.socket.on('connect', () => {
            this.setState({
                isConnectedToServer: true,
                isSocketDisconnected: false,
            });
            console.log('resetting disconnectTimer');
            clearInterval(this.socketDisconnectTimer);
        });

        this.socket.on('disconnect', () => {
            this.setState({
                passedCount: 0,
                failedCount: 0,
                cypressIsStarting: false,
                cypressIsRunning: false,
                isConnectedToServer: false,
            });

            this.startSocketDisconnectionTimer();
        });

        this.updateCypressLog();
    }

    componentWillUnmount() {
        this.socket.removeAllListeners();
    }

    startSocketDisconnectionTimer() {
        this.socketDisconnectTimer = setTimeout(() => {
            this.socket.disconnect();
            this.setState({ isSocketDisconnected: true });
            console.log('socket disconnected');
        }, 2 * 60 * 1000);
    }

    reconnectCypressSocket() {
        if (this.socket.disconnected) {
            console.log('socket reconnected');
            this.socket.connect();
            this.setState({ isSocketDisconnected: false });
            this.startSocketDisconnectionTimer();
        }
    }

    updateTestStats(data) {
        const {
            passed,
            failed,
            isRunning,
            isStarting,
            totalSpecs,
            totalSpecsRan,
            currentSpec,
            completedSpecs,
        } = data;

        this.setState({
            passedCount: passed,
            failedCount: failed,
            cypressIsRunning: isRunning,
            cypressIsStarting: isStarting,
            totalSpecs,
            totalSpecsRan,
            currentSpec,
            completedSpecs,
        });

        this.updatePageTitlePassedFailedStatus(data);
    }

    updatePageTitlePassedFailedStatus(data) {
        const passed = data?.passed || 0;
        const failed = data?.failed || 0;

        this.setPageTitle(`(${passed} / ${failed})`);
    }

    setPageTitle(customValues = '') {
        document.title = this.pageTitle.replace('%customValues', customValues);
    }

    get currentSpecDisplay() {
        if (this.state.currentSpec.suites) {
            return (
                <CurrentTestContext.Provider value={this.state.currentTest}>
                    <Spec spec={this.state.currentSpec} />
                </CurrentTestContext.Provider>
            );
        }

        return <ComponentPlaceholder message='No spec currently running' />;
    }

    get completedSpecsDisplay() {
        if (this.state.completedSpecs.length) {
            return this.state.completedSpecs.map((spec, index) => (
                <Spec key={index} spec={spec} />
            ));
        }

        return <ComponentPlaceholder message='No completed specs yet' />;
    }

    async updateCypressLog() {
        const cypressLogFile = await fetch('http://localhost:8686/cypress-log');
        const cypressLogFileText = await cypressLogFile.text();

        this.setState({
            cypressLog: cypressLogFileText,
        });
    }

    render() {
        return (
            <div role='application'>
                <StatusBar
                    testsPassed={this.state.passedCount}
                    testsFailed={this.state.failedCount}
                    totalSpecsRan={this.state.totalSpecsRan}
                    totalSpecs={this.state.totalSpecs}
                    cypressIsStarting={this.state.cypressIsStarting}
                    cypressIsRunning={this.state.cypressIsRunning}
                    isConnectedToServer={this.state.isConnectedToServer}
                    reconnectCypressSocket={this.reconnectCypressSocket}
                    isSocketDisconnected={this.state.isSocketDisconnected}
                />

                <div className={styles.content}>
                    <TabNavigator
                        classNames={{
                            container: styles.results_navigator,
                        }}
                        sections={[
                            {
                                label: 'Current Spec',
                                render: () => {
                                    return <>{this.currentSpecDisplay}</>;
                                },
                            },
                            {
                                label: 'Completed Specs',
                                badge: this.state.completedSpecs.length,
                                render: () => {
                                    return <>{this.completedSpecsDisplay}</>;
                                },
                            },
                            {
                                label: 'Cypress Output',
                                render: () => {
                                    return <pre>{this.state.cypressLog}</pre>;
                                },
                            },
                        ]}
                    />
                </div>
            </div>
        );
    }
}

export default App;
