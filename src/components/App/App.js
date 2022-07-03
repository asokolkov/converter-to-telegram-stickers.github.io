import React, {useState} from "react";
import "./App.css";
import EditingBlock from "../EditingBlock/EditingBlock";
import ControlBlock from "../ControlBlock/ControlBlock";
import {GlobalContext} from "../../context";

function App() {
    const [color, setColor] = useState(null);
    const [status, setStatus] = useState(false);

    return (
        <GlobalContext.Provider
            value={{
                controlMode: {status, setStatus},
                background: {color, setColor}
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
