import React, {useContext} from 'react';
import classes from './Button.module.css';
import Icon from '../Icon/Icon';
import {GlobalContext} from "../../../context";

const Button = ({data}) => {
    const {controlMode} = useContext(GlobalContext);
    const requiredButtonClass = data.text === 'Submit'
        ? classes.submit
        : data.text
            ? classes.button
            : classes.iconButton;
    const requiredDisabledClass = !controlMode.status ? classes.disabled : '';

    return (
        <button
            style={data.style}
            className={`${requiredButtonClass} ${requiredDisabledClass}`}
            title={data.title}
            onClick={data.onClick}
            disabled={!controlMode.status}
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