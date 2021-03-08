import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.css';

class Modal extends Component {
    static defaultProps = {
        classNames: {},
    };

    modalClickHandler = e => {
        e.stopPropagation();
    };

    render() {
        return (
            <div
                onClick={this.props.closeModal}
                className={classNames({
                    [styles.container]: true,
                    hidden: !this.props.isVisible,
                })}>
                <div
                    onClick={this.modalClickHandler}
                    className={classNames(
                        styles.modal,
                        this.props.classNames.modal
                    )}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Modal;
