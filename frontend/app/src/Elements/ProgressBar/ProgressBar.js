import React from "react";
import './ProgressBar.css';

const ProgressBar = (props) => {
    const { completed } = props;
    return (
        <div className='ProgressContainer'>
            <div 
                className='ProgressFill' 
                style={{
                    width: `${completed}%`
                }}
            >
                <span className='ProgressText'>{`${completed}%`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;