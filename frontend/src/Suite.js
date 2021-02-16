import React from 'react'
class Suite extends React.Component {
    render() {
        return (
            <div>
                <div className="filename">File: {this.props.rootSuite.file}</div>
                <div className="suites">Suites: {this.props.rootSuite?.suites?.length}</div>
            </div>
        )
    }
}

export default Suite