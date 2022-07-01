import React from 'react';
import classes from './ControlBlock.module.css';
import TextButton from '../UI/TextButton/TextButton';
import Icon from '../UI/Icon/Icon';
import IconButton from '../UI/IconButton/IconButton';

import textIcon from '../../images/text.svg';
import bgIcon from '../../images/bg.svg';
import helpIcon from '../../images/help.svg';
import reloadIcon from '../../images/reload.svg';
import nightIcon from '../../images/nightMode.svg';

const ControlBlock = () => {
    const [data] = React.useState([
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
    const [iconButtonData] = React.useState([
        {
            title: 'Reload page',
            disabled: false,
            onClick: null,
            iconPath: reloadIcon
        },
        {
            title: 'Open site guide',
            disabled: false,
            onClick: null,
            iconPath: helpIcon
        },
        {
            title: 'Switch dark mode',
            disabled: false,
            onClick: null,
            iconPath: nightIcon
        },
    ]);

    return (
        <div className={classes.controlBlock}>
            <h1 className={classes.h1}>Shitlord's Image Editor</h1>
            <TextButton data={data[0]} />
            <TextButton data={data[1]} />
            <TextButton data={data[2]} />
            <IconButton data={iconButtonData[0]} shift={{right: 0, bottom: 0}}/>
            <IconButton data={iconButtonData[1]} shift={{right: 65, bottom: 0}}/>
            <IconButton data={iconButtonData[2]} shift={{right: 0, bottom: 65}}/>
        </div>
    );
};

export default ControlBlock;