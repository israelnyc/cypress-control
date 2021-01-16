import io from 'socket.io-client'

export function getSocket() {
    window.cypressDashboardSocket = window.cypressDashboardSocket || io(`http://${window.location.hostname}:8686`)
    console.log(window.cypressDashboardSocket.id)
    return window.cypressDashboardSocket
}

export function startCypressRunner() {
    const socket = getSocket()
    console.log('Starting runner')
    socket.emit('cypress_dashboard_start_runner')
}

export function stopCypressRunner() {
    const socket = getSocket()
    console.log('Stopping runner')
    socket.emit('cypress_dashboard_stop_runner')
}