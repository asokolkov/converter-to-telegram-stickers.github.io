import React from 'react';
import '../styles/FileUploader.css';

const FileUploader = ({addFiles, files}) => {
    const validFormats = ['png', 'jpg', 'jpeg'];

    function getValidFiles(files) {
        if (!Array.isArray(files)) files = Object.values(files);
        return files.filter(file => isValidFileFormat(file));
    }

    function isValidFileFormat(file) {
        const fileFormat = file.name.split('.').pop();
        return validFormats.includes(fileFormat);
    }

    return (
        <label id="FileUploader" style={{ display: files.length ? "none" : "flex" }}>
            <input
                id="input"
                type="file"
                multiple="multiple"
                onChange={e => addFiles(getValidFiles(e.target.files))}
            />
                <span className="text">
                    Click to choose images,<br/>drag or paste them here
                </span>
        </label>
    );
};

export default FileUploader;