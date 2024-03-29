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
        forcedCollapse: false,
        onToggled: () => {},
    };

    static getDerivedStateFromProps(props, state) {
        if (props.forcedCollapse && !state.forcedCollapse) {
            return { forcedCollapse: true, isCollapsed: true };
        }

        if (!props.forcedCollapse && state.forcedCollapse) {
            return { forcedCollapse: false, isCollapsed: false };
        }

        return null;
    }

    constructor(props) {
        super(props);

        this.state = {
            forcedCollapse: false,
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
                    icon={
                        this.state.isCollapsed || this.state.forcedCollapse
                            ? faCaretRight
                            : faCaretDown
                    }
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
                className={classNames(
                    styles.content,
                    this.props.classNames.content || ''
                )}>
                {this.props.content}
            </div>
        );

        return (
            <div
                data-is-collapsed={
                    this.state.isCollapsed || !this.props.isCollapsible
                }
                data-is-collapsible={this.props.isCollapsible}
                className={classNames(
                    styles.container,
                    this.props.classNames.panel || ''
                )}>
                {titleBar}
                {!this.state.isCollapsed &&
                    !this.state.forcedCollapse &&
                    content}
            </div>
        );
    }
}

export default Panel;
