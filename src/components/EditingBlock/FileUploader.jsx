import React from 'react';
import classes from './FileUploader.module.css';

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const FileUploader = ({addImages, images}) => {
    async function onUpload(e) {
        const files = [];
        for (let file of e.target.files) files.push(await toBase64(file))
        addImages(files);
    }

    return (
        <label className={classes.fileUploader}>
            <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={onUpload}
                multiple
            />
            <span className={classes.text}>
                Click to choose images,<br/>drag or paste them here
            </span>
        </label>
    );
};

export default FileUploader;