import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faCheck, 
    faTimes
} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames'
import CurrentTestContext from '../CurrentTestContext'
import styles from './Test.module.css'

class Test extends React.Component {
    render() {
        return (
            <CurrentTestContext.Consumer>
                {(data) => {
                    return (
                        <div className={classNames(
                                styles.container,
                                {
                                    [styles.current]: data.id === this.props.test.id
                                }
                            )}>
                            
                            <div className={classNames(
                                styles.status,
                                styles[this.props.test.status],
                                {
                                    'invisible': !this.props.test.hasCompleted
                                }
                            )}>
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