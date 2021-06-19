import React from 'react';
import { useDispatch } from 'react-redux';
import { updateSpecs } from '../reducers/cypressOptions';
import TabNavigator from './UI/TabNavigator';
import CypressOptions from './cypress/CypressOptions';
import DirectoryTree from './DirectoryTree';

import styles from './Settings.module.css';

function Settings() {
    const dispatch = useDispatch();

    const onCypressFileSelectionChange = directoryTree => {
        dispatch(updateSpecs(directoryTree.state));
    };

    const specSelectionTree = (
        <DirectoryTree
            dataURL='/cypress-spec-directories/'
            rendersCollapsed={false}
            isCaseSensitive={false}
            itemsHaveCheckboxes={true}
            onSelectionChange={onCypressFileSelectionChange}
        />
    );

    return (
        <div className={styles.container}>
            <TabNavigator
                classNames={{
                    tabs_wrapper: styles.tabs_wrapper,
                }}
                sections={[
                    {
                        label: 'Spec Selection',
                        render: () => specSelectionTree,
                    },
                    {
                        label: 'Runner Options',
                        render: () => <CypressOptions />,
                    },
                ]}
            />
        </div>
    );
}

export default Settings;
