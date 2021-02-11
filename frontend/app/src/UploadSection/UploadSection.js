import React, { useState, useEffect } from 'react';
import Checkpoint from '../Checkpoint/Checkpoint';
import FileInput from '../FileInput/FileInput';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import './UploadSection.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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


const UploadSection = ({useData, showResults}) => {
    const [data, setData] = useData();
    const [file, setFile] = useState(null);
    const [processingState, setProcessingState] = useState([]);
    const [sessionId, setSessionId] = useState();
    
    
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
        const session = uuidv4()
        setSessionId(session);        
        axios.post(`${process.env.REACT_APP_API_URL}/upload/subscribe`, {id: session});
        serverEventSource.addEventListener(session, processingHandler, false);
        serverEventSource.addEventListener('error', errorHandler, false);
        return () => {
            axios.delete(`${process.env.REACT_APP_API_URL}/upload/subscribe`, {id: session});
            serverEventSource.removeEventListener(session, processingHandler);
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
            formData,
            {
                headers: {
                    'Authorization': sessionId
                }
            }
        )
        .then(res => {
            setData(res.data);
            showResults();
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
                <AudioPlayer file={file}/>
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
