import io from 'socket.io-client';
import events from './status-events';
import store from './store';
import { setSocketConnected } from './reducers/connectionStatus';

export function getSocket() {
    window.cypressControlSocket = window.cypressControlSocket || io();

    if (process.env.NODE_ENV === 'test') {
        window.cypressControlSocket.disconnect();
    }

    return window.cypressControlSocket;
}

export function startCypressRunner() {
    const socket = getSocket();

    console.log('Starting runner');

    socket.emit(
        events.CYPRESS_CONTROL_START_RUNNER,
        store.getState().cypressOptions
    );
}

export function stopCypressRunner() {
    const socket = getSocket();

    console.log('Stopping runner');

    socket.emit(events.CYPRESS_CONTROL_STOP_RUNNER);
}

export function startSocketDisconnectionTimer() {
    const socket = getSocket();

    store.dispatch(setSocketConnected(true));

    window.socketDisconnectTimer = setTimeout(() => {
        socket.disconnect();
        store.dispatch(setSocketConnected(false));
        console.log('socket disconnected');
    }, 2 * 60 * 1000);
}

export function clearSocketDisconnectionTimer() {
    clearInterval(window.socketDisconnectTimer);
}
