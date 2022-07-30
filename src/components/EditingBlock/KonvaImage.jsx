import React, {useContext, useEffect, useState} from 'react';
import {Image, Transformer} from "react-konva";
import {GlobalContext} from "../../context";

function appendHistory(element, history) {
    history.setHistory(history.history.concat([1]));
    console.log(history)
}

const KonvaImage = ({image, isSelected, onClick, onDragStart}) => {
    const {history} = useContext(GlobalContext);
    const shapeRef = React.useRef();
    const transformRef = React.useRef();
    const [h, setH] = useState([]);

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
                image={image}
                name="image"
                draggable
                onClick={onClick}
                onTap={onClick}
                onDragStart={onDragStart}
                ref={shapeRef}
            />
            {isSelected && (
                <Transformer
                    ref={transformRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        return newBox.width < 5 || newBox.height < 5 ? oldBox : newBox;
                    }}
                    anchorSize={15}
                    rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
                    onTransformEnd={() => {
                        setH(h.concat({
                            image: shapeRef.current,
                            x: shapeRef.current.x(),
                            y: shapeRef.current.y(),
                            scaleX: shapeRef.current.scaleX(),
                            scaleY: shapeRef.current.scaleY()
                        }));
                        history.setHistory(h)
                        console.log(history.history)
                    }}
                />
            )}
        </React.Fragment>
    );
};

export default KonvaImage;