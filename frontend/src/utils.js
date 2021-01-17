import io from 'socket.io-client'
import events from './status-events'

export function getSocket() {
    window.cypressDashboardSocket = window.cypressDashboardSocket || io(`http://${window.location.hostname}:8686`)
    console.log(window.cypressDashboardSocket.id)
    return window.cypressDashboardSocket
}

export function startCypressRunner() {
    const socket = getSocket()
    console.log('Starting runner')
    socket.emit(events.CYPRESS_DASHBOARD_START_RUNNER)
}

export function stopCypressRunner() {
    const socket = getSocket()
    console.log('Stopping runner')
    socket.emit(events.CYPRESS_DASHBOARD_STOP_RUNNER)
}