import React, {useContext} from 'react';
import classes from './ControlBlock.module.css';
import Button from '../UI/Button/Button';
import ColorInput from '../UI/ColorInput/ColorInput';

import textIcon from '../../images/text.svg';
import bgIcon from '../../images/bg.svg';
import helpIcon from '../../images/help.svg';
import reloadIcon from '../../images/reload.svg';
import nightIcon from '../../images/nightMode.svg';

import {GlobalContext} from '../../context';

const ControlBlock = () => {
    const {background} = useContext(GlobalContext);

    const [data] = React.useState([
        {
            text: 'Add Text',
            title: 'Click on canvas to add text',
            onClick: null,
            iconPath: textIcon,
        },
        {
            text: 'Change background',
            title: 'Choose canvas background color',
            onClick: null,
            iconPath: bgIcon,
            colorInput: <ColorInput onInput={e => background.setColor(e.target.value)} />
        },
        {
            text: 'Submit',
            title: 'Save image',
            onClick: downloadStage,
        },
        {
            title: 'Reload page',
            style : {right: 0, bottom: 0},
            onClick: null,
            iconPath: reloadIcon,
        },
        {
            title: 'Open site guide',
            style : {right: 65, bottom: 0},
            onClick: null,
            iconPath: helpIcon,
        },
        {
            title: 'Switch dark mode',
            style : {right: 0, bottom: 65},
            onClick: null,
            iconPath: nightIcon,
        },
    ]);

    function downloadStage() {
        const link = document.createElement('a');
        link.download = 'image500x500.png';
        //link.href = stageRef.current.toDataURL();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className={classes.controlBlock}>
            <h1 className={classes.h1}>Shitlord's Image Editor</h1>
            <Button data={data[0]} />
            <Button data={data[1]} />
            <Button data={data[2]} />
            <Button data={data[3]} />
            <Button data={data[4]} />
            <Button data={data[5]} />
        </div>
    );
};

export default ControlBlock;