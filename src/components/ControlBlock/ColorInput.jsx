import React, {useContext} from 'react';
import classes from './ColorInput.module.css';
import {GlobalContext} from '../../context';

const ColorInput = ({onBlur, onInput}) => {
    const {controlMode} = useContext(GlobalContext);

    return (
        <input
            className={classes.colorInput}
            type="color"
            disabled={!controlMode.status}
            onBlur={onBlur}
            onInput={onInput}
        />
    );
};

export default ColorInput;