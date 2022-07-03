import React, {useState} from 'react';
import './App.css';
import EditingBlock from '../EditingBlock/EditingBlock';
import ControlBlock from '../ControlBlock/ControlBlock';
import {GlobalContext} from '../../context';

function App() {
    const [color, setColor] = useState(null);
    const [status, setStatus] = useState(false);
    const [remove, setRemove] = useState(false);
    const [stage, setStage] = useState(null);

    return (
        <GlobalContext.Provider
            value={{
                controlMode: {status, setStatus},
                removeButton: {remove, setRemove},
                background: {color, setColor},
                stage: {stage, setStage}
            }}
        >
            <div id="App">
                <EditingBlock />
                <ControlBlock />
            </div>
        </GlobalContext.Provider>
    );
}

export default App;
