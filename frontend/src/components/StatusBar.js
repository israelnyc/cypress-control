import React from 'react'
import './StatusBar.css'
import { startCypressRunner, stopCypressRunner } from '../utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
            <header className="status-bar">
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
                        className={`start-runner-button ${this.props.cypressIsRunning ? 'hidden' : ''} pointer`}
                        onClick={startCypressRunner}
                    >
                        <FontAwesomeIcon icon={faPlay} />
                    </div>
                    
                    <div 
                        title="Stop test runner"
                        className={`stop-runner-button ${this.props.cypressIsRunning ? '' : 'hidden'} pointer`}
                        onClick={stopCypressRunner}
                    >
                        <FontAwesomeIcon icon={faStop} />
                    </div>

                    <div className={`runner-status ${this.props.cypressIsRunning ? "running" : "stopped"}`}></div>

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
            </header>
        )
    }
}

export default StatusBar