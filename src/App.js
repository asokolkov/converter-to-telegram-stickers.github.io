import React from "react";
import "./styles/App.css";
import EditingBlock from "./components/EditingBlock";
import ControlBlock from "./components/ControlBlock/ControlBlock";

function App() {
    return (
        <div id="App">
            <EditingBlock />
            <ControlBlock />
        </div>
    );
}

export default App;
