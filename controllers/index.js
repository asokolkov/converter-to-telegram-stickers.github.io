const inputImage = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const inputColor = document.getElementById('input-color');
const inputText = document.getElementById('input-text');
const buttons = document.getElementById('buttons');
const galleryWindow = document.getElementById('galleryWindow');

const stage = new Konva.Stage({
    container: 'canvas',
    width: 512,
    height: 512
});

let shiftPressed = false;
const scale = {
    step: 1.1,
    counter: 1,
    max: 45,
    min: -110
};
let imageData = '';
const anchorAxes = new Set();
anchorAxes.add({axis: 'x', position: 0});
anchorAxes.add({axis: 'y', position: 0});
anchorAxes.add({axis: 'x', position: stage.width()});
anchorAxes.add({axis: 'x', position: stage.height()});

const staticLayer = new Konva.Layer();
const activeLayer = new Konva.Layer();
stage.add(staticLayer, activeLayer);

const background = new Konva.Rect({
    x: 0,
    y: 0,
    width: 512,
    height: 512,
    stroke: 'black',
    strokeWidth: 15,
    listening: false
});
staticLayer.add(background);

const text = new Konva.Text({
    draggable: true,
    fontSize: 65,
    width: 450,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 5
});
staticLayer.add(text);

const originalFillStroke = Konva.Context.prototype.fillStrokeShape;
Konva.Context.prototype.fillStrokeShape = function(shape) {
    if (shape instanceof Konva.Text) {
        if (shape.getStrokeEnabled()) this._stroke(shape);
        if (shape.getFillEnabled()) this._fill(shape);
    }
    else originalFillStroke.call(this, shape);
};

const horizontalLine = new Konva.Line({
    points: [-1, 0, 1, 0],
    stroke: 'red',
    strokeWidth: 5
});

const verticalLine = new Konva.Line({
    points: [0, -1, 0, 1],
    stroke: 'red',
    strokeWidth: 5
});

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

    resizeBackground(direction);
});

function resizeBackground(direction) {
    background.absolutePosition({ x: 0, y: 0 });
    background.setAttrs({
        width: calcScaledSize(direction, background.width()),
        height: calcScaledSize(direction, background.height()),
    });
}

function calcScaledSize(direction, axis) {
    return direction > 0 ? axis * scale.step : axis / scale.step
}

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
    files.forEach(file => {
        if (isValidFileFormat(file)) addImage(file);
    });

    inputLabel.style.display = 'none';
    document.getElementById('canvas').style.display = 'flex';
    buttons.style.display = 'flex';
}

function addImage(file) {
    const imageObj = new Image();
    imageObj.onload = function () {
        const image = new Konva.Image({
            image: imageObj,
            draggable: true
        });

        image.on('dragstart dragend', e => {
            image.moveTo((e.type === 'dragstart') ? activeLayer : staticLayer);
            image.moveToTop();
            text.moveToTop();
        });

        image.on('dragmove', function(e) {
            if (e.evt.shiftKey) tryAnchor(this);
        });

        staticLayer.add(image);
    };
    imageObj.src = URL.createObjectURL(file);
}

function tryAnchor(image) {
    const range = 5;
    for (const anchor of anchorAxes) {
        if (anchor.axis === 'x') {
            const difference1 = image.attrs.x - anchor.position;
            if (-range < difference1 && difference1 < range) image.attrs.x = anchor.position;
        }
    }
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