import React, {useEffect, useState} from 'react';
import CanvasJSReact from './CanvasJS/canvasjs.react';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const LineChart = ({data, title, xLabel, yLabel}) => {
    const [xAxisData, setXAxisData] = useState([]);

    useEffect(() => {
        const { values, frame_length} = data;
        const dataSize = values.length;
        const xData = []

        for(let i = 0; i < dataSize * frame_length; i += frame_length) {
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
        theme: 'light2',
        title: {
            text: title
        },
        data: [{				
            type: 'line',
            color: '#4BC0C0',
            dataPoints: points
        }],
        axisY: {
            title: yLabel
        },
        axisX: {
            title: xLabel
        }
    }
    
    return (
        <CanvasJSChart
            options={options}
        />
    );
};

export default LineChart;