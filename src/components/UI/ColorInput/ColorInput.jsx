import React from 'react';
import classes from './ColorInput.module.css';

const ColorInput = ({disabled}) => {
    return (
        <input className={classes.colorInput} type="color" disabled={disabled} />
    );
};

export default ColorInput;