import React from 'react';
import { useDispatch } from 'react-redux';
import { updateSpecs } from '../reducers/cypressOptions';
import TabNavigator from './UI/TabNavigator';
import CypressOptions from './cypress/CypressOptions';
import DirectoryTree from './DirectoryTree';

import styles from './Settings.module.css';
import RunnerStatusIndicator from './StatusIndicators/RunnerStatusIndicator';
import RunnerControlButton from './Buttons/RunnerControlButton';
import StatusBarSection from './StatusBar/StatusBarSection';
import FilterStatusIndicator from './StatusIndicators/FilterStatusIndicator';

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
            <header className={styles.status}>
                <div className={styles.title}>Settings</div>
                <StatusBarSection>
                    <RunnerControlButton />
                    <RunnerStatusIndicator />
                    <FilterStatusIndicator />
                </StatusBarSection>
            </header>
            <TabNavigator
                classNames={{
                    container: styles.tab_navigator_container,
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
