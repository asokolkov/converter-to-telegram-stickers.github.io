import React, {useContext, useEffect, useRef} from 'react';
import classes from './KonvaStage.module.css';
import {Layer, Text, Rect, Stage} from 'react-konva';
import {GlobalContext} from '../../context';
import KonvaImage from "../KonvaImage/KonvaImage";

const KonvaStage = ({images}) => {
    const {background, stage} = useContext(GlobalContext);
    const stageRef = useRef();
    useEffect(() => stage.setStage(stageRef.current), [stageRef]);

    const [selectedId, setSelectedId] = React.useState(null);

    function checkDeselect(e) {
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) setSelectedId(null);
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
                        image={image}
                        isSelected={image.id === selectedId}
                        onClick={() => setSelectedId(image.id)}
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default KonvaStage;