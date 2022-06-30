import React from 'react';
import FileBase64 from 'react-file-base64';
import './FileUploader.css';

const FileUploader = ({addFiles, files}) => {
    const validFormats = ['image/png', 'image/jpg', 'image/jpeg'];

    function tryToAddFiles(files) {
        addFiles(files.filter(file => validFormats.includes(file.type)));
    }

    return (
        <label
            className="fileUploader"
            style={{display: files.length ? "none" : "flex"}}
        >
            <FileBase64
                type="file"
                multiple
                onDone={(files) => tryToAddFiles(files)}
            />
            <span className="text">
                Click to choose images,<br/>drag or paste them here
            </span>
        </label>
    );
};

export default FileUploader;