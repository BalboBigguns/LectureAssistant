import React from 'react';
import './Section.css';

const Section = React.forwardRef(({children, title}, ref) => {
    return (
        <section className='Section' ref={ref}>
            <h1 className='SectionTitle'>{title}</h1>
            {children}
        </section>
    );
});

export default Section;
