import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Panel from '../UI/Panel';
import TabNavigator from '../UI/TabNavigator';
import CodeBlock from '../UI/CodeBlock';
import styles from './Test.module.css';

class Test extends React.Component {
    constructor(props) {
        super(props);

        this.tabNavigator = React.createRef();
    }

    render() {
        const title = (
            <>
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
            </>
        );

        const sections = [
            {
                label: 'Body',
                render: () => <CodeBlock>{this.props.test.body}</CodeBlock>,
            },
            {
                label: 'Error',
                isDisplayed: this.props.test?.error,
                render: () => {
                    const errorMessage = this.props.test?.error?.message;
                    const codeFrame = this.props.test?.error?.codeFrame?.frame;

                    return (
                        <>
                            <pre>{errorMessage}</pre>
                            <pre>{codeFrame}</pre>
                        </>
                    );
                },
            },
        ];

        const onToggled = panel => {
            if (!panel.state.isCollapsed) {
                this.tabNavigator.current.updateActiveTabIndicator();
            }
        };

        return (
            <Panel
                hideToggleIcon={true}
                rendersCollapsed={true}
                onToggled={onToggled}
                title={title}
                content={
                    <TabNavigator ref={this.tabNavigator} sections={sections} />
                }
                classNames={{
                    titleBar: styles.title_bar,
                    title: classNames({
                        [styles.container]: true,
                        [styles.current]:
                            this.props.cypressStatus.currentTest.uuid ===
                            this.props.test.uuid,
                    }),
                    content: styles.content,
                }}
            />
        );
    }
}

const mapStateToProps = state => ({
    cypressStatus: state.cypressStatus,
});

export default connect(mapStateToProps)(Test);
