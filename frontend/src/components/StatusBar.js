import React from 'react';
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
} from '@fortawesome/free-solid-svg-icons';
import { startCypressRunner, stopCypressRunner } from '../utils';
import ProgressBar from './UI/ProgressBar';
import styles from './StatusBar.module.css';

class StatusBar extends React.Component {
    render() {
        const cypressIsRunningOrStarting =
            this.props.cypressIsRunning || this.props.cypressIsStarting;
        const specsProgress = `Specs: ${this.props.totalSpecsRan} / ${this.props.totalSpecs}`;

        const totalTests = `Tests: ${
            this.props.testsFailed + this.props.testsPassed
        }`;

        const serverConnectionTitle = [];

        this.props.isConnectedToServer
            ? serverConnectionTitle.push('Connected to server.')
            : serverConnectionTitle.push('Disconnected from server.');

        if (!this.props.isConnectedToServer && this.props.isSocketDisconnected)
            serverConnectionTitle.push(
                'Socket has also been disconnected, click to reconnect socket.'
            );

        if (!this.props.isConnectedToServer && !this.props.isSocketDisconnected)
            serverConnectionTitle.push('Waiting for server to be restarted.');

        return (
            <header>
                <ProgressBar
                    value={this.props.totalSpecsRan}
                    max={this.props.totalSpecs}
                />

                <div className={styles.container}>
                    <div className={styles.results}>
                        <div
                            className={classNames(
                                'tests_passed',
                                styles.result
                            )}>
                            <FontAwesomeIcon
                                className={styles.fa_check}
                                icon={faCheck}
                            />
                            <div className='value'>
                                {this.props.testsPassed}
                            </div>
                        </div>

                        <div
                            className={classNames(
                                'tests-failed',
                                styles.result
                            )}>
                            <FontAwesomeIcon
                                className={styles.fa_times}
                                icon={faTimes}
                            />
                            <div className='value'>
                                {this.props.testsFailed}
                            </div>
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
                                    hidden: !this.props.isSpecSelectionFiltered,
                                })}>
                                <FontAwesomeIcon icon={faFilter} />
                            </div>
                        </div>

                        <div className={styles.control_icon}>
                            <div
                                className={classNames({
                                    [styles.runner_status]: true,
                                    [styles.running]: this.props
                                        .cypressIsRunning,
                                    [styles.stopped]:
                                        !this.props.cypressIsRunning &&
                                        !this.props.cypressIsStarting,
                                    [styles.starting]: this.props
                                        .cypressIsStarting,
                                })}></div>
                        </div>
                        <div
                            title={serverConnectionTitle.join(' ')}
                            className={classNames({
                                [styles.control_icon]: true,
                                [styles.server_connected]: this.props
                                    .isConnectedToServer,
                                [styles.server_disconnected]: !this.props
                                    .isConnectedToServer,
                                pointer: this.props.isSocketDisconnected,
                            })}
                            {...(this.props.isSocketDisconnected && {
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

export default StatusBar;
