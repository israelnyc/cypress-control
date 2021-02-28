import React from 'react';
import classNames from 'classnames';
import Suite from './Suite';
import styles from './Spec.module.css';

class Spec extends React.Component {
    render() {
        const { spec } = this.props;

        const suites = spec.suites.map((suite, suiteIndex) => {
            return <Suite key={suiteIndex} suite={suite} />;
        });

        return (
            <div
                className={classNames({
                    [styles.container]: true,
                    [styles.has_completed]: spec.hasCompleted,
                })}>
                <div className={styles.meta}>
                    <div className='suites_count'>
                        Suites: {spec.suites.length}
                    </div>
                    <div className={styles.tests_count}>
                        Tests: {spec.totalTests}
                    </div>
                    <div className='filename'>{spec.file}</div>
                </div>

                <div className={styles.suites}>{suites}</div>
            </div>
        );
    }
}

export default Spec;
