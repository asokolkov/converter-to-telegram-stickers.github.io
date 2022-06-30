import React from 'react';
import classes from './Icon.module.css';

const Icon = ({path, margin='auto 10px auto 0'}) => {
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