import React from 'react';
import classes from './TextButton.module.css';
import ColorInput from "../ColorInput/ColorInput";

const TextButton = ({data}) => {
    const requiredButtonClass = data.text === 'Submit' ? classes.submit : classes.button;
    const requiredDisabledClass = data.disabled ? classes.disabled : '';

    return (
        <button
            className={`${requiredButtonClass} ${requiredDisabledClass}`}
            title={data.title}
            onClick={data.onClick}
            disabled={data.disabled}
        >
            {data.Icon}
            {data.ColorInput ? <ColorInput disabled={data.disabled}/> : null}
            <span className={classes.text}>{data.text}</span>
        </button>
    );
};

export default TextButton;