import React from 'react';
import './AppBar.css';

const AppBar = ({title}) => {
    return (
        <header className='AppBar'>
            <h1 className='Title'>
                {title}
            </h1>
        </header>
    );
}

export default AppBar;
