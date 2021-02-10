import React from 'react';

const theme = {
    main: '#4BC0C0',
    accents: {
        bad: {
            // main: '#ff9999',
            // secondary: '#990000'
            main: '#fddcd7',
            secondary: '#b56d6d'
        },
        medium: {
            // main: '#ffff99',
            // secondary: '#808000'
            main: '#faf9d1',
            secondary: '#c9c969'
        },
        good: {
            // main: '#b3ff99',
            // secondary: '#4d9900'
            main: '#dffed5',
            secondary: '#6b995c'
        }
    },
};

const ThemeContext = React.createContext(theme);

export default ThemeContext;