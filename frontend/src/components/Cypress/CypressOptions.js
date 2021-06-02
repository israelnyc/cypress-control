import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { update } from '../../reducers/cypressOptions';

import Form from '../UI/Form/Form';
import FormCheckbox from '../UI/Form/FormCheckbox';
import FormControl from '../UI/Form/FormControl';
import FormRow from '../UI/Form/FormRow';
import FormSelect from '../UI/Form/FormSelect';
import FormTextInput from '../UI/Form/FormTextInput';

import styles from './CypressOptions.module.css';

function CypressOptions() {
    const options = useSelector(state => state.cypressOptions);
    const dispatch = useDispatch();
    const browsers = {
        'Electron': 'electron',
        'Chrome': 'chrome',
        'Chromium': 'chromium',
        'Chrome Canary': 'chrome:canary',
        'Edge': 'edge',
        'Edge Beta': 'edge:beta',
        'Edge Dev': 'edge:dev',
        'Edge Canary': 'edge:canary',
        'Firefox': 'firefox',
        'Firefox Dev': 'firefox:dev',
        'Firefox Nightly': 'firefox:nightly',
    };

    const formControlChangeHandler = (option, e) => {
        let value = '';
        let updateObject;

        switch (e.target.type) {
            case 'select-one':
            case 'text':
                if (['reporters'].indexOf(option) > -1) {
                    value = e.target.value.split(',').map(val => val.trim());
                } else {
                    value = e.target.value;
                }
                break;
            case 'select-multiple':
                value = [...e.target.selectedOptions].map(
                    option => option.value
                );
                break;
            case 'checkbox':
                value = e.target.checked;
                break;
            default:
        }

        updateObject = { [option]: value };

        // passing both headed and headless as run options throws an error.
        // make sure when either is selected, the other is deselected.
        if (option === 'headed' && e.target.checked) {
            updateObject = {
                headless: false,
                ...updateObject,
            };
        }

        if (option === 'headless' && e.target.checked) {
            updateObject = {
                headed: false,
                ...updateObject,
            };
        }

        dispatch(update(updateObject));
    };

    useEffect(() => {
        localStorage.setItem(
            'cypressOptions',
            JSON.stringify({ ...options, spec: undefined })
        );
    }, [options]);

    const topLevelOptions = (
        <>
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>
                    <a
                        href='https://docs.cypress.io/guides/guides/module-api#Options'
                        target='_blank'
                        rel='noreferrer'>
                        Options
                    </a>
                </legend>
                <FormRow>
                    <FormControl
                        id='cypressOptionsBrowserSelection'
                        label='Browser'
                        control={
                            <FormSelect
                                changeHandler={formControlChangeHandler.bind(
                                    null,
                                    'browser'
                                )}
                                options={browsers}
                                selectedValue={options.browser}
                            />
                        }
                    />
                </FormRow>
                <FormRow>
                    <FormControl
                        description={{
                            __html: `Accepts comma delimited list of reporters, including valid 
                            <a
                                href='https://mochajs.org/#reporters'
                                target='_blank'
                                rel='noreferrer'>
                                Mocha reporters
                            </a>
                        `,
                        }}
                        id='cypressOptionsCustomReporters'
                        label='Custom Reporters'
                        control={
                            <FormTextInput
                                changeHandler={formControlChangeHandler.bind(
                                    null,
                                    'reporters'
                                )}
                                value={options.reporters}
                            />
                        }
                    />
                </FormRow>
                <FormRow>
                    <FormControl
                        classes={{
                            container: {
                                hidden: options.browser !== 'electron',
                            },
                        }}
                        id='cypressOptionsHeaded'
                        label='Headed'
                        control={
                            <FormCheckbox
                                changeHandler={formControlChangeHandler.bind(
                                    null,
                                    'headed'
                                )}
                                checked={options.headed}
                            />
                        }
                    />
                    <FormControl
                        classes={{
                            container: {
                                hidden: options.browser === 'electron',
                            },
                        }}
                        id='cypressOptionsHeadless'
                        label='Headless'
                        control={
                            <FormCheckbox
                                changeHandler={formControlChangeHandler.bind(
                                    null,
                                    'headless'
                                )}
                                checked={options.headless}
                            />
                        }
                    />
                </FormRow>

                <FormRow>
                    <FormControl
                        id='cypressOptionsQuiet'
                        label='Quiet'
                        control={
                            <FormCheckbox
                                changeHandler={formControlChangeHandler.bind(
                                    null,
                                    'quiet'
                                )}
                                checked={options.quiet}
                            />
                        }
                    />
                </FormRow>
            </fieldset>
        </>
    );

    return <Form>{topLevelOptions}</Form>;
}

export default CypressOptions;
