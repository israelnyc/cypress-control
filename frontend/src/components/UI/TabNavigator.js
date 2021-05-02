import React from 'react';
import classNames from 'classnames';
import styles from './TabNavigator.module.css';

class TabNavigator extends React.Component {
    static defaultProps = {
        classNames: {},
        sections: [],
    };

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: 0,
        };

        this.tabs = React.createRef();
        this.activeTabIndicator = React.createRef();
    }

    updateActiveTabIndicator() {
        const indicator = this.activeTabIndicator.current;
        const currentTab = this.tabs.current.children[this.state.currentIndex];

        indicator.style.width = currentTab.getBoundingClientRect().width + 'px';

        indicator.style.left =
            currentTab.offsetLeft - this.tabs.current.scrollLeft + 'px';
    }

    componentDidUpdate() {
        this.updateActiveTabIndicator();
    }

    componentDidMount() {
        this.updateActiveTabIndicator();
    }

    onTabsScroll() {
        this.updateActiveTabIndicator();
    }

    render() {
        const { sections } = this.props;

        const tabs = sections.map((section, index) => {
            if (!section.hasOwnProperty('isDisplayed') || section.isDisplayed) {
                return (
                    <div
                        key={index}
                        data-index={index}
                        className={classNames({
                            [styles.tab]: true,
                            [styles.active]: index === this.state.currentIndex,
                        })}
                        onClick={() => {
                            this.setState({ currentIndex: index });
                        }}
                        role='tab'>
                        {section.label}

                        {section.badge > 0 && (
                            <span
                                className={classNames(
                                    'badge',
                                    styles.tab_badge
                                )}>
                                {section.badge}
                            </span>
                        )}
                    </div>
                );
            }

            return null;
        });

        const content = sections.map((section, index) => {
            if (!section.hasOwnProperty('isDisplayed') || section.isDisplayed) {
                return (
                    <div
                        key={index}
                        data-index={index}
                        className={classNames({
                            [styles.tab_panel]: true,
                            hidden: index !== this.state.currentIndex,
                        })}
                        role='tabpanel'>
                        {section.render()}
                    </div>
                );
            }
            return null;
        });

        return (
            <div
                className={classNames(
                    styles.container,
                    this.props.classNames.container
                )}>
                <div
                    className={classNames(
                        styles.tabs_wrapper,
                        this.props.classNames.tabs_wrapper
                    )}>
                    <div
                        ref={this.tabs}
                        className={styles.tabs}
                        role='tablist'
                        onScroll={this.onTabsScroll.bind(this)}>
                        {tabs}
                    </div>
                    <div
                        ref={this.activeTabIndicator}
                        className={styles.active_tab_indicator}></div>
                </div>
                <div className={styles.content}>{content}</div>
            </div>
        );
    }
}

export default TabNavigator;
