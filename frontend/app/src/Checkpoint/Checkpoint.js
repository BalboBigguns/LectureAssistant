import React from 'react';
import './Checkpoint.css';
import {GoCheck, GoSync, GoX} from 'react-icons/go';
import ProgressBar from '../ProgressBar/ProgressBar';

const Checkpoint = ({state, message, completed = 0}) => {
    const getIcon = (state) => {
        switch(state){
            case 'preprocessing':
            case 'processing':
                return <GoSync className='LoadingIcon'/>;
            case 'processingSuccess':
            case 'preprocessingSuccess':
                return <GoCheck className='SuccessIcon'/>;
            case 'failure':
                return <GoX className='FailureIcon'/>;
            default:
                throw Error('Incorrect state');
        }
    };

    return (
        <div className='Checkpoint'>
            <div className='CheckpointMessage'>
                {getIcon(state)}
                <p>{message}</p>
            </div>
            { state === 'processing' && 
                <ProgressBar completed={completed}/>
            }
        </div>
    )
}

export default Checkpoint;

