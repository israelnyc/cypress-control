import React from 'react'
import './Spec.css'
import Suite from './Suite'

class Spec extends React.Component {
    render() {
        const suites = this.props.rootSuite.suites.map((suite, suiteIndex) => {
            return <Suite key={suiteIndex} suite={suite} />
        })

        return (
            <div className="suites-root-container">
                <div className="meta">                    
                        <div className="suites-amount">Suites: {this.props.rootSuite.suites.length}</div>
                        <div className="tests-amount">Tests: {this.props.rootSuite.totalTests}</div>
                    <div className="filename">{this.props.rootSuite.file}</div>
                </div>

                <div className="suites">
                    { suites }
                </div>
            </div>
        )
    }
}

export default Spec