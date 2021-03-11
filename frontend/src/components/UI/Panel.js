import React, { Component } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import styles from './Panel.module.css';

class Panel extends Component {
    static defaultProps = {
        classNames: {},
        isCollapsible: true,
        rendersCollapsed: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            isCollapsed: false,
        };

        this.container = React.createRef();
        this.titleBar = React.createRef();
    }

    componentDidUpdate() {
        this.container.current.style.maxHeight = this.state.isCollapsed
            ? this.titleBar.current.offsetHeight + 'px'
            : '';
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
        this.setState({ isCollapsed: true });
    }

    expand() {
        this.setState({ isCollapsed: false });
    }

    render() {
        return (
            <div
                ref={this.container}
                data-is-collapsed={this.state.isCollapsed}
                className={classNames(
                    styles.container,
                    this.props.classNames.panel || ''
                )}>
                <div
                    ref={this.titleBar}
                    onClick={this.titleBarClickHandler}
                    className={classNames(
                        styles.title_bar,
                        { [styles.is_collapsible]: this.props.isCollapsible },
                        this.props.classNames.titleBar || ''
                    )}>
                    <div
                        className={classNames({
                            hidden: !this.props.isCollapsible,
                            [styles.toggle_icon_container]: true,
                            [this.props.classNames.toggleIconContainer]: true,
                        })}>
                        <FontAwesomeIcon
                            className={styles.toggle_icon}
                            icon={
                                this.state.isCollapsed
                                    ? faCaretRight
                                    : faCaretDown
                            }
                        />
                    </div>
                    <div
                        className={classNames(
                            styles.title_bar_content,
                            this.props.classNames.title || ''
                        )}>
                        {this.props.title}
                    </div>
                </div>

                <div
                    className={classNames(
                        styles.content,
                        this.props.classNames.content || ''
                    )}>
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default Panel;
