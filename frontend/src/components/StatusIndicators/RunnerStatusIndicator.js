import classNames from 'classnames';
import React from 'react';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import { getSocket, startSocketDisconnectionTimer } from '../../utils';
import StatusIndicator from '../UI/StatusIndicator';

import styles from './RunnerStatusIndicator.module.css';

function RunnerStatusIndicator() {
    const connectionStatus = useSelector(state => state.connectionStatus);
    const cypressStatus = useSelector(state => state.cypressStatus);

    const socket = getSocket();

    const reconnectCypressSocket = () => {
        if (socket.disconnected) {
            console.log('socket reconnected');
            socket.connect();
            startSocketDisconnectionTimer();
        }
    };

    const serverConnectionTitle = [];

    connectionStatus.isServerConnected
        ? serverConnectionTitle.push('Connected to server.')
        : serverConnectionTitle.push('Disconnected from server.');

    if (
        !connectionStatus.isServerConnected &&
        !connectionStatus.isSocketConnected
    ) {
        serverConnectionTitle.push(
            'Socket has also been disconnected, click to reconnect socket.'
        );
    }

    if (
        !connectionStatus.isServerConnected &&
        connectionStatus.isSocketConnected
    ) {
        serverConnectionTitle.push('Waiting for server to start.');
    }

    return (
        <StatusIndicator
            className={classNames({
                pointer: !connectionStatus.isSocketConnected,
                [styles.connection_status]: true,
                [styles.server_connected]: connectionStatus.isServerConnected,
                [styles.server_disconnected]:
                    !connectionStatus.isServerConnected ||
                    !connectionStatus.isSocketConnected,
            })}
            onClick={
                !connectionStatus.isSocketConnected
                    ? reconnectCypressSocket
                    : () => {}
            }
            icon={faCircleNotch}
            spin={cypressStatus.isRunning}
            title={serverConnectionTitle.join(' ')}
        />
    );
}

export default RunnerStatusIndicator;
