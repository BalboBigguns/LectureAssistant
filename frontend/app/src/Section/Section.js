import React from 'react';
import './Section.css';

const Section = React.forwardRef(({children, title, text}, ref) => {
    return (
        <section className='Section' ref={ref}>
            <h1>{title}</h1>
            {children}
        </section>
    );
});

export default Section;
