import React from 'react';

import styles from './FormTextInput.module.css';

function FormTextInput({
    changeHandler = () => {},
    id,
    spellcheck = false,
    value = '',
}) {
    return (
        <input
            type='text'
            className={styles.input}
            id={id}
            onChange={changeHandler}
            value={value}
            spellCheck={spellcheck}
        />
    );
}

export default FormTextInput;
