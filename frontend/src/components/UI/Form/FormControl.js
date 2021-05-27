import React from 'react';
import classNames from 'classnames';

import styles from './FormControl.module.css';

function FormControl({ children, classes = {}, control, id, label }) {
    return (
        <div
            className={classNames({
                ...classes.container,
                [styles.container]: true,
                [styles[control.type.name]]: true,
            })}>
            <label htmlFor={id}>{label}</label>
            {control && React.cloneElement(control, { id })}
            {children}
        </div>
    );
}

export default FormControl;
