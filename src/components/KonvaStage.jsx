import React from 'react';
import {Stage, Layer, Text, Rect, Image} from 'react-konva';


const KonvaStage = ({images}) => {

    return (
        <Stage width={512} height={512} id="canvas">
            <Layer>
                <Text text="Some text on canvas" fontSize={15} />
                <Rect width={512} height={512} fill="red" draggable={true}/>
                {/*<Image image={images[0]} />*/}
            </Layer>
        </Stage>
    );
};

export default KonvaStage;