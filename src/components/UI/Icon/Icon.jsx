import React from 'react';
import classes from './Icon.module.css';

const Icon = ({path}) => {
    return (
        <img
            className={classes.icon}
            src={path}
            alt="Icon"
            draggable="false"
        />
    );
};

export default Icon;