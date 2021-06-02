import React from 'react';
import classNames from 'classnames';

import styles from './FormControl.module.css';

function FormControl({
    children,
    classes = {},
    control,
    description,
    id,
    label,
}) {
    return (
        <div
            className={classNames({
                ...classes.container,
                [styles.container]: true,
                [styles[control.type.name]]: styles.hasOwnProperty(
                    control.type.name
                ),
            })}>
            <label htmlFor={id}>{label}</label>
            {control && React.cloneElement(control, { id })}
            {description && (
                <p
                    className={styles.description}
                    dangerouslySetInnerHTML={description}></p>
            )}
            {children}
        </div>
    );
}

export default FormControl;
