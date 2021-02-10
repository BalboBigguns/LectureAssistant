import React from 'react';
import './Section.css';

const Section = ({children, title, text}) => {
    return (
        <section className='Section'>
            <h1>{title}</h1>
            {children}
        </section>
    );
}

export default Section;
