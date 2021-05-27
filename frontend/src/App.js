import React from 'react';
import { connect } from 'react-redux';
import * as cypressStatus from './reducers/cypressStatus';
import * as connectionStatus from './reducers/connectionStatus';
import * as cypressOptions from './reducers/cypressOptions';
import events from './status-events';
import { getSocket } from './utils';
import StatusBar from './components/StatusBar/StatusBar';
import TabNavigator from './components/UI/TabNavigator';
import Spec from './components/cypress/Spec';
import DirectoryTree from './components/DirectoryTree';
import ComponentPlaceholder from './components/UI/ComponentPlaceholder';
import Modal from './components/UI/Modal';
import styles from './App.module.css';
import CompletedSpecFilterBar from './components/CompletedSpecFilterBar';
import CypressOptions from './components/cypress/CypressOptions';

class App extends React.Component {
    constructor() {
        super();

        this.socket = getSocket();

        this.state = {
            contentHeight: '',
            showSettingsDialog: false,
        };

        this.pageTitle = '%customValues Cypress Control';
        this.socketDisconnectTimer = null;

        this.setPageTitle();

        this.isWindowResizing = false;

        this.reconnectCypressSocket = this.reconnectCypressSocket.bind(this);
        this.windowResizeHandler = this.windowResizeHandler.bind(this);
    }

    componentDidMount() {
        this.setContentHeight();

        if (localStorage.cypressOptions) {
            this.props.updateCypressOptions(
                JSON.parse(localStorage.cypressOptions)
            );
        }

        window.addEventListener('resize', this.windowResizeHandler);

        if (this.socket.disconnected) {
            this.startSocketDisconnectionTimer();
        }

        this.socket.on(events.CYPRESS_CONTROL_STATUS, data => {
            const { eventType, payload, status } = data;

            console.log(events.CYPRESS_CONTROL_STATUS, data);

            this.updateCypressStatus(status);

            switch (eventType) {
                case events.CYPRESS_CONTROL_SUITE_END:
                    if (payload.isRootSuite) {
                        this.updateCypressLog();
                    }
                    break;
                case events.CYPRESS_CONTROL_BEFORE_RUN:
                case events.CYPRESS_CONTROL_RUN_COMPLETED:
                    this.updateCypressLog();
                    break;
                default:
                    return;
            }
        });

        this.socket.on('connect', () => {
            this.props.setServerConnected(true);
            this.props.setSocketConnected(true);

            this.updateCypressLog();

            clearInterval(this.socketDisconnectTimer);
        });

        this.socket.on('disconnect', () => {
            this.props.setServerConnected(false);

            this.startSocketDisconnectionTimer();
        });

        this.updateCypressLog();
    }

    componentWillUnmount() {
        this.socket.removeAllListeners();
        window.removeEventListener('resize', this.windowResizeHandler);
    }

    windowResizeHandler() {
        if (!this.isWindowResizing) {
            this.isWindowResizing = true;

            setTimeout(() => {
                this.setContentHeight();

                this.isWindowResizing = false;
            }, 500);
        }
    }

    setContentHeight() {
        const pageHeader = document.querySelector('.page-header');

        this.setState({
            contentHeight: window.innerHeight - pageHeader.offsetHeight + 'px',
        });
    }

    startSocketDisconnectionTimer() {
        this.props.setSocketConnected(true);

        this.socketDisconnectTimer = setTimeout(() => {
            this.socket.disconnect();
            this.props.setSocketConnected(false);
            console.log('socket disconnected');
        }, 2 * 60 * 1000);
    }

    reconnectCypressSocket() {
        if (this.socket.disconnected) {
            console.log('socket reconnected');
            this.socket.connect();
            this.props.setSocketConnected(true);
            this.startSocketDisconnectionTimer();
        }
    }

    updateCypressStatus(data) {
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
        this.props.updateSpecSelections(directoryTree.state);
    };

    get currentSpecDisplay() {
        if (this.props.cypressStatus.currentSpec.suites) {
            return <Spec spec={this.props.cypressStatus.currentSpec} />;
        }

        // Display waiting message if the Cypress run is either starting
        // or running if the first suite hasn't yet started
        if (
            this.props.cypressStatus.isStarting ||
            this.props.cypressStatus.isRunning
        ) {
            return (
                <ComponentPlaceholder message='Waiting for Cypress run to begin...' />
            );
        }

        return <ComponentPlaceholder message='Runner is not started' />;
    }

    get completedSpecsDisplay() {
        if (this.props.cypressStatus.completedSpecs.length) {
            const completedSpecs =
                this.props.cypressStatus.completedSpecs.filter(spec => {
                    return (
                        (spec.hasFailures && this.props.specFilters.failing) ||
                        (!spec.hasFailures && this.props.specFilters.passing)
                    );
                });

            return completedSpecs.map((spec, index) => (
                <Spec key={index} spec={spec} />
            ));
        }

        if (
            this.props.cypressStatus.isStarting ||
            this.props.cypressStatus.isRunning
        ) {
            return (
                <ComponentPlaceholder message='No specs have completed yet' />
            );
        }

        return <ComponentPlaceholder message='Runner is not started' />;
    }

    get specSelectionTree() {
        return (
            <DirectoryTree
                dataURL='/cypress-spec-directories/'
                rendersCollapsed={false}
                isCaseSensitive={false}
                itemsHaveCheckboxes={true}
                onSelectionChange={this.onCypressFileSelectionChange}
            />
        );
    }

    async updateCypressLog() {
        if (!this.props.connectionStatus.isServerConnected) return;

        const cypressLogFile = await fetch('/cypress-log');
        const cypressLogFileText = await cypressLogFile.text();

        this.setState({
            cypressLog: cypressLogFileText,
        });
    }

    render() {
        return (
            <div className={styles.container} role='application'>
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
                            {
                                label: 'Runner Options',
                                render: () => <CypressOptions />,
                            },
                        ]}
                    />
                </Modal>
                <StatusBar
                    reconnectCypressSocket={this.reconnectCypressSocket}
                    openSettingsDialog={this.openSettingsDialog}
                />

                <div
                    className={styles.content}
                    style={{ height: this.state.contentHeight }}>
                    <CompletedSpecFilterBar />
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
    connectionStatus: state.connectionStatus,
    specFilters: state.specFilters,
    cypressOptions: state.cypressOptions,
});

const mapDispatchToProps = {
    updateCypressStatus: cypressStatus.update,
    setServerConnected: connectionStatus.setServerConnected,
    setSocketConnected: connectionStatus.setSocketConnected,
    updateCypressOptions: cypressOptions.update,
    updateSpecSelections: cypressOptions.updateSpecs,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
