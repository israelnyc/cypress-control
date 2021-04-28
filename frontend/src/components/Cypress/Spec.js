import React from 'react';
import classNames from 'classnames';
import prettyMilliseconds from 'pretty-ms';
import Panel from '../UI/Panel';
import Suite from './Suite';
import styles from './Spec.module.css';

class Spec extends React.Component {
    render() {
        const { spec } = this.props;

        let specHasFailures = false;
        let completedSuites = 0;

        const suites = spec.suites.map((suite, suiteIndex) => {
            const hasFailures = suite.tests.filter(
                test => test.status === 'failed'
            ).length;

            if (hasFailures) specHasFailures = true;

            const isPassing =
                suite.tests.filter(
                    test =>
                        test.status === 'passed' || test.status === 'pending'
                ).length === suite.tests.length;

            const isCompleted =
                suite.tests.filter(test => test.hasCompleted === true)
                    .length === suite.tests.length;

            if (isCompleted) completedSuites++;

            return (
                <Suite
                    key={suiteIndex}
                    suite={suite}
                    hasFailures={hasFailures}
                    isPassing={isPassing}
                />
            );
        });

        return (
            <Panel
                classNames={{
                    panel: classNames({
                        [styles.container]: true,
                        [styles.has_completed]: spec.hasCompleted,
                    }),
                    titleBar: styles.title_bar,
                }}
                rendersCollapsed={spec.hasCompleted}
                title={
                    <div
                        className={classNames({
                            [styles.meta]: true,
                            [styles.passed]:
                                !specHasFailures &&
                                completedSuites === spec.suites.length,
                            [styles.failed]:
                                specHasFailures &&
                                completedSuites === spec.suites.length,
                        })}>
                        <div className={styles.filename}>{spec.file}</div>

                        <div className='suites_count'>
                            Suites: {spec.suites.length}
                        </div>
                        <div className={styles.tests_count}>
                            Tests: {spec.totalTests}
                        </div>

                        {spec?.stats?.duration && (
                            <div>
                                ({prettyMilliseconds(spec.stats.duration)})
                            </div>
                        )}
                    </div>
                }
                content={<div className={styles.suites}>{suites}</div>}
            />
        );
    }
}

export default Spec;
