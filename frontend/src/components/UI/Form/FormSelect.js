import React from 'react';

import styles from './FormSelect.module.css';

function FormSelect({
    children,
    changeHandler = () => {},
    id = '',
    multiple = false,
    options = {},
    selectedValue = '',
    size = 0,
}) {
    return (
        <select
            id={id}
            className={styles.select}
            value={selectedValue}
            multiple={multiple}
            onChange={changeHandler}
            size={size}>
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
