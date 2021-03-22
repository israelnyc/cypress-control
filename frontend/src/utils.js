import io from 'socket.io-client';
import events from './status-events';
import store from './store';

export function getSocket() {
    window.cypressDashboardSocket = window.cypressDashboardSocket || io();

    if (process.env.NODE_ENV === 'test') {
        window.cypressDashboardSocket.disconnect();
    }

    return window.cypressDashboardSocket;
}

export function startCypressRunner() {
    const socket = getSocket();
    const { isFiltered, selectedSpecs } = store.getState().specSelections;

    console.log('Starting runner');

    socket.emit(events.CYPRESS_DASHBOARD_START_RUNNER, {
        isFiltered,
        selectedSpecs,
    });
}

export function stopCypressRunner() {
    const socket = getSocket();
    console.log('Stopping runner');
    socket.emit(events.CYPRESS_DASHBOARD_STOP_RUNNER);
}
