import React from 'react';
import classNames from 'classnames';
import styles from './TabNavigator.module.css';

class TabNavigator extends React.Component {
    static defaultProps = {
        sections: [],
    };

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: 0,
        };

        this.tabs = React.createRef();
        this.activeTabIndicator = React.createRef();

        this.onClickHandler = this.onClickHandler.bind(this);
    }

    onClickHandler(e) {
        this.setState({
            currentIndex: e.target.dataset.index * 1,
        });
    }

    updateActiveTabIndicator() {
        const indicator = this.activeTabIndicator.current;
        const currentTab = this.tabs.current.children[this.state.currentIndex];

        indicator.style.width = currentTab.getBoundingClientRect().width + 'px';

        indicator.style.left = currentTab.offsetLeft + 'px';
    }

    componentDidUpdate() {
        this.updateActiveTabIndicator();
    }

    componentDidMount() {
        this.updateActiveTabIndicator();
    }

    render() {
        const { sections } = this.props;

        const tabs = sections.map((section, index) => {
            return (
                <div
                    key={index}
                    data-index={index}
                    className={classNames({
                        [styles.tab]: true,
                        [styles.active]: index === this.state.currentIndex,
                    })}
                    onClick={this.onClickHandler}
                    role='tab'>
                    {section.label}
                </div>
            );
        });

        const content = sections.map((section, index) => {
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
        });

        return (
            <div
                className={classNames(
                    styles.container,
                    this.props.classNames.container || ''
                )}>
                <div className={styles.tabs_wrapper}>
                    <div ref={this.tabs} className={styles.tabs} role='tablist'>
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
