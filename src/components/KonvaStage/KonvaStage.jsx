import React, {useEffect, useState} from 'react';
import classes from './KonvaStage.module.css';
import {Stage, Layer, Text, Rect, Image} from 'react-konva';
import useImage from 'use-image';

const KonvaStage = ({files}) => {
    // const [loadedImages, setLoadedImages] = useState([]);
    //
    // useEffect(() => {
    //     console.log(1);
    // }, [files]);

    // useImage(file.base64, 'anonymous')[0]

    return (
        <Stage width={512} height={512} className={classes.stage}>
            <Layer>
                <Image
                    image={URL.createObjectURL(files[0].base64)}
                    name="image"
                    draggable
                    onDragStart={function() {
                        this.moveUp();
                    }}
                />

            </Layer>
        </Stage>
    );
};

export default KonvaStage;