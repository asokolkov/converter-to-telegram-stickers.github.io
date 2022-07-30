import React from 'react';
import classes from './Icon.module.css';

const Icon = ({path, margin}) => {
    return (
        <img style={{margin: margin}}
            className={classes.icon}
            src={path}
            alt=""
            draggable="false"
        />
    );
};

export default Icon;