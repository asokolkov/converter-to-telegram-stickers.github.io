import React from 'react';
import classes from './ControlBlock.module.css';
import TextButton from "../UI/TextButton/TextButton";
import Icon from "../UI/Icon/Icon";
import ColorInput from "../UI/ColorInput/ColorInput";

import textIcon from '../../images/text.svg';
import bgIcon from '../../images/bg.svg';

const ControlBlock = () => {
    const [data, setData] = React.useState([
        {
            text: 'Add Text',
            title: 'Click on canvas to add text',
            disabled: false,
            onClick: null,
            Icon: <Icon path={textIcon} />
        },
        {
            text: 'Change background',
            title: 'Choose canvas background color',
            disabled: false,
            onClick: null,
            Icon: <Icon path={bgIcon} />,
            ColorInput: true
        },
        {
            text: 'Submit',
            title: 'Save image',
            disabled: false,
            onClick: null,
        },
    ]);

    return (
        <div className={classes.controlBlock}>
            <h1 className={classes.h1}>Shitlord's Image Editor</h1>
            <TextButton data={data[0]} />
            <TextButton data={data[1]} />
            <TextButton data={data[2]} />
        </div>
    );
};

export default ControlBlock;