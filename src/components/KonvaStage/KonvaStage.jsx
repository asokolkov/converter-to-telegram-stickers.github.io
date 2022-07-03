import React, {useContext} from 'react';
import classes from './KonvaStage.module.css';
import {Layer, Text, Rect, Image, Transformer, Stage} from 'react-konva';
import {BackgroundContext} from "../../context";

const KonvaStage = ({images}) => {
    const {color} = useContext(BackgroundContext);

    return (
        <Stage
            width={512}
            height={512}
            className={classes.stage}
        >
            <Layer>
                <Rect
                    x={-1}
                    y={-1}
                    width={514}
                    height={514}
                    fill={color}
                    listening={false}
                />
            </Layer>
        </Stage>
    );
};

{/*{images.map((image) => (*/}
{/*    <Image*/}
{/*        image={image}*/}
{/*        name="image"*/}
{/*        draggable*/}
{/*        onDragStart={function() {*/}
{/*            this.moveToTop();*/}
{/*        }}*/}
{/*    />*/}
{/*))}*/}

export default KonvaStage;