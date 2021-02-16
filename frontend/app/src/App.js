import './App.css';
import React, {useState, useRef} from 'react';
import {
    AppBar,
    Section,
    Footer,
    SideBySideWrapper
} from './Layouts';
import {
    UploadSection,
    Definition
} from './Elements';
import { 
    StepAreaChart,
    RateRangesChart,
    PitchScaleChart,
    AverageRateChart,
    VolumeChart 
} from './Charts';

const isMobile = () => /Mobi/.test(navigator.userAgent);

const App = () => {
    const [data, setData] = useState(null);
    const resultsRef = useRef(null);
    
    const scrollToResults = () => {
        const yOffset = -50; 
        const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    };

    return (
        <div className='App'>
            <AppBar title='Lecture Assistant'/>
            <Section title='Welcome to Lecture Assistant!'>
                <p>Feel free to use this site to analyze your speech.</p>
            </Section>
            <hr/>
            { isMobile() ? (
                <p>
                    Sorry, this page does not work on mobile devices. Try it out on your desktop.
                </p>
            ) : (
                <>
                <UploadSection useData={() => [data, setData]} showResults={scrollToResults}/>
                { data && 
                    <>
                    <Section title='Pitch' ref={resultsRef}>
                        <Definition>
                            The relative highness or lowness of a tone as perceived by the ear, 
                            which depends on the number of vibrations per second produced by the vocal cords.
                        </Definition>
                        <SideBySideWrapper
                            left={
                                <>
                                    <p>
                                    To make your speech more engaging, it is recommended to use a broad range of tones. This 
                                    way, your lecture is perceived as more engaging and more interesting to listen to. To do so
                                    consider modulating your tone of speech. The easiest way to do it can be achieved by showing more enthusiasm
                                    while speaking. The correlation between enthusiastic, charismatic speech and high values of pitch dynamism has
                                    been scientifically proven. 
                                    </p>
                                    <p>
                                    The amount of pitch modulation in your voice can be measured as <b>Pitch Dynamic Quotient - PDQ</b>. This metric
                                    shows how much your tone differs from its average in arbitrary intervals ({data.f0.frame_length / 1000}s).
                                    </p>
                                    <p>
                                        <b><i>Lecture Assistant</i></b> analyzed multiple audio recordings and based on the results the following scale
                                        can be applied to judge your performance:
                                    </p>
                                </>
                            }
                            right={
                                <PitchScaleChart f0={Math.round((data.f0.avg + Number.EPSILON) * 100) / 100}/>
                            }
                        />
                        <SideBySideWrapper
                            left={
                                <StepAreaChart
                                    data={data.f0}
                                    title={`Pitch Dynamism Quotient Over Time`}
                                    xLabel='Time [s]'
                                    yLabel='PDQ'
                                />
                            }
                            right={
                                <p>
                                    Here is a distribution of PDQ calculated in <b>{data.f0.frame_length / 1000}</b> seconds chunks.
                                </p>
                            }
                        />
                        
                    </Section>
                    <hr/>
                    <Section title='Rate'>
                        <Definition>
                            Number of words spoken per minute.
                        </Definition>
                        <SideBySideWrapper
                            left={
                                <>
                                    <p>
                                        Speed of talking is most often measured by counting words spoken in every minute. This <b>words per minute (wpm)
                                        </b> unit is a very handy way to judge how fast somebody speaks. 
                                    </p>
                                    <p>
                                        The speed at which you talk has a huge influence on how the audience perceives you and your speech. It’s important 
                                        therefore to understand your speaking rate and how to alter it depending on the type of speech you are delivering.
                                    </p>
                                    <p>
                                        To give you some reference, here is your score compared to speech rates considered most appropriate for different 
                                        types of speeches.
                                    </p>
                                </>
                            }
                            right={
                                <RateRangesChart rate={data.rate}/>
                            }
                        />
                        <SideBySideWrapper
                            left={
                                <StepAreaChart
                                    data={data.rate.words_each_second}
                                    title={`Words Each Second - Total ${data.rate.words_count} words`}
                                    xLabel='Time [s]'
                                    yLabel='Number of words'
                                />
                            }
                            right={
                                <>
                                    <p>
                                        Remember, there is no single best speaking rate. To choose the best one, you should consider what is the character 
                                        of a lecture you want to give. If it is more like a recap or has a more presentational style, you should go for a bit 
                                        faster pace, probably in conversational range. If, on the other hand, the nature of your lecture is explanatory and you 
                                        expect the audience to struggle with understanding the topic, a slower pace may provide better results.
                                    </p>
                                    <p>
                                        Below you can find a distribution of the number of words spoken at each second:
                                    </p>
                                </>
                            }
                        />
                        <SideBySideWrapper
                            left={
                                <p>
                                    The next chart shows how fast was your speech on average around each second of the recording. These values are 
                                    calculated based on past and future 5 seconds of speech at each instance of the recording. It means that you should 
                                    not be concerned too much if peaks or troughs reach undesirable values. Do not be afraid to speed up or slow down when 
                                    necessary but pay attention to the overall tempo. The total average may give you a hint about that. You should try to
                                    aim for a green range of 130 to 170 wpm, alternatively landing in a yellow range if the content of your lecture demands
                                    that.
                                </p>
                            }
                            right={
                                <AverageRateChart
                                    data={data.rate.average_wpm}
                                    title={`Average WPM Each Second`}
                                    xLabel='Time [s]'
                                    yLabel='Average wpm'
                                    total_wpm={Math.round(data.rate.total_wpm_average)}
                                />
                            }
                        />
                    </Section>
                    <hr/>
                    <Section title='Volume'>
                        <Definition>
                            Attribute of sound that determines the intensity of auditory sensation produced.
                        </Definition>
                        <SideBySideWrapper
                            left={
                                <>
                                    <p>
                                        To make sure the volume level is high enough (but not too high) and your words are clearly audible take a look at 
                                        the volume chart. The <b>LUFS</b> - <i>Loudness Unit Full Scale</i>, calculation has been applied to measure loudness. 
                                    </p>
                                    <p>
                                        The scale shows how your recording volume level corresponds to standards used across the audio-related industry. To get 
                                        the best results, try to adjust the volume to match the green region (12 - 16 LUFS is the sweetspot). It is not necessary 
                                        to get your loudness perfectly but having it in red regions can affect your recording quality quite seriously so keep that 
                                        in mind.
                                    </p>
                                </>
                            }
                            right={
                                <VolumeChart volume={Math.round((data.volume.value + Number.EPSILON) * 100) / 100}/>
                            }
                        />
                    </Section>
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
