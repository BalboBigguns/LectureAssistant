import React, { useState, useEffect } from 'react';
import Checkpoint from '../Checkpoint/Checkpoint';
import FileInput from '../FileInput/FileInput';
import './UploadSection.css';
import axios from 'axios';

const serverEventSource = new EventSource(`${process.env.REACT_APP_API_URL}/stream`);

const downloadFile = (name, contents, mime_type) => {
    mime_type = mime_type || "text/plain";

    const blob = new Blob([contents], {type: mime_type});

    const dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function(e) {
        // revokeObjectURL needs a delay to work properly
        const that = this;
        setTimeout(function() {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
}

const errorHandler = (event) => {
    console.log("Failed to connect to event stream. Is Redis running?");
};


const UploadSection = ({useData}) => {
    const [data, setData] = useData();
    const [file, setFile] = useState(null);
    const [processingState, setProcessingState] = useState([]);
    
    
    const processingHandler = (event) => {
        const data = JSON.parse(event.data);
        const percent = Math.round((data.fraction + Number.EPSILON) * 100);
        console.log(`${(new Date()).toISOString()}# Processed: ${percent}%`);
    
        setProcessingState(state => (
            state.map(s => {
                if(s.state === 'processing') {
                    s.completed = percent;
                }
                return s;
            })
        ));
    };

    useEffect(() => {
        serverEventSource.addEventListener('processing', processingHandler, false);
        serverEventSource.addEventListener('error', errorHandler, false);
        return () => {
            serverEventSource.removeEventListener('processing', processingHandler);
            serverEventSource.removeEventListener('error', errorHandler);
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(file);

        const formData = new FormData();
        formData.append('file', file);
        
        setProcessingState([...processingState, {
            state: 'processing',
            message: 'Uploading and analysing file, this may take a few minutes...'
        }])
        let newState = processingState.filter(s => s.state !== 'processing');
        axios.post(
            `${process.env.REACT_APP_API_URL}/upload`, 
            formData
        )
        .then(res => {
            setData(res.data);
            console.log(res.data);
            newState.push({
                state: 'processingSuccess',
                message: 'Analysis is completed, you should see results in a moment!'
            });
            setProcessingState(newState);
        })
        .catch(error => {
            console.error(error.message)
            newState.push({
                state: 'failure',
                message: 'Error occured during analysis, try again later'
            });
            setProcessingState(newState);
        });
    };

    return (
        <div className='UploadSection'>
            { file && (
                <>
                <p>Preview of the file:</p>
                <audio
                    controls
                    width="250"
                    src={URL.createObjectURL(file)}>
                </audio>
                </>
            )}
            {
                processingState.map(s => (
                    <Checkpoint 
                        state={s.state} 
                        message={s.message}
                        key={s.message}
                        completed={s.completed}
                    />
                ))
            }
            <form onSubmit={handleSubmit}>
                <FileInput 
                    setData={setData} 
                    useFile={() => [file, setFile]} 
                    useProcessingState={() => [processingState, setProcessingState]}
                />
                <input 
                    type='submit'
                    value='Upload'
                    disabled={
                        file===null || 
                        processingState.find(
                            s => s.state === 'processing' || s.state === 'preprocessing' || s.state === 'processingSuccess'
                        )
                    }
                />
                <input
                    type='button'
                    value='Download'
                    disabled={!processingState.find(s => s.state === 'processingSuccess')}
                    onClick={() => downloadFile(`${file.name}.json`, JSON.stringify(data, null, 2))}
                />
            </form>
        </div>
    );
}

export default UploadSection;
