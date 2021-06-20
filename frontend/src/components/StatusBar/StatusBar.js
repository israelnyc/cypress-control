import React from 'react';
import { connect } from 'react-redux';
import prettyMilliseconds from 'pretty-ms';
import {
    faCheck,
    faTimes,
    faCog,
    faCircleNotch,
    faClock,
    faClipboardList,
    faTasks,
} from '@fortawesome/free-solid-svg-icons';
import ProgressBar from '../UI/ProgressBar';
import StatusBarSection from './StatusBarSection';
import StatusBarResult from './StatusBarResult';
import Button from '../UI/Button';
import ButtonBar from '../UI/ButtonBar';
import styles from './StatusBar.module.css';
import RunnerStatusIndicator from '../StatusIndicators/RunnerStatusIndicator';
import RunnerControlButton from '../Buttons/RunnerControlButton';
import FilterStatusIndicator from '../StatusIndicators/FilterStatusIndicator';

class StatusBar extends React.Component {
    render() {
        const { cypressStatus } = this.props;

        const specsProgress = `${cypressStatus.totalSpecsRan} / ${cypressStatus.totalSpecs}`;

        const totalTests = `${
            cypressStatus.passed + cypressStatus.failed + cypressStatus.pending
        }`;

        const totalDuration = cypressStatus.totalDuration
            ? prettyMilliseconds(cypressStatus.totalDuration)
            : '';

        return (
            <header className='page-header'>
                <ProgressBar
                    value={cypressStatus.totalSpecsRan}
                    max={cypressStatus.totalSpecs}
                />

                <div className={styles.container}>
                    <StatusBarSection className={styles.title}>
                        <div>Cypress Control</div>
                    </StatusBarSection>
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
                            className={{
                                icon: styles.default_result_icon,
                            }}
                            icon={faClipboardList}
                            title={`${totalTests} total tests`}
                            value={totalTests}
                        />
                        <StatusBarResult
                            className={{
                                icon: styles.default_result_icon,
                            }}
                            icon={faTasks}
                            title={`${specsProgress} specs completed`}
                            value={specsProgress}
                        />
                        {totalDuration && (
                            <StatusBarResult
                                className={{
                                    icon: styles.default_result_icon,
                                }}
                                icon={faClock}
                                title={`Total duration ${totalDuration}`}
                                value={totalDuration}
                            />
                        )}
                    </StatusBarSection>

                    <StatusBarSection className={styles.status_and_control}>
                        <ButtonBar>
                            <RunnerControlButton />
                            <Button
                                title='Settings'
                                icon={faCog}
                                onClick={this.props.openSettingsDialog}
                            />
                        </ButtonBar>
                        <RunnerStatusIndicator />
                        <FilterStatusIndicator />
                    </StatusBarSection>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => ({
    cypressStatus: state.cypressStatus,
});

export default connect(mapStateToProps)(StatusBar);
