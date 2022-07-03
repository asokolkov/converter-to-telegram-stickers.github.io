import React, {useState, useContext, useEffect} from 'react';
import FileUploader from '../FileUploader/FileUploader';
import KonvaStage from '../KonvaStage/KonvaStage';
import classes from './EditingBlock.module.css';
import {GlobalContext} from "../../context";

const EditingBlock = () => {
    const {controlMode} = useContext(GlobalContext);

    let imagesCounter = 0;
    const [images, setImages] = useState([]);

    useEffect(() => controlMode.setStatus(!!images.length), [images]);

    const addImages = (base64Images) => {
        const newImages = [];
        base64Images.forEach(file => {
            const image = document.createElement('img');
            image.src = file;
            newImages.push({
                id: (++imagesCounter).toString(),
                data: image,
                x: 0,
                y: 0
            });
        });
        setImages(images.concat(newImages));
    };

    return (
        <div className={classes.editingBlock}>
            {!controlMode.status ? <FileUploader addImages={addImages} images={images} /> : null}
            {controlMode.status ? <KonvaStage images={images} /> : null}
        </div>
    );
};

export default EditingBlock;