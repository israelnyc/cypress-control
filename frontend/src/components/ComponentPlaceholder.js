import React, { Component } from 'react';
import styles from './ComponentPlaceholder.module.css';

class ComponentPlaceholder extends Component {
    render() {
        return <div className={styles.container}>{this.props.message}</div>;
    }
}

export default ComponentPlaceholder;
