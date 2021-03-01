import React from 'react';
import classNames from 'classnames';
import Panel from './Panel';
import Suite from './Suite';
import styles from './Spec.module.css';

class Spec extends React.Component {
    render() {
        const { spec } = this.props;

        const suites = spec.suites.map((suite, suiteIndex) => {
            return <Suite key={suiteIndex} suite={suite} />;
        });

        return (
            <Panel
                classNames={{
                    panel: classNames({
                        [styles.container]: true,
                        [styles.has_completed]: spec.hasCompleted,
                    }),
                }}
                rendersCollapsed={spec.hasCompleted}
                title={
                    <div className={styles.meta}>
                        <div className={styles.filename}>{spec.file}</div>
                        <div className='suites_count'>
                            Suites: {spec.suites.length}
                        </div>
                        <div className={styles.tests_count}>
                            Tests: {spec.totalTests}
                        </div>
                    </div>
                }
                content={<div className={styles.suites}>{suites}</div>}
            />
        );
    }
}

export default Spec;
