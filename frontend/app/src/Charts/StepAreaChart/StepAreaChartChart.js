import React, {useEffect, useState, useContext} from 'react';
import CanvasJSReact from '../CanvasJS/canvasjs.react';
import ThemeContext from '../../Contexts/Theme';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const StepAreaChart = ({data, title, xLabel, yLabel}) => {
    const [xAxisData, setXAxisData] = useState([]);
    const theme = useContext(ThemeContext);

    useEffect(() => {
        const { values, frame_length} = data;
        const dataSize = values.length;
        const xData = []

        for (let i = 0; i < dataSize * frame_length; i += frame_length) {
            xData.push(i/1000);
        }

        setXAxisData(xData);
    }, [data])

    const points = data.values.map((value, idx) => (
        {
            x: xAxisData[idx],
            y: value
        }
    ))

    
    const options = {
        zoomEnabled: true,
	    animationEnabled: true,
        theme: "light2",
        title: {
            text: title
        },
        data: [{				
            type: "stepArea",
            color: theme.main,
            dataPoints: points,
            markerSize: 0
        }],
        axisY: {
            title: yLabel
        },
        axisX: {
            title: xLabel
        }
    }

    
    return (
        <div className='Chart'>
            <CanvasJSChart
                options={options}
            />
        </div>
    );
};

export default StepAreaChart;