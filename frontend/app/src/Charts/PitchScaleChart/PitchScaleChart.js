import React, { useContext } from 'react';
import CanvasJSReact from '../CanvasJS/canvasjs.react';
import ThemeContext from '../../Contexts/Theme';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const PitchScaleChart = ({f0}) => {
    const theme = useContext(ThemeContext);

    const getSecondaryColor = (f0) => {
        if (f0 < 0.9) {
            return theme.accents.bad.secondary;
        }
        
        if (f0 < 1.1) {
            return theme.accents.medium.secondary;
        }
    
        return theme.accents.good.secondary;
    };

    const options = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Pitch Dynamism Scale"
        },
        axisY: {
            title: "PDQ",
            stripLines:[
                {                
                    startValue: 0,
                    endValue: 0.9,
                    color: theme.accents.bad.main
                },
                {                
                    startValue: 0.9,
                    endValue: 1.1,
                    color: theme.accents.medium.main
                },
                {                
                    startValue: 1.1,
                    endValue: 3,
                    color: theme.accents.good.main
                }
            ]
        },
        data: [{        
            type: "column",  
            dataPoints: [      
                { y: 0.9, label: "bad", color: theme.accents.bad.secondary},
                { y: f0,  label: "your score", color: getSecondaryColor(f0), indexLabel: `Score: ${f0}`, indexLabelFontWeight: "bold" },
                { y: 1.5,  label: "good", color: theme.accents.good.secondary},
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

