import io from 'socket.io-client';
import events from './status-events';
import store from './store';

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
