import React from 'react'
import './Suite.css'
import Test from './Test'
import Panel from './Panel'
import classNames from 'classnames'
class Suite extends React.Component {
    get tests() {
        return this.props.suite.tests.map((test, testIndex) => {
            return <Test key={testIndex} test={test}/>
        })
    }

    get title() {
        let _title = [<div key="1" className="title">{this.props.suite.title}</div>]

        if(!this.props.suite.isParentRootSuite) {
            _title.push(<div key="2" className="meta" title={`${this.tests.length} tests`}>{this.tests.length}</div>)
        }

        return _title
    }

    render() {
        return (
            <Panel
                title = {this.title}
                content = {this.tests}
                classNames = {{
                    panel: classNames(
                        'suite',
                        {
                            'root': this.props.suite.isParentRootSuite
                        }
                    ),
                    content: classNames(
                        {
                            'tests': this.tests.length
                        }
                    )
                }}
            />
        )
    }
}

export default Suite