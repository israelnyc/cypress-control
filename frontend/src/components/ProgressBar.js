import React from 'react'
import './ProgressBar.css'

class ProgressBar extends React.Component {
    get currentPercentage() {
        if(this.props.value && this.props.max) {
            return this.props.value / this.props.max * 100
        }

        return 0
    }

    render() {
        return (
            <div 
                className="progress-bar theme-default"
                role="progressbar" 
                aria-valuenow={this.currentPercentage} 
                aria-valuemin="0" 
                aria-valuemax="100">

                <div 
                    className="progress-bar-track" 
                    style={{'width': `${this.currentPercentage}%`}}>
                    
                </div>
            </div>
        )
    }
}

export default ProgressBar