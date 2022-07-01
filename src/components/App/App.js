import React, {useRef} from "react";
import "./App.css";
import EditingBlock from "../EditingBlock/EditingBlock";
import ControlBlock from "../ControlBlock/ControlBlock";

function App() {
    const stageRef = useRef(null);

    return (
        <div id="App">
            <EditingBlock stageRef={stageRef} />
            <ControlBlock stageRef={stageRef} />
        </div>
    );
}

export default App;
