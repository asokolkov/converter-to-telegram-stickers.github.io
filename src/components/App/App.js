import React, {useState} from "react";
import "./App.css";
import EditingBlock from "../EditingBlock/EditingBlock";
import ControlBlock from "../ControlBlock/ControlBlock";
import {BackgroundContext} from "../../context";

function App() {
    const [color, setColor] = useState(null);

    return (
        <BackgroundContext.Provider value={{color, setColor}}>
            <div id="App">
                <EditingBlock />
                <ControlBlock />
            </div>
        </BackgroundContext.Provider>
    );
}

export default App;
