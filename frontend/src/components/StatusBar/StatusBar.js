import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import prettyMilliseconds from 'pretty-ms';
import {
    faCheck,
    faTimes,
    faPlay,
    faStop,
    faCog,
    faFilter,
    faCircleNotch,
    faClock,
    faClipboardList,
    faTasks,
} from '@fortawesome/free-solid-svg-icons';
import { startCypressRunner, stopCypressRunner } from '../../utils';
import ProgressBar from '../UI/ProgressBar';
import StatusBarSection from './StatusBarSection';
import StatusBarResult from './StatusBarResult';
import Button from '../UI/Button';
import ButtonBar from '../UI/ButtonBar';
import StatusIndicator from './StatusIndicator';
import styles from './StatusBar.module.css';

class StatusBar extends React.Component {
    render() {
        const { cypressStatus, connectionStatus } = this.props;

        const cypressIsRunningOrStarting =
            cypressStatus.isRunning || cypressStatus.isStarting;

        const specsProgress = `${cypressStatus.totalSpecsRan} / ${cypressStatus.totalSpecs}`;

        const totalTests = `${
            cypressStatus.passed + cypressStatus.failed + cypressStatus.pending
        }`;

        const totalDuration = cypressStatus.totalDuration
            ? prettyMilliseconds(cypressStatus.totalDuration)
            : '';

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

        const filterIconTitle = this.props.specSelections.isFiltered
            ? 'Spec selection filter applied'
            : 'No spec selection filter applied';

        return (
            <header>
                <ProgressBar
                    value={cypressStatus.totalSpecsRan}
                    max={cypressStatus.totalSpecs}
                />

                <div className={styles.container}>
                    <StatusBarSection className={styles.test_type_results}>
                        <StatusBarResult
                            className={{
                                icon: styles.fa_check,
                            }}
                            icon={faCheck}
                            title={`${cypressStatus.passed} tests passed`}
                            value={cypressStatus.passed}
                        />
                        <StatusBarResult
                            className={{
                                icon: styles.fa_times,
                            }}
                            icon={faTimes}
                            title={`${cypressStatus.failed} tests failed`}
                            value={cypressStatus.failed}
                        />
                        <StatusBarResult
                            className={{
                                icon: styles.fa_circle_notch,
                            }}
                            icon={faCircleNotch}
                            title={`${cypressStatus.pending} tests pending`}
                            value={cypressStatus.pending}
                        />
                    </StatusBarSection>

                    <StatusBarSection className={styles.test_summary_results}>
                        <StatusBarResult
                            icon={faClipboardList}
                            title={`${totalTests} total tests`}
                            value={totalTests}
                        />
                        <StatusBarResult
                            icon={faTasks}
                            title={`${specsProgress} specs completed`}
                            value={specsProgress}
                        />
                    </StatusBarSection>

                    <StatusBarSection className={styles.run_duration}>
                        <StatusBarResult
                            icon={faClock}
                            title={`Total duration ${totalDuration}`}
                            value={totalDuration}
                        />
                    </StatusBarSection>

                    <StatusBarSection className={styles.status_and_control}>
                        <ButtonBar>
                            <Button
                                title={
                                    cypressIsRunningOrStarting
                                        ? 'Stop test runner'
                                        : 'Start test runner'
                                }
                                className={classNames({
                                    [styles.button]: true,
                                })}
                                onClick={
                                    cypressIsRunningOrStarting
                                        ? stopCypressRunner
                                        : startCypressRunner
                                }
                                icon={
                                    cypressIsRunningOrStarting ? faStop : faPlay
                                }
                            />
                            <Button
                                title='Settings'
                                className={classNames({
                                    [styles.button]: true,
                                })}
                                icon={faCog}
                                onClick={this.props.openSettingsDialog}
                            />
                        </ButtonBar>
                        <StatusIndicator
                            className={classNames({
                                pointer: !connectionStatus.isSocketConnected,
                                [styles.connection_status]: true,
                                [styles.server_connected]:
                                    connectionStatus.isServerConnected,
                                [styles.server_disconnected]:
                                    !connectionStatus.isServerConnected ||
                                    !connectionStatus.isSocketConnected,
                            })}
                            onClick={
                                !connectionStatus.isSocketConnected
                                    ? this.props.reconnectCypressSocket
                                    : () => {}
                            }
                            icon={faCircleNotch}
                            spin={cypressStatus.isRunning}
                            title={serverConnectionTitle.join(' ')}
                        />
                        <StatusIndicator
                            className={classNames({
                                [styles.specs_filter_icon]: true,
                                [styles.filter_applied]: this.props
                                    .specSelections.isFiltered,
                            })}
                            icon={faFilter}
                            title={filterIconTitle}
                        />
                    </StatusBarSection>
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
