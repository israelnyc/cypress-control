import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import styles from './Test.module.css';

class Test extends React.Component {
    render() {
        return (
            <div
                className={classNames(styles.container, {
                    [styles.current]:
                        this.props.cypressStatus.currentTest.uuid ===
                        this.props.test.uuid,
                })}>
                <div
                    className={classNames(
                        styles.status,
                        styles[this.props.test.status],
                        {
                            invisible: !this.props.test.hasCompleted,
                        }
                    )}>
                    <FontAwesomeIcon
                        icon={
                            this.props.test.status === 'passed'
                                ? faCheck
                                : faTimes
                        }
                    />
                </div>
                <div className='title'>{this.props.test.title}</div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    cypressStatus: state.cypressStatus,
});

export default connect(mapStateToProps)(Test);
