import React from 'react';
import { useSelector } from 'react-redux';
import Button from '../UI/Button';
import { startCypressRunner, stopCypressRunner } from '../../utils';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';

function RunnerControlButton() {
    const cypressStatus = useSelector(state => state.cypressStatus);
    const cypressIsRunningOrStarting =
        cypressStatus.isRunning || cypressStatus.isStarting;

    return (
        <Button
            title={
                cypressIsRunningOrStarting
                    ? 'Stop test runner'
                    : 'Start test runner'
            }
            onClick={
                cypressIsRunningOrStarting
                    ? stopCypressRunner
                    : startCypressRunner
            }
            icon={cypressIsRunningOrStarting ? faStop : faPlay}
        />
    );
}

export default RunnerControlButton;
