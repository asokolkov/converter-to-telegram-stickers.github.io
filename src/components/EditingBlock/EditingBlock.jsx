import React, {useState} from 'react';
import FileUploader from '../FileUploader/FileUploader';
import KonvaStage from '../KonvaStage/KonvaStage';
import classes from './EditingBlock.module.css';

const EditingBlock = () => {
    const [images, setImages] = useState([]);

    const addImages = (base64Images) => {
        const newImages = [];
        base64Images.forEach(file => {
            const image = document.createElement('img');
            image.src = file;
            newImages.push(image);
        });
        setImages(images.concat(newImages));
    };

    return (
        <div className={classes.editingBlock}>
            <FileUploader addImages={addImages} images={images} />
            {images.length ? <KonvaStage images={images} /> : null}
        </div>
    );
};

export default EditingBlock;