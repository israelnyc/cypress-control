import React from 'react'

class Suite extends React.Component {
    render() {
        return (
            <div>
                <div>File: {this.props.rootSuite.file}</div>
                <div>Suites: {this.props.rootSuite?.suites?.length}</div>
            </div>
        )
    }
}

export default Suite