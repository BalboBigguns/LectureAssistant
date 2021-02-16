import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './FileInput.css';

const ffmpeg = createFFmpeg({ 
    log: true
});

const getFileName = (file) => {
    if (file === null) return null;
    let tokens = file.name.split('.');
    tokens.pop();
    return tokens.join('.');
};

const FileInput = ({setData, useFile, useProcessingState}) => {
    const [file, setFile] = useFile();
    const [processingState, setProcessingState] = useProcessingState();
    const [ready, setReady] = useState(false);

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
            setData(null);
            return;
        }
        setProcessingState([{
            state: 'preprocessing',
            message: 'Extracting audio, this may take a few minutes...'
        }]);

        try {
            ffmpeg.FS('writeFile', rawFile.name, await fetchFile(rawFile));
            await ffmpeg.run('-i', rawFile.name, '-ar', '16000', '-ac', '1', 'audio.wav');

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
            setData(null);
            let newState = processingState.filter(s => s.state !== 'preprocessing')
            newState.push({
                state: 'failure',
                message: 'An error occured when extracting audio, provided file may have wrong format or no audio track'
            });
            setProcessingState(newState);
        }
    };

    
    return (
        <>
        <input 
            type='file' 
            id='fileInput' 
            onChange={(e)=>triggerProcessing(e.target.files?.item(0))}
        />
        <label htmlFor='fileInput'>
            {!ready ? 'Loading...' : (file ? getFileName(file) : 'Choose file')}
        </label>
        </>
    )
}

export default FileInput;
