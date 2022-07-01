import React, {useState} from 'react';
import FileUploader from './FileUploader/FileUploader';
import KonvaStage from './KonvaStage/KonvaStage';
import '../styles/EditingBlock.css';

const EditingBlock = () => {
    const [files, setFiles] = useState([]);

    const addFiles = (newFiles) => {
        setFiles(files.concat(newFiles));
    };

    return (
        <div id="EditingBlock">
            <FileUploader addFiles={addFiles} files={files} />
            {files.length ? <KonvaStage files={files} /> : null}
        </div>
    );
};

export default EditingBlock;