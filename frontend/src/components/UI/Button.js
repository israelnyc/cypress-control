import React, { useState } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Button.module.css';

function Button({
    icon,
    title,
    value,
    onClick,
    disabled,
    className = {},
    selectable,
    selectedByDefault,
}) {
    const [selected, setSelected] = useState(
        !!selectable && !!selectedByDefault
    );

    const hasValue = typeof value !== 'undefined';

    const clickHandler = () => {
        if (selectable) {
            setSelected(!selected);
        }

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    return (
        <button
            className={classNames({
                [className.container]: true,
                [className.selected]: selectable && selected,
                [styles.container]: true,
            })}
            data-has-value={hasValue}
            onClick={clickHandler}
            title={title}
            {...(disabled && { disabled })}>
            {icon && <FontAwesomeIcon icon={icon} />}
            {hasValue && value}
        </button>
    );
}

export default Button;
