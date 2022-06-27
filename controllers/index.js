const inputImage = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const inputColor = document.getElementById('input-color');
const inputText = document.getElementById('input-text');
const buttons = document.getElementById('buttons');
const galleryWindow = document.getElementById('galleryWindow');


const stageWidth = 512;
const stageHeight = 512;
let imageData = '';
const anchorAxes = new Set();
anchorAxes.add({axis: 'x', position: 0});
anchorAxes.add({axis: 'y', position: 0});
anchorAxes.add({axis: 'x', position: stageWidth});
anchorAxes.add({axis: 'x', position: stageHeight});


const stage = new Konva.Stage({
    container: 'canvas',
    width: 512,
    height: 512
});

const layer = new Konva.Layer();
stage.add(layer);

const background = new Konva.Rect({
    x: -1,
    y: -1,
    width: stageWidth + 1,
    height: stageHeight + 1,
    listening: false
});
layer.add(background);

const tr = new Konva.Transformer({
    anchorStroke: 'red',
    anchorFill: 'yellow',
    anchorSize: 20,
    borderStroke: 'green',
    borderDash: [3, 3],
    rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315]
});
layer.add(tr);

const text = new Konva.Text({
    draggable: true,
    fontSize: 65,
    fill: 'white',
    stroke: 'black',
    strokeWidth: 5,
    name: 'element',
    align: 'center',
    verticalAlign: 'middle'
});

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

const selection = {
    element: new Konva.Rect({
        fill: 'rgba(0, 0, 255, 0.5)',
        visible: false,
    }),
    x1: null,
    y1: null,
    x2: null,
    y2: null
};
layer.add(selection.element);


stage.on('mousedown touchstart', e => {
    if (e.target !== stage) return;
    e.evt.preventDefault();

    const position = stage.getPointerPosition();
    selection.x1 = position.x;
    selection.y1 = position.y;
    selection.x2 = position.x;
    selection.y2 = position.y;

    selection.element.visible(true);
    selection.element.width(0);
    selection.element.height(0);
});

stage.on('mousemove touchmove', e => {
    if (!selection.element.visible()) return;
    e.evt.preventDefault();

    const position = stage.getPointerPosition();
    selection.x2 = position.x;
    selection.y2 = position.y;

    selection.element.setAttrs({
        x: Math.min(selection.x1, selection.x2),
        y: Math.min(selection.y1, selection.y2),
        width: Math.abs(selection.x2 - selection.x1),
        height: Math.abs(selection.y2 - selection.y1),
    });
});

stage.on('mouseleave mouseup touchend', e => {
    if (!selection.element.visible()) return;
    e.evt.preventDefault();

    setTimeout(() => { selection.element.visible(false); });

    tr.nodes(stage.find('.element').filter(shape =>
        Konva.Util.haveIntersection(selection.element.getClientRect(),
            shape.getClientRect())));
});

stage.on('click tap', e => {
    if (selection.element.visible()) return;

    const element = e.target;

    if (element === stage) {
        tr.nodes([]);
        return;
    }

    if (!element.hasName('element')) return;

    const ctrlPressed = e.evt.ctrlKey;
    const isSelected = tr.nodes().includes(element);

    if (!ctrlPressed && !isSelected) tr.nodes([element]);
    if (ctrlPressed && !isSelected) addToNodes(element);
    if ((!ctrlPressed && isSelected) || (ctrlPressed && isSelected)) removeFromNodes(element);
});

text.on('dragstart', function () {
    this.moveUp();
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
    const textSymbols = text.getAttr('text');
    if (textSymbols) layer.add(text);
    else text.remove();
};

inputColor.oninput = function (e) {
    background.fill(e.target.value);
};


function addToNodes(element) {
    tr.nodes(tr.nodes().concat([element]));
}

function removeFromNodes(element) {
    const nodes = tr.nodes().slice();
    nodes.splice(nodes.indexOf(element), 1);
    tr.nodes(nodes);
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
            draggable: true,
            name: 'element'
        });

        image.on('dragstart', function () {
            this.moveUp();
        });

        image.on('dragmove', function(e) {
            if (e.evt.shiftKey) tryAnchor(this);
        });

        layer.add(image);
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