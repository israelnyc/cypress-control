import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Panel.module.css';
class Panel extends Component {
    static defaultProps = {
        classNames: {},
        isCollapsible: true,
    };

    state = {
        isCollapsed: false,
    };

    constructor(props) {
        super(props);

        this.container = React.createRef();
    }

    componentDidMount() {
        const panel = this.container.current;
        const titleBar = panel.querySelector('.title-bar');
        const titleBarHeight = titleBar.offsetHeight;

        if (this.props.isCollapsible) {
            titleBar.addEventListener('click', () => {
                panel.style.height = this.state.isCollapsed
                    ? 'auto'
                    : titleBarHeight + 'px';

                this.setState({
                    isCollapsed: !this.state.isCollapsed,
                });
            });
        }
    }

    render() {
        return (
            <div
                ref={this.container}
                className={classNames(
                    styles.container,
                    this.props.classNames.panel || ''
                )}>
                <div
                    className={classNames(
                        'title-bar',
                        { [styles.is_collapsible]: this.props.isCollapsible },
                        this.props.classNames.title || ''
                    )}>
                    {this.props.title}
                </div>

                <div
                    className={classNames(
                        'content',
                        this.props.classNames.content || ''
                    )}>
                    {this.props.content}
                </div>
            </div>
        );
    }
}

export default Panel;
