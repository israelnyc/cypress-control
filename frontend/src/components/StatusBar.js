import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faTimes,
    faPlay,
    faStop,
    faWifi,
    faCog,
    faFilter,
    faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import { startCypressRunner, stopCypressRunner } from '../utils';
import ProgressBar from './UI/ProgressBar';
import styles from './StatusBar.module.css';

class StatusBar extends React.Component {
    render() {
        const { cypressStatus, connectionStatus } = this.props;

        const cypressIsRunningOrStarting =
            cypressStatus.isRunning || cypressStatus.isStarting;

        const specsProgress = `Specs: ${cypressStatus.totalSpecsRan} / ${cypressStatus.totalSpecs}`;

        const totalTests = `Tests: ${
            cypressStatus.passed + cypressStatus.failed + cypressStatus.pending
        }`;

        const serverConnectionTitle = [];

        connectionStatus.isServerConnected
            ? serverConnectionTitle.push('Connected to server.')
            : serverConnectionTitle.push('Disconnected from server.');

        if (
            !connectionStatus.isServerConnected &&
            !connectionStatus.isSocketConnected
        ) {
            serverConnectionTitle.push(
                'Socket has also been disconnected, click to reconnect socket.'
            );
        }

        if (
            !connectionStatus.isServerConnected &&
            connectionStatus.isSocketConnected
        ) {
            serverConnectionTitle.push('Waiting for server to be restarted.');
        }

        return (
            <header>
                <ProgressBar
                    value={cypressStatus.totalSpecsRan}
                    max={cypressStatus.totalSpecs}
                />

                <div className={styles.container}>
                    <div className={styles.results}>
                        <div className={classNames(styles.result)}>
                            <FontAwesomeIcon
                                className={styles.fa_check}
                                icon={faCheck}
                            />
                            <div className='value'>{cypressStatus.passed}</div>
                        </div>

                        <div className={classNames(styles.result)}>
                            <FontAwesomeIcon
                                className={styles.fa_times}
                                icon={faTimes}
                            />
                            <div className='value'>{cypressStatus.failed}</div>
                        </div>

                        <div className={classNames(styles.result)}>
                            <FontAwesomeIcon
                                className={styles.fa_circle_notch}
                                icon={faCircleNotch}
                            />
                            <div className='value'>{cypressStatus.pending}</div>
                        </div>

                        <div
                            className={classNames(
                                'total_tests',
                                styles.result
                            )}>
                            <div className='value'>{totalTests}</div>
                        </div>

                        <div
                            className={classNames(
                                'specs_progress',
                                styles.result
                            )}>
                            {specsProgress}
                        </div>
                    </div>

                    <div className={styles.control}>
                        <div
                            title={
                                cypressIsRunningOrStarting
                                    ? 'Stop test runner'
                                    : 'Start test runner'
                            }
                            className={classNames({
                                pointer: true,
                                [styles.control_icon]: true,
                                [styles.start_stop_button]: true,
                            })}
                            onClick={
                                cypressIsRunningOrStarting
                                    ? stopCypressRunner
                                    : startCypressRunner
                            }>
                            <FontAwesomeIcon
                                icon={
                                    cypressIsRunningOrStarting ? faStop : faPlay
                                }
                            />
                            <div
                                title='Only selected specs will run'
                                className={classNames({
                                    [styles.filtered_specs_icon]: true,
                                    [styles.control_icon]: true,
                                    hidden: !this.props.specSelections
                                        .isFiltered,
                                })}>
                                <FontAwesomeIcon icon={faFilter} />
                            </div>
                        </div>

                        <div className={styles.control_icon}>
                            <div
                                className={classNames({
                                    [styles.runner_status]: true,
                                    [styles.running]: cypressStatus.isRunning,
                                    [styles.stopped]:
                                        !cypressStatus.isRunning &&
                                        !cypressStatus.isStarting,
                                    [styles.starting]: cypressStatus.isStarting,
                                })}></div>
                        </div>
                        <div
                            title={serverConnectionTitle.join(' ')}
                            className={classNames({
                                [styles.control_icon]: true,
                                [styles.server_connected]:
                                    connectionStatus.isServerConnected,
                                [styles.server_disconnected]: !connectionStatus.isServerConnected,
                                pointer: !connectionStatus.isSocketConnected,
                            })}
                            {...(!connectionStatus.isSocketConnected && {
                                onClick: this.props.reconnectCypressSocket,
                            })}>
                            <FontAwesomeIcon icon={faWifi} />
                        </div>
                        <div
                            onClick={this.props.openSettingsDialog}
                            className={classNames({
                                [styles.control_icon]: true,
                                pointer: true,
                            })}>
                            <FontAwesomeIcon icon={faCog} />
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    cypressStatus: state.cypressStatus,
    connectionStatus: state.connectionStatus,
    specSelections: state.specSelections,
});

export default connect(mapStateToProps)(StatusBar);
