const inputImage = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const inputColor = document.getElementById('input-color');
const inputText = document.getElementById('input-text');
const buttons = document.getElementById('buttons');
const galleryWindow = document.getElementById('galleryWindow');

const scale = {
    step: 1.1,
    counter: 0,
    max: 45,
    min: -110
};
let imageData = '';

const stage = new Konva.Stage({
    container: 'canvas',
    width: 512,
    height: 512
});

const staticLayer = new Konva.Layer();
const activeLayer = new Konva.Layer();
stage.add(staticLayer, activeLayer);

const background = new Konva.Rect({
    x: -5,
    y: -5,
    width: 50000,
    height: 50000,
    listening: false
});
staticLayer.add(background);

const text = new Konva.Text({
    draggable: true,
    fontSize: 65,
    width: 450
});
staticLayer.add(text);

stage.on('wheel', e => {
    e.evt.preventDefault();

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    let mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };

    let direction = e.evt.deltaY < 0 ? -1 : 1;
    if (scale.counter + direction > scale.max || scale.counter + direction < scale.min) return;
    scale.counter += direction;

    const newScale = direction < 0 ? oldScale * scale.step : oldScale / scale.step;
    stage.scale({ x: newScale, y: newScale });
    stage.position({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    });

    background.absolutePosition({ x: -5, y: -5 });
});

inputImage.onchange = function() {
    addFiles(this.files);
};

inputLabel.ondrop = function(e) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
};

document.onpaste = function(e){
    const files = Object.values(e.clipboardData.items)
        .filter(element => element.kind === 'file')
        .map((element) => element.getAsFile());
    addFiles(files);
};

inputLabel.ondragover = function(e) {
    e.preventDefault();
    this.classList.add('dragover');
};

inputLabel.ondragleave = function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
};

inputText.oninput = function (e) {
    text.setText(e.target.value);
}

inputColor.oninput = function (e) {
    background.fill(e.target.value);
}

function addFiles(files) {
    if (!Array.isArray(files)) files = Object.values(files);
    for (const file of files) {
        if (!isValidFileFormat(file)) continue;

        const imageObj = new Image();
        imageObj.onload = function () {
            const image = new Konva.Image({
                image: imageObj,
                draggable: true
            });

            image.on('dragstart dragend', e => {
                const destinationLayer = (e.type === 'dragstart') ? activeLayer : staticLayer;
                image.moveTo(destinationLayer);
                image.moveToTop();
            });

            staticLayer.add(image);
        };
        imageObj.src = URL.createObjectURL(file);
    }

    inputLabel.style.display = 'none';
    document.getElementById('canvas').style.display = 'flex';
    buttons.style.display = 'flex';
}

function isValidFileFormat(file) {
    const fileFormat = file.name.split('.').pop();
    return fileFormat === 'png' || fileFormat === 'jpg' || fileFormat === 'jpeg';
}

function download(fileName) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = imageData;
    link.click();
}

function onSubmitClick() {
    imageData = stage.toDataURL({pixelRatio: 1});
    download('image512x512.png');
    showGalleryWindow();
}

function showGalleryWindow() {
    const gwImage = document.getElementById('gw-img');
    gwImage.src = imageData;
    galleryWindow.style.display = 'flex';
}

function closeWindow() {
    galleryWindow.style.display = 'none';
}

async function addToGallery() {
    closeWindow();
    const sticker = {
        id: Date.now(),
        data: imageData
    };
    await fetch('/api/stickers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sticker)
    });
}