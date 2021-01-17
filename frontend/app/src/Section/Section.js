import React from 'react';

const Section = ({children, title, text}) => {
    return (
        <section className='Section'>
            <h3>{title}</h3>
            <p>{children}</p>
        </section>
    );
}

export default Section;
