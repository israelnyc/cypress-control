import React from 'react';
import { connect } from 'react-redux';
import * as cypressStatus from './reducers/cypressStatus';
import events from './status-events';
import { getSocket } from './utils';
import StatusBar from './components/StatusBar';
import TabNavigator from './components/UI/TabNavigator';
import Spec from './components/cypress/Spec';
import DirectoryTree from './components/DirectoryTree';
import ComponentPlaceholder from './components/UI/ComponentPlaceholder';
import Modal from './components/UI/Modal';
import styles from './App.module.css';

class App extends React.Component {
    constructor() {
        super();

        this.socket = getSocket();

        this.state = {
            isConnectedToServer: false,
            isSocketDisconnected: false,
            isSpecSelectionFiltered: false,
            currentTest: {},
            showSettingsDialog: true,
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
            this.updatePageTitlePassedFailedStatus(data);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_FAILED, data => {
            console.log('test failed', data);
            this.updatePageTitlePassedFailedStatus(data);
        });

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_END, data => {
            console.log('test end', data);
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
        this.props.updateCypressStatus(data);

        this.updatePageTitlePassedFailedStatus(data);
    }

    openSettingsDialog = () => {
        this.setState({
            showSettingsDialog: true,
        });
    };

    closeSettingsDialog = e => {
        this.setState({
            showSettingsDialog: false,
        });
    };

    updatePageTitlePassedFailedStatus(data) {
        const passed = data?.passed || 0;
        const failed = data?.failed || 0;

        this.setPageTitle(`(${passed} / ${failed})`);
    }

    setPageTitle(customValues = '') {
        document.title = this.pageTitle.replace('%customValues', customValues);
    }

    onCypressFileSelectionChange = directoryTree => {
        const {
            directoryCount,
            fileCount,
            selectedItems,
        } = directoryTree.state;

        this.setState({
            isSpecSelectionFiltered:
                selectedItems.length &&
                directoryCount + fileCount !== selectedItems.length,
        });
    };

    get currentSpecDisplay() {
        if (this.props.cypressStatus.currentSpec.suites) {
            return <Spec spec={this.props.cypressStatus.currentSpec} />;
        }

        return <ComponentPlaceholder message='No spec currently running' />;
    }

    get completedSpecsDisplay() {
        if (this.props.cypressStatus.completedSpecs.length) {
            return this.props.cypressStatus.completedSpecs.map(
                (spec, index) => <Spec key={index} spec={spec} />
            );
        }

        return <ComponentPlaceholder message='No completed specs yet' />;
    }

    get specSelectionTree() {
        return (
            <DirectoryTree
                dataURL='http://localhost:8686/cypress-spec-directories/'
                rendersCollapsed={false}
                isCaseSensitive={false}
                itemsHaveCheckboxes={true}
                onSelectionChange={this.onCypressFileSelectionChange}
            />
        );
    }

    async updateCypressLog() {
        if (!this.state.isConnectedToServer) return;

        const cypressLogFile = await fetch('http://localhost:8686/cypress-log');
        const cypressLogFileText = await cypressLogFile.text();

        this.setState({
            cypressLog: cypressLogFileText,
        });
    }

    render() {
        return (
            <div role='application'>
                <Modal
                    classNames={{ modal: styles.modal }}
                    isVisible={this.state.showSettingsDialog}
                    closeModal={this.closeSettingsDialog}>
                    <TabNavigator
                        classNames={{
                            container: styles.tab_navigator,
                            tabs_wrapper: styles.settings_tabs_wrapper,
                        }}
                        sections={[
                            {
                                label: 'Spec Selection',
                                render: () => this.specSelectionTree,
                            },
                        ]}
                    />
                </Modal>
                <StatusBar
                    isConnectedToServer={this.state.isConnectedToServer}
                    reconnectCypressSocket={this.reconnectCypressSocket}
                    isSocketDisconnected={this.state.isSocketDisconnected}
                    openSettingsDialog={this.openSettingsDialog}
                    isSpecSelectionFiltered={this.state.isSpecSelectionFiltered}
                />

                <div className={styles.content}>
                    <TabNavigator
                        classNames={{
                            container: styles.tab_navigator,
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
                                badge: this.props.cypressStatus.completedSpecs
                                    .length,
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

const mapStateToProps = state => ({
    cypressStatus: state.cypressStatus,
});

const mapDispatchToProps = {
    updateCypressStatus: cypressStatus.update,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
