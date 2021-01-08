import './App.css';
import React, {useState} from 'react';
import FileInput from './FileInput/FileInput';
import LineChart from './Chart';
// const inputData = require('./data.json')

const App = () => {
    const [data, setData] = useState({});  

    return (
        <div className="App">
            <FileInput onData={setData}/>
            <LineChart data={data}/>
        </div>
    );
}

export default App;
