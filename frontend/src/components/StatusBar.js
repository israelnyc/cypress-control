import React from 'react'
import './StatusBar.css'
import { startCypressRunner, stopCypressRunner } from '../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import ProgressBar from './ProgressBar'
import { 
    faCheck, 
    faTimes, 
    faPlay, 
    faStop, 
    faWifi 
} from '@fortawesome/free-solid-svg-icons'

class StatusBar extends React.Component {
    render() {
        return (
            <header className="status-bar-header">
                <ProgressBar 
                    value = {this.props.totalSpecsRan} 
                    max = {this.props.totalSpecs}/>
                    
                <div className="status-bar">
                    <div className="stats">
                        <div className="tests-passed stat">
                            <FontAwesomeIcon icon={faCheck} />
                            <div className="value">{this.props.testsPassed}</div>
                        </div>
                        
                        <div className="tests-failed stat">
                            <FontAwesomeIcon icon={faTimes} />
                            <div className="value">{this.props.testsFailed}</div>
                        </div>

                        <div className="total-tests stat">
                            <div className="value">Tests: {this.props.testsFailed + this.props.testsPassed}</div>
                        </div>
                        
                        <div className="specs-of-total-specs stat">
                            Specs: {this.props.totalSpecsRan} / {this.props.totalSpecs}
                        </div>
                    </div> 

                    <div className="control">
                        <div 
                            title="Start test runner"
                            className={
                                classNames(
                                    'start-runner-button',
                                    'pointer',
                                    {
                                        'hidden': this.props.cypressIsRunning || this.props.cypressIsStarting
                                    }
                                )
                                
                            }
                            onClick={startCypressRunner}
                        >
                            <FontAwesomeIcon icon={faPlay} />
                        </div>
                        
                        <div 
                            title="Stop test runner"
                            className={
                                classNames(
                                    'stop-runner-button',
                                    'pointer',
                                    {
                                        'hidden': !this.props.cypressIsRunning && !this.props.cypressIsStarting
                                    }
                                )    
                            }
                            onClick={stopCypressRunner}
                        >
                            <FontAwesomeIcon icon={faStop} />
                        </div>

                        <div className={
                            classNames(
                                'runner-status',
                                {
                                    'running': this.props.cypressIsRunning,
                                    'stopped': !this.props.cypressIsRunning && !this.props.cypressIsStarting,
                                    'pending': this.props.cypressIsStarting
                                }
                            )
                        }></div>

                        <div 
                            title={
                                `${this.props.isConnectedToServer ? 'Connected to' : 'Disconnected from'} server.` +
                                `${!this.props.isConnectedToServer && this.props.isSocketDisconnected ? ' Socket has also been disconnected, click to reconnect socket.' : ''}` +
                                `${!this.props.isConnectedToServer && !this.props.isSocketDisconnected ? ' Waiting for server to reconnect.' : ''}`
                            }
                            className={
                                `server-connection-status ` +
                                `${this.props.isConnectedToServer ? 'connected' : 'disconnected'}` +
                                `${this.props.isSocketDisconnected ? ' pointer' : ''}`
                            }

                            { ...(this.props.isSocketDisconnected && { onClick: this.props.reconnectCypressSocket})}
                        >
                            <FontAwesomeIcon icon={faWifi} />
                        </div>
                    </div>
                </div>             
            </header>
        )
    }
}

export default StatusBar