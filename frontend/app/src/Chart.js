import React from 'react';
import {Line} from 'react-chartjs-2';


const LineChart = (props) => {
    const data = {
        labels: props.data.time ,
        datasets: [
            {
                label: `F0 over time. Std: ${props.data.std}`,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: props.data.f0
            }
        ]
    };

    const options = {
        animation: {
            duration: 0 // general animation time
        },
        hover: {
            animationDuration: 0 // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize,
        elements: {
            line: {
                tension: 0 // disables bezier curves
            }
        }
    };

    return (
        <Line
            data={data}
            options={options}
        />
    )
};

// class LineChart extends React.Component {
//     constructor(props) {
//         super(props);
//         this.chartRef = React.createRef();
//     }
  
//     componentDidUpdate() {
//         this.myChart.data.labels = this.props.data.map(d => d.time);
//         this.myChart.data.datasets[0].data = this.props.data.map(d => d.value);
//         this.myChart.update();
//     }
  
//     componentDidMount() {
//         this.myChart = new Chart(this.chartRef.current, {
//             type: 'scatter',
//             options: {
//                 scales: {
//                     xAxes: [
//                         {
//                             type: 'category',
//                         }
//                     ],
//                     yAxes: [
//                         {
//                             ticks: {
//                                 min: 0
//                             }
//                         }
//                     ]
//                 },
//                 animation: {
//                     duration: 0 // general animation time
//                 },
//                 hover: {
//                     animationDuration: 0 // duration of animations when hovering an item
//                 },
//                 responsiveAnimationDuration: 0, // animation duration after a resize,
//                 elements: {
//                     line: {
//                         tension: 0 // disables bezier curves
//                     }
//                 }
//             },
//             data: {
//                 labels: this.props.data.time,
//                 datasets: [{
//                     label: this.props.title,
//                     data: this.props.data.f0,
//                     fill: 'none',
//                     backgroundColor: this.props.color,
//                     pointRadius: 1,
//                     borderColor: this.props.color,
//                     borderWidth: 1,
//                     lineTension: 0,
//                     yAxisID: "F0 value"
//                 }]
//             }
//         });
//     }
  
//     render() {
//         return <canvas ref={this.chartRef} />;
//     }
// }

export default LineChart;