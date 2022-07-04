import React, {useContext, useEffect, useRef} from 'react';
import classes from './KonvaStage.module.css';
import {Layer, Text, Rect, Image, Transformer, Stage} from 'react-konva';
import {GlobalContext} from '../../context';

const KonvaStage = ({images}) => {
    const {background, stage} = useContext(GlobalContext);
    const stageRef = useRef();
    useEffect(() => stage.setStage(stageRef.current), [stageRef]);

    return (
        <Stage
            width={512}
            height={512}
            className={classes.stage}
            ref={stageRef}
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
                    <Image
                        image={image.data}
                        name="image"
                        draggable
                        onDragStart={function() {
                            this.moveToTop();
                        }}
                    />
                ))}
            </Layer>
        </Stage>
    );
};

export default KonvaStage;