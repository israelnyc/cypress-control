import React from 'react';
import classNames from 'classnames';
import Test from './Test';
import Panel from '../UI/Panel';
import styles from './Suite.module.css';

class Suite extends React.Component {
    get tests() {
        return this.props.suite.tests.map((test, testIndex) => {
            return <Test key={testIndex} test={test} />;
        });
    }

    get title() {
        let _title = [
            <div key='1' className='title'>
                {this.props.suite.title}
            </div>,
        ];

        if (this.tests.length) {
            _title.push(
                <div
                    key='2'
                    className={classNames(styles.meta, 'badge')}
                    title={`${this.tests.length} tests`}>
                    {this.tests.length}
                </div>
            );
        }

        return _title;
    }

    render() {
        return (
            <Panel
                title={this.title}
                content={this.tests}
                classNames={{
                    panel: classNames(styles.container, {
                        [styles.root]: this.props.suite.isParentRootSuite,
                    }),
                    titleBar: styles.title_bar,
                    title: styles.title,
                }}
            />
        );
    }
}

export default Suite;
