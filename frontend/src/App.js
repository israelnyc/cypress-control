import React from 'react'
import './App.css'
import events from './status-events'
import { getSocket } from './utils'
import StatusBar from './components/StatusBar'
import Spec from './components/Spec'
import CurrentTestContext from './CurrentTestContext'

class App extends React.Component {
    constructor() {
        super()

        this.socket = getSocket()

        this.state = {
            passedCount: 0,
            failedCount: 0,
            cypressIsStarting: false,
            cypressIsRunning: false,
            isConnectedToServer: false,
            isSocketDisconnected: false,
            currentSpec: {
                suites: [{
                    id: 'r1',
                    title: 'Suite One',
                    tests: [
                        {
                            id: 'r2',
                            title: 'test one',
                            status: 'passed',
                            hasCompleted: true
                        },
                        {
                            id: 'r3',
                            title: 'test two',
                            status: 'failed',
                            hasCompleted: true
                        },
                        {
                            id: 'r4',
                            title: 'test three',
                            status: 'passed',
                            hasCompleted: true
                        },
                        {
                            id: 'r5',
                            title: 'test four',
                            status: 'passed',
                            hasCompleted: true
                        }
                    ]
                },
                {
                    id: 'r6',
                    title: 'Suite two',
                    tests: [
                        {
                            id: 'r7',
                            title: 'test one',
                            status: 'passed',
                            hasCompleted: true
                        },
                        {
                            id: 'r8',
                            title: 'test two',
                            status: 'failed',
                            hasCompleted: true
                        },
                        {
                            id: 'r9',
                            title: 'test three',
                            status: 'failed',
                            hasCompleted: true
                        },
                        {
                            id: 'r10',
                            title: 'test four',
                            status: 'failed',
                            hasCompleted: true
                        }
                    ]
                }]
            },
            currentTest: {},
            completedSpecs: []
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

        this.socket.on(events.CYPRESS_DASHBOARD_BEFORE_RUN, () => {
            console.log('before run')
        })

        this.socket.on(events.CYPRESS_DASHBOARD_RUN_BEGIN, data => {
            console.log('cypress run begin...', data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_SUITE_BEGIN, data => {
            console.log('suite begin: ', data)
            if(data.isRootSuite) {
                this.setState({ 
                    currentSpec: data
                })
            }
        })

        this.socket.on(events.CYPRESS_DASHBOARD_SUITE_END, data => {
            console.log('suite end: ', data)
            if(data.isRootSuite) {
                this.setState({
                    completedSpecs: [...this.state.completedSpecs, this.state.currentSpec]
                })
            }
        })

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_BEGIN, data => {
            console.log('test begin: ', data)
            this.setState({currentTest: data})
        })

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_PENDING, data => {
            console.log('test pending: ', data)
        })

        this.socket.on(events.CYPRESS_DASHBOARD_START_RUNNER, () => {
            console.log('Runner started...')
            this.updatePageTitlePassedFailedStatus()
        })

        this.socket.on(events.CYPRESS_DASHBOARD_STOP_RUNNER, () => {
            console.log('Runner stopped...')
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

        this.socket.on(events.CYPRESS_DASHBOARD_TEST_END, data => {
            console.log('test end', data)

            const currentSpecCopy = JSON.parse(JSON.stringify(this.state.currentSpec))

            const currentSpecTest = currentSpecCopy.suites.reduce((prev, curr) => {
                return prev.concat(curr.tests)
            }, []).filter(test => test.id === data.id)[0]

            if(currentSpecTest) {
                currentSpecTest.hasCompleted = true
                currentSpecTest.status = data.status

                this.setState({currentSpec: currentSpecCopy})
            }
        })

        this.socket.on(events.CYPRESS_DASHBOARD_RUN_COMPLETED, data => {
            console.log('Run completed', data)
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
                cypressIsStarting: false,
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
                    cypressIsStarting = {this.state.cypressIsStarting}
                    cypressIsRunning = {this.state.cypressIsRunning}
                    isConnectedToServer = {this.state.isConnectedToServer}
                    reconnectCypressSocket = {this.reconnectCypressSocket}
                    isSocketDisconnected = {this.state.isSocketDisconnected}
                />

                <CurrentTestContext.Provider value={this.state.currentTest}>        
                    <Spec rootSuite={this.state.currentSpec} currentTest={this.state.currentTest}/>
                </CurrentTestContext.Provider>
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
            isStarting,
            totalSpecs,
            totalSpecsRan
        } = data

        this.setState({
            passedCount: passed,
            failedCount: failed,
            cypressIsRunning: isRunning,
            cypressIsStarting: isStarting,
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