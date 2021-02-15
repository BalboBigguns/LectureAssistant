import React, {useContext} from 'react';
import CanvasJSReact from '../CanvasJS/canvasjs.react';
import ThemeContext from '../Contexts/Theme';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const LUFS_THRESHOLD = -70;

const VolumeChart = ({volume}) => {
    const theme = useContext(ThemeContext);

    const getSecondaryColor = (volume) => {
        if (volume < 0.9) {
            return theme.accents.bad.secondary;
        }
        
        if (volume < 1.1) {
            return theme.accents.medium.secondary;
        }
    
        return theme.accents.good.secondary;
    };

    const options = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Volume"
        },
        axisY: {
            title: "LUFS",
            // stripLines:[
            //     {                
            //         startValue: 0,
            //         endValue: 0.9,
            //         color: theme.accents.bad.main
            //     },
            //     {                
            //         startValue: 0.9,
            //         endValue: 1.1,
            //         color: theme.accents.medium.main
            //     },
            //     {                
            //         startValue: 1.1,
            //         endValue: 3,
            //         color: theme.accents.good.main
            //     }
            // ]
            minimum: LUFS_THRESHOLD,
            maximum: 0
        },
        dataPointWidth: 100,
        data: [{        
            type: "rangeColumn",  
            dataPoints: [      
                { y: [LUFS_THRESHOLD, volume],  label: "your score", color: getSecondaryColor(volume), indexLabel: `${volume}`, indexLabelFontWeight: "bold" },
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
