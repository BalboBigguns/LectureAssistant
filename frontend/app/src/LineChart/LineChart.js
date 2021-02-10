import React, {useEffect, useState, useContext} from 'react';
import CanvasJSReact from '../CanvasJS/canvasjs.react';
import ThemeContext from '../Contexts/Theme';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const addLegendItem = (options, label, color) => {
    options.data.push(
        {
            type:'rangeArea',
            axisXType: "secondary",
            name: label,
            color: color,
            toolTipContent: null,
            showInLegend: true,
            markerSize: 0,
            dataPoints:[{x:0, y:null}]
          }
    );
};

const LineChart = ({data, title, xLabel, yLabel, ...rest}) => {
    const [xAxisData, setXAxisData] = useState([]);
    const theme = useContext(ThemeContext);


    useEffect(() => {
        const { values, frame_length} = data;
        const dataSize = values.length;
        const xData = []

        for(let i = 0; i < dataSize * frame_length; i += frame_length) {
            xData.push(i/1000);
        }

        setXAxisData(xData);
    }, [data])

    const getSecondaryColor = (wpm) => {
        if ((wpm > 100 && wpm < 130) || (wpm > 170 && wpm < 200)) {
            return theme.accents.medium.secondary;
        }
        
        if (wpm > 130 && wpm < 170) {
            return theme.accents.good.secondary;
        }
    
        return theme.accents.bad.secondary;
    };

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
            type: "line",
            color: theme.main,
            dataPoints: points,
            markerSize: 0
        }],
        axisY: {
            title: yLabel,
            stripLines: [
                {
                    startValue: 0,
                    endValue: 100,
                    color: theme.accents.bad.main,
                },
                {                
                    startValue: 100,
                    endValue: 130,                
                    color: theme.accents.medium.main        
                },
                {
                    startValue: 130,
                    endValue: 170,                
                    color: theme.accents.good.main    
                },
                {
                    startValue: 170,
                    endValue: 200,                
                    color: theme.accents.medium.main    
                },
                {
                    startValue: 200,
                    endValue: 300,
                    color: theme.accents.bad.main
                },
                {                
                    value: rest.total_wpm,
                    label: `Average wpm: ${rest.total_wpm}`,
                    labelPlacement:"inside",
                    color: getSecondaryColor(rest.total_wpm),
                    labelFontColor: getSecondaryColor(rest.total_wpm),
                    thickness: 2
                }
            ]
        },
        axisX: {
            title: xLabel
        },
        axisX2: {
            title: "",
            tickLength: 2,
            margin:0,
            lineThickness:0,
            minimum:0,
            maximum:0,
            valueFormatString:" ",
        }
    }

    addLegendItem(options, "Ideal tempo", theme.accents.good.main);
    addLegendItem(options, "Make sure it's appropriate for the content", theme.accents.medium.main);
    addLegendItem(options, "Too fast or too slow", theme.accents.bad.main);
    
    return (
        <div className='Chart'>
            <CanvasJSChart
                options={options}
            />
        </div>
    );
};

export default LineChart;