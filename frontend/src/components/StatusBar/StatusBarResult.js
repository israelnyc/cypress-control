import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './StatusBarResult.module.css';

const StatusBarResult = ({ className = {}, icon, title, value }) => {
    return (
        <div className={styles.container} title={title}>
            <FontAwesomeIcon className={className.icon} icon={icon} />
            {value && (
                <div
                    className={classNames({
                        [className.value]: className.value,
                        [styles.value]: styles.value,
                    })}>
                    {value}
                </div>
            )}
        </div>
    );
};

export default StatusBarResult;
