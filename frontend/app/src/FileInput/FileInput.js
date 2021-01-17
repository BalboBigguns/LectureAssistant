import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import Checkpoint from '../Checkpoint/Checkpoint';
import './FileInput.css';
import axios from 'axios';

const ffmpeg = createFFmpeg({ 
    log: true
});

const FileInput = ({onData, useProcessing}) => {
    const [ready, setReady] = useState(false);
    const [file, setFile] = useState(null);
    const [processingState, setProcessingState] = useProcessing;


    const load = async () => {
        if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
        }
        setReady(true);
    };

    useEffect(() => {
        load();
    }, []);

    const triggerProcessing = async (rawFile) => {
        if (!rawFile){
            setProcessingState([]);
            setFile(null);
            onData(null);
            return;
        }
        setProcessingState([{
            state: 'preprocessing',
            message: 'Extracting audio, this may take a few minutes...'
        }]);

        try {
            ffmpeg.FS('writeFile', rawFile.name, await fetchFile(rawFile));
            await ffmpeg.run('-i', rawFile.name, '-ar', '8000', '-ac', '1', 'audio.wav');

            const data = ffmpeg.FS('readFile', 'audio.wav');
            const processedFile = new File([data], `${rawFile.name}.wav`, {type: 'audio/wav'});
            setFile(processedFile);   
            setProcessingState(processingState => {
                let newState = processingState.filter(s => s.state !== 'preprocessing')
                newState.push({
                    state: 'preprocessingSuccess',
                    message: 'Audio extraction is completed, you can upload the file now'
                });
                return newState;
            });
        } catch (e) {
            console.log(e);
            setFile(null);
            onData(null);
            let newState = processingState.filter(s => s.state !== 'preprocessing')
            newState.push({
                state: 'failure',
                message: 'An error occured when extracting audio, provided file may have wrong format or no audio track'
            });
            setProcessingState(newState);
        }
    };

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
        // .then(response => response.json())
        .then(res => {
            onData(res.data);
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

    const getFileName = () => {
        if (file === null) return null;
        let tokens = file.name.split('.');
        tokens.pop();
        return tokens.join('.');
    };


    return ready ? (
        <div className='FileInput'>
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
                <input 
                    type='file' 
                    id='fileInput' 
                    onChange={(e)=>triggerProcessing(e.target.files?.item(0))}
                />
                <label htmlFor='fileInput'>
                    {file ? getFileName() : 'Choose file'}
                </label>
                <input 
                    type='submit'
                    value='Upload'
                    disabled={file===null || processingState.find(s => s.state === 'processing' || s.state === 'preprocessing' || s.state === 'processingSuccess')}
                />
            </form>
        </div>
    ) : 
    (
        <p>Loading ...</p>
    )
}

export default FileInput;
