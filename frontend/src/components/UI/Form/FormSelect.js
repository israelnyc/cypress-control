import React from 'react';

import styles from './FormSelect.module.css';

function FormSelect({
    children,
    changeHandler = () => {},
    id = '',
    options = {},
    selectedValue = '',
}) {
    return (
        <select
            id={id}
            className={styles.container}
            value={selectedValue}
            onChange={changeHandler}>
            {Object.keys(options).map(option => {
                const optionValue = options[option];
                return (
                    <option key={optionValue} value={optionValue}>
                        {option}
                    </option>
                );
            })}
            {children}
        </select>
    );
}

export default FormSelect;
