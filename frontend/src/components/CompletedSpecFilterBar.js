import React from 'react';
import classNames from 'classnames';

import Button from './UI/Button';
import ButtonBar from './UI/ButtonBar';
import { useSelector, useDispatch } from 'react-redux';
import { setFailing, setPassing } from '../reducers/specFilter';

import styles from './CompletedSpecFilterBar.module.css';

function CompletedSpecFilterBar() {
    const filterPassing = useSelector(state => state.specFilters.passing);
    const filterFailing = useSelector(state => state.specFilters.failing);
    const dispatch = useDispatch();

    return (
        <div className={classNames({ [styles.container]: true })}>
            <div>Filter</div>
            <ButtonBar>
                <Button
                    title='Click to toggle filter'
                    className={{
                        selected: styles.selected,
                        container: styles.button,
                    }}
                    selectable={true}
                    selectedByDefault={true}
                    value='Passed'
                    onClick={() => dispatch(setPassing(!filterPassing))}
                />
                <Button
                    title='Click to toggle filter'
                    className={{
                        selected: styles.selected,
                        container: styles.button,
                    }}
                    selectable={true}
                    selectedByDefault={true}
                    value='Failed'
                    onClick={() => dispatch(setFailing(!filterFailing))}
                />
            </ButtonBar>
        </div>
    );
}

export default CompletedSpecFilterBar;
