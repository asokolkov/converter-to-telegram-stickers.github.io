import React from 'react';
import classes from './FileUploader.module.css';

const FileUploader = ({addImages, images}) => {
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    async function onUpload(e) {
        const files = [];
        for (let file of e.target.files) files.push(await toBase64(file))
        addImages(files);
    }

    return (
        <label
            className={classes.fileUploader}
            style={{display: images.length ? "none" : "flex"}}
        >
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