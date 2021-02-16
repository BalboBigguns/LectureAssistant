import React from 'react';

const AudioPlayer = ({file}) => {
    return (
        <audio
            controls
            width="250"
            src={URL.createObjectURL(file)}>
        </audio>
    );
}

export default React.memo(AudioPlayer);
