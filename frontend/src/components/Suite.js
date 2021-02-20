import React from 'react'
import './Suite.css'
class Suite extends React.Component { 
    render() {
        return (
            <div>
                <div className="filename">File: {this.props.rootSuite.file}</div>
                <div className="suites">Suites: {this.props.rootSuite.suites.length}</div>

                <ul className="suites">
                {this.props.rootSuite.suites.map((suite, suiteIndex) => {
                    return (
                        <li className="suite" key={suiteIndex}>{suite.title}
                            {suite.tests.length ? (
                                <ul className="tests">
                                    {suite.tests.map((test, testIndex) => {
                                        return (
                                            <li key={testIndex} 
                                                className={
                                                    `test` +
                                                    `${this.props.currentTestId === test.id ? ' current' : ''}`
                                                }
                                            >
                                                {test.title}  
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
        )
    }
}

export default Suite