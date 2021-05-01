import React from 'react';
import classNames from 'classnames';
import styles from './StatusBarSection.module.css';

const StatusBarSection = ({ children, className }) => {
    return (
        <div
            className={classNames({
                [styles.container]: true,
                [className]: true,
            })}>
            {children}
        </div>
    );
};

export default StatusBarSection;
