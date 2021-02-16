import React, { useContext } from 'react';
import CanvasJSReact from '../CanvasJS/canvasjs.react';
import ThemeContext from '../../Contexts/Theme';

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const RateRangesChart = ({rate}) => {
    const rateAvg = Math.round(rate.total_wpm_average);
    const theme = useContext(ThemeContext);

    const options = {
        zoomEnabled: true,
	    animationEnabled: true,
        theme: "light2",
        title: {
            text: "Speech Rate Ranges",
            fontSize: theme.chartTitleFontSize,
        },
        data: [{
            type: "rangeBar",
            yValueFormatString: "#0.#",
            indexLabel: "{y[#index]}",
            toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
            fillOpacity: .3,
            dataPoints: [
                { x: 0, y:[100, 130], label: "Presentation", color: theme.main },
                { x: 1, y:[130, 170], label: "Lecture", color: theme.main },
                { x: 2, y:[150, 200], label: "Conversation", color: theme.main },
            ]
        }],
        axisY: {
            title: "Words per minute",
            stripLines:[
                {                
                    value: rateAvg,
                    label: "Your score",
				    labelPlacement: "inside",
                    color: theme.main,
                    labelFontColor: theme.main,
                    showOnTop: true,
                    thickness: 5
                }
            ],
            valueFormatString:"###"
        },
        axisX: {
            title: "Type of speech"
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

export default RateRangesChart;