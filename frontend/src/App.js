import React from 'react'
import './App.css'
import events from './status-events'
import { startCypressRunner, stopCypressRunner, getSocket } from './utils'
import Suite from './Suite'
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

        this.socket.on(events.CYPRESS_DASHBOARD_STATUS, data => {
            console.log('receiving status update from server')
            this.updateTestStats(data)
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
            this.setState({passedCount: data.status.passed})
            this.updatePageTitlePassedFailedStatus(data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_FAILED, data => {
            console.log('test failed', data)
            this.setState({ failedCount: data.status.failed })
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
            <div>
                <header className="App">
                    <button onClick={this.reconnectCypressSocket} className={`${this.state.isSocketDisconnected ? '' : 'hidden'}`}>Reconnect</button>
                    <p className={`connection-status ${this.state.isConnectedToServer ? 'connected' : 'disconnected'}`}>Connection</p>
                    <p>{this.state.tests} total tests</p>
                    <p>{this.state.passedCount} tests passed</p>
                    <p>{this.state.failedCount} tests failed</p>
                    <p>Specs: {this.state.totalSpecsRan} / {this.state.totalSpecs}</p>
                    <button onClick={startCypressRunner}>Start</button>
                    <button onClick={stopCypressRunner}>Stop</button>
                    <span className={`runner-status ${this.state.cypressIsRunning ? "running" : "stopped"}`}></span>
                </header>

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
            tests,
            totalSpecs,
            totalSpecsRan
        } = data.status

        this.setState({
            passedCount: passed,
            failedCount: failed,
            cypressIsRunning: isRunning,
            tests,
            totalSpecs,
            totalSpecsRan
        })

        this.updatePageTitlePassedFailedStatus(data)
    }

    updatePageTitlePassedFailedStatus(data) {
        const passed = data?.status?.passed || 0
        const failed = data?.status?.failed || 0

        this.setPageTitle(`(${passed} / ${failed})`)
    }

    setPageTitle(customValues = '') {
        document.title = this.pageTitle.replace('%customValues', customValues)
    }
}

export default App