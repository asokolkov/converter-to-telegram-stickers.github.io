import React, {useContext, useEffect, useRef} from 'react';
import classes from './KonvaStage.module.css';
import {Layer, Text, Rect, Stage} from 'react-konva';
import {GlobalContext} from '../../context';
import KonvaImage from "./KonvaImage";

const KonvaStage = ({images}) => {
    const {background, stage} = useContext(GlobalContext);
    const stageRef = useRef();
    useEffect(() => stage.setStage(stageRef.current), [stageRef]);

    const [selectedElement, setSelectedElement] = React.useState({});

    function checkDeselect(e) {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) setSelectedElement({});
    }

    function trySelect(image) {
        setSelectedElement(image !== selectedElement ? image : {});
    }

    return (
        <Stage
            width={512}
            height={512}
            className={classes.stage}
            ref={stageRef}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
        >
            <Layer>
                <Rect
                    x={-1}
                    y={-1}
                    width={514}
                    height={514}
                    fill={background.color}
                    listening={false}
                />
                {images.map((image) => (
                    <KonvaImage
                        key={image.id}
                        image={image.data}
                        isSelected={image.id === selectedElement.id}
                        onClick={() => trySelect(image)}
                        onDragStart={() => trySelect(image)}
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default KonvaStage;