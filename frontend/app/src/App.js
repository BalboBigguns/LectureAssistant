import './App.css';
import React, {useState, useEffect} from 'react';
import FileInput from './FileInput/FileInput';
import LineChart from './LineChart';
import AppBar from './AppBar/AppBar';
import Section from './Section/Section';
import Footer from './Footer/Footer';

const isMobile = () => /Mobi/.test(navigator.userAgent);
const serverEventSource = new EventSource(`${process.env.REACT_APP_API_URL}/stream`);

const App = () => {
    const [data, setData] = useState(null);
    const [processingState, setProcessingState] = useState([]);


    const processingHandler = (event) => {
        const data = JSON.parse(event.data);
        const percent = Math.round((data.fraction + Number.EPSILON) * 100);
        console.log(`${(new Date()).toISOString()}# Processed: ${percent}%`);

        setProcessingState(state => (
            state.map(s => {
                if(s.state === 'processing') {
                    s.completed = percent;
                }

                return s;
            })
        ));
    };

    const errorHandler = (event) => {
        console.log("Failed to connect to event stream. Is Redis running?");
    };

    useEffect(() => {
        serverEventSource.addEventListener('processing', processingHandler, false);
        serverEventSource.addEventListener('error', errorHandler, false);
        return () => {
            serverEventSource.removeEventListener('processing', processingHandler);
            serverEventSource.removeEventListener('error', errorHandler);
        }
    }, [])
    

    return (
        <div className='App'>
            <AppBar title='Lecture Assistant'/>
            <Section title='Welcome to Lecture Assistant!'>
                Feel free to use this site to analyze your speech.
            </Section>
            <hr/>
            { isMobile() ? (
                <p>
                    Sorry, this page does not work on mobile devices. Try it out on your desktop.
                </p>
            ) : (
                <>
                <FileInput onData={setData} useProcessing={[processingState, setProcessingState]}/>
                { data && 
                    <>
                    <div className='Chart'>
                        <LineChart
                            data={data.f0}
                            title={`F0 over time. Std: ${Number.parseFloat(data.f0.std).toFixed(2)}`}
                            xLabel='Time [s]'
                            yLabel='Voice pitch [Hz]'
                        />
                    </div>
                    <hr/>
                    <div className='Chart'>
                        <LineChart
                            data={data.volume}
                            title={`Volume over time. Std: ${Number.parseFloat(data.volume.std).toFixed(2)}`}
                            xLabel='Time [s]'
                            yLabel='Voice volume'
                        />
                    </div>
                    <hr/>
                    <div className='Chart'>
                        <LineChart
                            data={data.rate.words_each_second}
                            title={`Words spoken at each second. Total word count: ${data.rate.words_count}`}
                            xLabel='Time [s]'
                            yLabel='Number of words'
                        />
                    </div>
                    <hr/>
                    <div className='Chart'>
                        <LineChart
                            data={data.rate.average_wpm}
                            title={`Average wpm at each second. Total wpm average: ${Number.parseFloat(data.rate.total_wpm_avarage).toFixed(2)}`}
                            xLabel='Time [s]'
                            yLabel='Average wpm'
                        />
                    </div>
                    </>
                }
                </>
            )}
            <hr/>
            <Footer/>
        </div>
    );
}

export default App;
