import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './Modal.module.css';

class Modal extends Component {
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
                <div onClick={this.modalClickHandler} className={styles.modal}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Modal;
