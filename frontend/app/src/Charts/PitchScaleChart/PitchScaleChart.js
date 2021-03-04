import React, { useContext } from 'react';
import CanvasJSReact from '../CanvasJS/canvasjs.react';
import ThemeContext from '../../Contexts/Theme';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const THRESHOLD_LEVELS = {
    LOW: {
        start: 0,
        end: 0.15
    },
    MEDIUM: {
        start: 0.15,
        end: 0.20
    },
    HIGH: {
        start: 0.20,
        end: 10 // actually could be inf but it doesn't work with the chart library
    }
};


const PitchScaleChart = ({f0}) => {
    const theme = useContext(ThemeContext);

    const getSecondaryColor = (f0) => {
        if (f0 < THRESHOLD_LEVELS.LOW.end) {
            return theme.accents.bad.secondary;
        }
        
        if (f0 < THRESHOLD_LEVELS.MEDIUM.end) {
            return theme.accents.medium.secondary;
        }
    
        return theme.accents.good.secondary;
    };

    const options = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Pitch Dynamism Scale",
            fontSize: theme.chartTitleFontSize
        },
        axisY: {
            title: "PDQ",
            stripLines:[
                {                
                    startValue: THRESHOLD_LEVELS.LOW.start,
                    endValue: THRESHOLD_LEVELS.LOW.end,
                    color: theme.accents.bad.main
                },
                {                
                    startValue: THRESHOLD_LEVELS.MEDIUM.start,
                    endValue: THRESHOLD_LEVELS.MEDIUM.end,
                    color: theme.accents.medium.main
                },
                {                
                    startValue: THRESHOLD_LEVELS.HIGH.start,
                    endValue: THRESHOLD_LEVELS.HIGH.end,
                    color: theme.accents.good.main
                }
            ]
        },
        data: [{        
            type: "column",  
            dataPoints: [      
                { y: 0.1, label: "bad", color: theme.accents.bad.secondary},
                { y: f0,  label: "your score", color: getSecondaryColor(f0), indexLabel: `Score: ${f0}`, indexLabelFontWeight: "bold" },
                { y: 0.25,  label: "good", color: theme.accents.good.secondary},
            ]
        }]
    };

    return (
        <div className='Chart'>
            <CanvasJSChart
                options={options}
            />
        </div>
    );
};

export default PitchScaleChart;

