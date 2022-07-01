import React from 'react';
import classes from './KonvaStage.module.css';
import {Stage, Layer, Text, Rect, Image} from 'react-konva';

const KonvaStage = ({images, stageRef}) => {
    return (
        <Stage width={512} height={512} className={classes.stage} ref={stageRef}>
            <Layer>
                {images.map(image => (
                    <Image
                        image={image}
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