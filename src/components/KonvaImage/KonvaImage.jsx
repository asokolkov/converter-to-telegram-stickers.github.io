import React, {useEffect} from 'react';
import {Image, Transformer} from "react-konva";

const KonvaImage = ({image, isSelected, onClick}) => {
    const shapeRef = React.useRef();
    const transformRef = React.useRef();

    useEffect(() => {
        if (isSelected) {
            transformRef.current.moveToTop();
            shapeRef.current.moveToTop();
            transformRef.current.nodes([shapeRef.current]);
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Image
                image={image.data}
                name="image"
                draggable
                onClick={onClick}
                onTap={onClick}
                ref={shapeRef}
            />
            {isSelected && (
                <Transformer
                    ref={transformRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        return newBox.width < 5 || newBox.height < 5 ? oldBox : newBox;
                    }}
                    rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                />
            )}
        </React.Fragment>
    );
};

export default KonvaImage;