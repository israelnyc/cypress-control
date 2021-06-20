import React from 'react';
import { useSelector } from 'react-redux';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import styles from './FilterStatusIndicator.module.css';
import StatusIndicator from '../UI/StatusIndicator';

function FilterStatusIndicator() {
    const cypressOptions = useSelector(state => state.cypressOptions);
    const title = cypressOptions.specSelectionsFiltered
        ? 'Spec selection filter applied'
        : 'No spec selection filter applied';

    return (
        <StatusIndicator
            className={classNames({
                [styles.container]: true,
                [styles.filtered]: cypressOptions.specSelectionsFiltered,
            })}
            icon={faFilter}
            title={title}
        />
    );
}

export default FilterStatusIndicator;
