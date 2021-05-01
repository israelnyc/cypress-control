import React from 'react';
import classNames from 'classnames';

import styles from './ButtonBar.module.css';

function ButtonBar({ children, className }) {
    return (
        <div
            className={classNames({
                [className]: className,
                [styles.container]: true,
            })}>
            {children}
        </div>
    );
}

export default ButtonBar;
