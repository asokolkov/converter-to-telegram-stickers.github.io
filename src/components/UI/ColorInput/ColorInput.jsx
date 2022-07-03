import React, {useContext} from 'react';
import classes from './ColorInput.module.css';
import {GlobalContext} from "../../../context";

const ColorInput = ({onChange, onInput}) => {
    const {controlMode} = useContext(GlobalContext);

    return (
        <input
            className={classes.colorInput}
            type="color"
            disabled={!controlMode.status}
            onChange={onChange}
            onInput={onInput}
        />
    );
};

export default ColorInput;