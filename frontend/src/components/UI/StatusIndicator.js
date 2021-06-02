import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function StatusIndicator({ className, icon, onClick, spin, title }) {
    return (
        <div
            className={classNames({ [className]: className })}
            role='status'
            title={title}
            onClick={onClick}>
            <FontAwesomeIcon icon={icon} spin={spin} />
        </div>
    );
}

export default StatusIndicator;
