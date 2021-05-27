import React from 'react';

import styles from './FormCheckbox.module.css';

function FormCheckbox({ checked, changeHandler = () => {}, id }) {
    return (
        <input
            id={id}
            className={styles.input}
            type='checkbox'
            checked={checked}
            onChange={changeHandler}
        />
    );
}

export default FormCheckbox;
