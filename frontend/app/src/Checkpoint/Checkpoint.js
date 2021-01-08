import React from 'react';
import './Checkpoint.css';
import {GoCheck, GoSync, GoX} from "react-icons/go";

const Checkpoint = ({state, message}) => {
    const getIcon = (state) => {
        switch(state){
            case 'loading':
                return <GoSync className='LoadingIcon'/>;
            case 'success':
                return <GoCheck className='SuccessIcon'/>;
            case 'failure':
                return <GoX className='FailureIcon'/>;
            default:
                throw Error('Incorrect state');
        }
    };

    return (
        <div className='Checkpoint'>
            {getIcon(state)}
            <p>{message}</p>
        </div>
    )
}

export default Checkpoint;

