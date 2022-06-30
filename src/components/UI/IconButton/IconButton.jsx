import React from 'react';
import classes from './IconButton.module.css';
import Icon from "../Icon/Icon";

const IconButton = ({data, shift}) => {
    const requiredDisabledClass = data.disabled ? classes.disabled : '';

    return (
        <button
            style={{right: shift.right, bottom: shift.bottom}}
            className={`${classes.button} ${requiredDisabledClass}`}
            title={data.title}
            onClick={data.onClick}
            disabled={data.disabled}
        >
            <Icon path={data.iconPath} margin={'auto'} />
        </button>
    );
};

export default IconButton;