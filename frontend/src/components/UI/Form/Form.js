import React from 'react';

import styles from './Form.module.css';

function Form({ children }) {
    return <form className={styles.container}>{children}</form>;
}

export default Form;
