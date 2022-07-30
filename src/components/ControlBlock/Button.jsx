import React, {useContext} from 'react';
import classes from './Button.module.css';
import Icon from './Icon';
import {GlobalContext} from '../../context';

const Button = ({data}) => {
    const {controlMode} = useContext(GlobalContext);

    const requiredButtonClass = data.text === 'Submit'
        ? classes.submit
        : data.text
            ? classes.button
            : classes.iconButton;
    const disabled = data.disabled ?? !controlMode.status;
    const requiredDisabledClass = disabled ? classes.disabled : '';

    return (
        <button
            style={data.style}
            className={`${requiredButtonClass} ${requiredDisabledClass}`}
            title={data.title}
            onClick={data.onClick}
            disabled={disabled}
        >
            {
                data.iconPath
                    ? <Icon path={data.iconPath} margin={data.text ? "auto 10px auto 0" : "auto"} />
                    : null
            }
            {
                data.text
                    ? <span className={classes.text}>{data.text}</span>
                    : null
            }
            {data.colorInput}
        </button>
    );
};

export default Button;