import React, { Component } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Panel.module.css';

class Panel extends Component {
    static defaultProps = {
        classNames: {},
        isCollapsible: true,
        hideToggleIcon: false,
        rendersCollapsed: false,
        onToggled: () => {},
    };

    constructor(props) {
        super(props);

        this.state = {
            isCollapsed: false,
        };
    }

    componentDidMount() {
        if (this.props.isCollapsible && this.props.rendersCollapsed) {
            this.collapse();
        }
    }

    titleBarClickHandler = e => {
        if (this.props.isCollapsible) {
            this.state.isCollapsed ? this.expand() : this.collapse();
        }
    };

    collapse() {
        this.setState({ isCollapsed: true }, this.onToggled);
    }

    expand() {
        this.setState({ isCollapsed: false }, this.onToggled);
    }

    onToggled() {
        this.props.onToggled(this);
    }

    render() {
        const toggleIcon = (
            <div
                className={classNames({
                    hidden:
                        !this.props.isCollapsible || this.props.hideToggleIcon,
                    [styles.toggle_icon_container]: true,
                    [this.props.classNames.toggleIconContainer]: true,
                })}>
                <FontAwesomeIcon
                    className={styles.toggle_icon}
                    icon={this.state.isCollapsed ? faCaretRight : faCaretDown}
                />
            </div>
        );

        const titleBarValue = (
            <div
                className={classNames(
                    styles.title_bar_content,
                    this.props.classNames.title || ''
                )}>
                {this.props.title}
            </div>
        );

        const titleBar = (
            <div
                onClick={this.titleBarClickHandler}
                className={classNames(
                    styles.title_bar,
                    { [styles.is_collapsible]: this.props.isCollapsible },
                    this.props.classNames.titleBar || ''
                )}>
                {toggleIcon}
                {titleBarValue}
            </div>
        );

        const content = (
            <div
                style={{
                    height: this.state.isCollapsed ? '0' : 'auto',
                }}
                className={classNames({
                    [styles.content_wrapper]: true,
                })}>
                <div
                    className={classNames(
                        styles.content,
                        this.props.classNames.content || ''
                    )}>
                    {this.props.content}
                </div>
            </div>
        );

        return (
            <div
                data-is-collapsed={this.state.isCollapsed}
                className={classNames(
                    styles.container,
                    this.props.classNames.panel || ''
                )}>
                {titleBar}
                {!this.state.isCollapsed && content}
            </div>
        );
    }
}

export default Panel;
