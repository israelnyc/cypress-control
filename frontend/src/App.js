import React from 'react'
import './App.css'
import events from './status-events'
import { getSocket } from './utils'
import StatusBar from './components/StatusBar'
import Suite from './components/Suite'
class App extends React.Component {
    constructor() {
        super()

        this.socket = getSocket()

        this.state = {
            passedCount: 0,
            failedCount: 0,
            cypressIsRunning: false,
            isConnectedToServer: false,
            isSocketDisconnected: false,
            currentSuite: {}
        }

        this.pageTitle = '%customValues Cypress Dashboard'
        this.socketDisconnectTimer = null

        this.setPageTitle()

        this.reconnectCypressSocket = this.reconnectCypressSocket.bind(this)
    }

    componentDidMount() {
        if(this.socket.disconnected) {
            this.startSocketDisconnectionTimer()
        }

        this.socket.on(events.CYPRESS_DASHBOARD_STATUS, status => {
            console.log('receiving status update from server', status)
            this.updateTestStats(status)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_RUN_BEGIN, data => {
            console.log('cypress run begin...', data)
            this.updateTestStats(data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data => {
            console.log('suite begin: ', data)
            if(data.isRootSuite) {
                this.setState({ 
                    currentSuite: data
                })
            }
        })

        this.socket.on(events.CYPRESS_DASHBOARD_SUITE_END, data => {
            console.log('suite end: ', data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_BEGIN, data => {
            console.log('test begin: ', data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_PENDING, data => {
            console.log('test pending: ', data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_START_RUNNER, () => {
            console.log('Runner started...')
            this.setState({ cypressIsRunning: true })
            this.updatePageTitlePassedFailedStatus()
        })

        this.socket.on(events.CYPRESS_DASHBOARD_STOP_RUNNER, () => {
            console.log('Runner stopped...')
            this.setState({ cypressIsRunning: false })
        })

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_PASSED, data => {
            console.log('test passed', data)
            this.setState({passedCount: data.passed})
            this.updatePageTitlePassedFailedStatus(data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_FAILED, data => {
            console.log('test failed', data)
            this.setState({ failedCount: data.failed })
            this.updatePageTitlePassedFailedStatus(data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_RUN_COMPLETED, data => {
            console.log('Run completed')
            this.updateTestStats(data)
        })

        this.socket.on('connect', () => {
            this.setState({ 
                isConnectedToServer: true,
                isSocketDisconnected: false
            })
            console.log('resetting disconnectTimer')
            clearInterval(this.socketDisconnectTimer)
        })

        this.socket.on('disconnect', () => {
            this.setState({
                passedCount: 0,
                failedCount: 0,
                cypressIsRunning: false,
                isConnectedToServer: false
            })

            this.startSocketDisconnectionTimer()
        })

    }

    startSocketDisconnectionTimer() {
        this.socketDisconnectTimer = setTimeout(() => {
            this.socket.disconnect()
            this.setState({ isSocketDisconnected: true })
            console.log('socket disconnected')
        }, 2 * 60 * 1000)
    }

    render() {
        return (
            <div role="application">
                <StatusBar 
                    testsPassed = {this.state.passedCount}
                    testsFailed = {this.state.failedCount}
                    totalSpecsRan = {this.state.totalSpecsRan}
                    totalSpecs = {this.state.totalSpecs}
                    cypressIsRunning = {this.state.cypressIsRunning}
                />

                <Suite rootSuite={this.state.currentSuite}/>
            </div>
        )
    }

    reconnectCypressSocket() {
        if(this.socket.disconnected) {
            console.log('socket reconnected')
            this.socket.connect()
            this.setState({ isSocketDisconnected: false })
            this.startSocketDisconnectionTimer()
        }
    } 

    updateTestStats(data) {
        const {
            passed,
            failed,
            isRunning,
            totalSpecs,
            totalSpecsRan
        } = data

        this.setState({
            passedCount: passed,
            failedCount: failed,
            cypressIsRunning: isRunning,
            totalSpecs,
            totalSpecsRan
        })

        this.updatePageTitlePassedFailedStatus(data)
    }

    updatePageTitlePassedFailedStatus(data) {
        const passed = data?.passed || 0
        const failed = data?.failed || 0

        this.setPageTitle(`(${passed} / ${failed})`)
    }

    setPageTitle(customValues = '') {
        document.title = this.pageTitle.replace('%customValues', customValues)
    }
}

export default App