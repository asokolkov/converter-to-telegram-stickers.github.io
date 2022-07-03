import React from 'react';
import classes from './ColorInput.module.css';

const ColorInput = ({disabled, onChange, onInput}) => {
    return (
        <input
            className={classes.colorInput}
            type="color"
            disabled={disabled}
            onChange={onChange}
            onInput={onInput}
        />
    );
};

export default ColorInput;