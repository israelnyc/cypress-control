import React from 'react'
import './Suite.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faCheck, 
    faTimes
} from '@fortawesome/free-solid-svg-icons'

class Suite extends React.Component { 
    render() {
        return (
            <div>
                <div className="suites-root-container">
                    <div className="meta">
                        <div className="filename">File: {this.props.rootSuite.file}</div>
                        <div className="suites-amount">Suites: {this.props.rootSuite.suites.length}</div>
                    </div>

                    <ul className="suites">
                    {this.props.rootSuite.suites.map((suite, suiteIndex) => {
                        return (
                            <li className={
                                    `suite ` +
                                    `${suite.isParentRootSuite ? 'root' : ''}`
                                }
                                key={suiteIndex}>
                                <div className="title">{suite.title}</div>

                                {suite.tests.length ? (
                                    <ul className="tests">
                                        {suite.tests.map((test, testIndex) => {
                                            return (
                                                <li key={testIndex} 
                                                    className={
                                                        `test` +
                                                        `${this.props.currentTest.id === test.id ? ' current' : ''}`
                                                    }>

                                                    <div className={
                                                        `status ` +
                                                        `${test.status} ` +
                                                        `${test.hasCompleted ? '' : 'invisible'}`
                                                    }>
                                                        <FontAwesomeIcon icon={test.status === 'passed' ? faCheck : faTimes} />
                                                    </div>
                                                    <div className="title">{test.title}</div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ) : ''}
                            </li>
                        )                    
                    })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Suite