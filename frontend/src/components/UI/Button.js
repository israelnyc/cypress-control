import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Button.module.css';

function Button({ className, disabled, onClick, icon, title }) {
    return (
        <button
            className={classNames({
                [className]: true,
                [styles.container]: true,
            })}
            onClick={onClick}
            title={title}
            {...(disabled && { disabled })}>
            <FontAwesomeIcon icon={icon} />
        </button>
    );
}

export default Button;
