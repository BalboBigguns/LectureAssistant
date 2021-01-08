import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import Checkpoint from '../Checkpoint/Checkpoint';
import './FileInput.css';

const ffmpeg = createFFmpeg({ 
    log: true,
    progress: p => console.log(p)
});

const FileInput = ({onData}) => {
    const [ready, setReady] = useState(false);
    const [file, setFile] = useState(null);
    const [processingState, setProcessingState] = useState([]);


    const load = async () => {
        await ffmpeg.load();
        setReady(true);
    };

    useEffect(() => {
        load();
    }, []);

    const triggerProcessing = async (rawFile) => {
        if (!rawFile){
            setProcessingState([]);
            setFile(null);
            return;
        }
        setProcessingState([{
            state: 'loading',
            message: 'Extracting audio, this may take a few minutes...'
        }]);

        try {
            ffmpeg.FS('writeFile', rawFile.name, await fetchFile(rawFile));
            await ffmpeg.run('-i', rawFile.name, '-ar', '16000', '-ac', '1', 'audio.wav');

            const data = ffmpeg.FS('readFile', 'audio.wav');
            const processedFile = new File([data], `${rawFile.name}.wav`, {type: 'audio/wav'});
            setFile(processedFile);   
            setProcessingState(processingState => {
                let newState = processingState.filter(s => s.state !== 'loading')
                newState.push({
                    state: 'success',
                    message: 'Audio extraction is completed, you can upload the file now'
                });
                return newState;
            });
        } catch (e) {
            console.log(e);
            setFile(null);
            let newState = processingState.filter(s => s.message !== 'Extracting audio')
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
            state: 'loading',
            message: 'Uploading and analysing file, this may take a few minutes...'
        }])
        let newState = processingState.filter(s => s.state !== 'loading')
        fetch(`${process.env.REACT_APP_API_URL}/upload`,
            {
                method: 'POST',
                body: formData
            })
        .then(response => response.json())
        .then(data => {
            onData(data);
            newState.push({
                state: 'success',
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
                    disabled={file===null || processingState.find(s => s.state === 'loading')}
                />
            </form>
        </div>
    ) : 
    (
        <p>Loading ...</p>
    )
}

export default FileInput;
