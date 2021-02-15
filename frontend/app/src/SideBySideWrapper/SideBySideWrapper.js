import React from 'react';
import './SideBySideWrapper.css';

const SideBySideWrapper = ({left, right}) => {

    return (
        <div className="SideBySideWrapper">
            <div>
                {left}
            </div>
            <div>
                {right}
            </div>
        </div>
    );
}

export default SideBySideWrapper;
