import React from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faTimes,
    faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import prettyMilliseconds from 'pretty-ms';
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
        const statusIconsMap = {
            passed: faCheck,
            failed: faTimes,
            pending: faCircleNotch,
        };

        const statusIcon = statusIconsMap[this.props.test.status];

        const isPending = this.props.test.status === 'pending';

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
                    {this.props.test.status && statusIcon && (
                        <FontAwesomeIcon
                            title={this.props.test.status}
                            icon={statusIcon}
                        />
                    )}
                </div>
                <div className={styles.title}>{this.props.test.title}</div>

                {this.props.test.duration && (
                    <div className={styles.duration}>
                        {prettyMilliseconds(this.props.test.duration)}
                    </div>
                )}

                {isPending && <div className={styles.duration}>pending</div>}
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
                    const errorMessage = this.props.test?.error
                        ?.sourceMappedStack;
                    const codeFrame = this.props.test?.error?.codeFrame?.frame;

                    return (
                        <div className={styles.error_container}>
                            <pre>{errorMessage}</pre>
                            <pre>{codeFrame}</pre>
                        </div>
                    );
                },
            },
        ];

        const onToggled = panel => {
            if (this.tabNavigator.current && !panel.state.isCollapsed) {
                this.tabNavigator.current.updateActiveTabIndicator();
            }
        };

        return (
            <Panel
                hideToggleIcon={true}
                isCollapsible={!isPending}
                rendersCollapsed={true}
                onToggled={onToggled}
                title={title}
                content={
                    !isPending && (
                        <TabNavigator
                            ref={this.tabNavigator}
                            sections={sections}
                        />
                    )
                }
                classNames={{
                    titleBar: styles.title_bar,
                    title: classNames({
                        [styles.title]: true,
                        [styles.current]:
                            this.props.cypressStatus.currentTest.uuid ===
                                this.props.test.uuid &&
                            this.props.cypressStatus.isRunning &&
                            !this.props.test.hasCompleted,
                    }),
                    content: styles.content,
                    panel: styles.container,
                }}
            />
        );
    }
}

const mapStateToProps = state => ({
    cypressStatus: state.cypressStatus,
});

export default connect(mapStateToProps)(Test);
