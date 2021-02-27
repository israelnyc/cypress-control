import React from 'react';
import Suite from './Suite';
import styles from './Spec.module.css';

class Spec extends React.Component {
    render() {
        const suites = this.props.rootSuite.suites.map((suite, suiteIndex) => {
            return <Suite key={suiteIndex} suite={suite} />;
        });

        return (
            <div className={styles.container}>
                <div className={styles.meta}>
                    <div className='suites_count'>
                        Suites: {this.props.rootSuite.suites.length}
                    </div>
                    <div className={styles.tests_count}>
                        Tests: {this.props.rootSuite.totalTests}
                    </div>
                    <div className='filename'>{this.props.rootSuite.file}</div>
                </div>

                <div className='suites'>{suites}</div>
            </div>
        );
    }
}

export default Spec;
