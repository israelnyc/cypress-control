import React from 'react'
import './Suite.css'
import Test from './Test'

class Suite extends React.Component {
    render() {
        const tests = this.props.suite.tests.map((test, testIndex) => {
            return <Test key={testIndex} test={test}/>
        })

        return (
            <li className={
                `suite ` +
                `${this.props.suite.isParentRootSuite ? 'root' : ''}`
                }>

                <div className="title-bar">
                    <div className="title">{this.props.suite.title}</div>
                    {!this.props.suite.isParentRootSuite ? 
                        <div className="meta" title={`${tests.length} tests`}>{tests.length}</div>
                    : ''}                    
                </div>

                {tests.length ? 
                    <ul className="tests">
                        {tests}
                    </ul>
                : ''}
            </li>
        )
    }
}

export default Suite