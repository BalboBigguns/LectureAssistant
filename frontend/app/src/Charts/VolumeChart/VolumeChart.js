import React, {useContext} from 'react';
import CanvasJSReact from '../CanvasJS/canvasjs.react';
import ThemeContext from '../../Contexts/Theme';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const LUFS_THRESHOLD = -70;

const VolumeChart = ({volume}) => {
    const theme = useContext(ThemeContext);

    const getSecondaryColor = (volume) => {
        if ((volume < -30) || (volume > -5)) {
            return theme.accents.bad.secondary;
        }
        
        if ((volume < -20) || (volume > -10)) {
            return theme.accents.medium.secondary;
        }
    
        return theme.accents.good.secondary;
    };

    const options = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Volume Level"
        },
        axisY: {
            title: "LUFS",
            stripLines:[
                {                
                    startValue: -70,
                    endValue: -30,
                    color: theme.accents.bad.main
                },
                {                
                    startValue: -30,
                    endValue: -20,
                    color: theme.accents.medium.main
                },
                {                
                    startValue: -20,
                    endValue: -10,
                    color: theme.accents.good.main
                },
                {                
                    startValue: -10,
                    endValue: -5,
                    color: theme.accents.medium.main
                },
                {                
                    startValue: -5,
                    endValue: 0,
                    color: theme.accents.bad.main
                }
            ],
            maximum: 0,
            minimum: LUFS_THRESHOLD
        },
        dataPointWidth: 100,
        data: [{        
            type: "rangeColumn",  
            toolTipContent: "{y[1]} LUFS",
            dataPoints: [      
                { y: [LUFS_THRESHOLD, volume],  label: "your score", color: getSecondaryColor(volume), indexLabelFontWeight: "bold" },
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
}

export default VolumeChart;
