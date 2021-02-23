import React from 'react'
import './Test.css'
import CurrentTestContext from '../CurrentTestContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faCheck, 
    faTimes
} from '@fortawesome/free-solid-svg-icons'

class Test extends React.Component {
    render() {
        return (
            <CurrentTestContext.Consumer>
                {(data) => {
                    return (
                        <div className={
                            `test` +
                            `${data.id === this.props.test.id ? ' current' : ''}`}>
                            
                            <div className={
                                `status ` +
                                `${this.props.test.status} ` +
                                `${this.props.test.hasCompleted ? '' : 'invisible'}`}>
                                <FontAwesomeIcon icon={this.props.test.status === 'passed' ? faCheck : faTimes} />
                            </div>
                            <div className="title">{this.props.test.title}</div>
                        </div>
                    )
                }}        
            </CurrentTestContext.Consumer>
        )
    }
}

export default Test