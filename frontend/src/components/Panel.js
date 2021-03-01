import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Panel.module.css';

class Panel extends Component {
    static defaultProps = {
        classNames: {},
        isCollapsible: true,
        rendersCollapsed: false,
    };

    state = {
        isCollapsed: false,
    };

    constructor(props) {
        super(props);

        this.container = React.createRef();
        this.titleBar = React.createRef();
    }

    componentDidMount() {
        if (this.props.isCollapsible) {
            this.titleBar.current.addEventListener('click', () => {
                this.state.isCollapsed ? this.expand() : this.collapse();
            });

            if (this.props.rendersCollapsed) {
                this.collapse();
            }
        }
    }

    collapse() {
        this.container.current.style.maxHeight =
            this.titleBar.current.offsetHeight + 'px';

        this.setState({ isCollapsed: true });
    }

    expand() {
        this.container.current.style.maxHeight = '';

        this.setState({ isCollapsed: false });
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
                    ref={this.titleBar}
                    className={classNames(
                        'title-bar',
                        { [styles.is_collapsible]: this.props.isCollapsible },
                        this.props.classNames.title || ''
                    )}>
                    {this.props.title}
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
