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





function getLineGuideStops(skipShape) {
    // we can snap to stage borders and the center of the stage
    var vertical = [0, stage.width() / 2, stage.width()];
    var horizontal = [0, stage.height() / 2, stage.height()];

    // and we snap over edges and center of each object on the canvas
    stage.find('.element').forEach((guideItem) => {
        if (guideItem === skipShape) {
            return;
        }
        var box = guideItem.getClientRect();
        // and we can snap to all edges of shapes
        vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
        horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    });
    return {
        vertical: vertical.flat(),
        horizontal: horizontal.flat(),
    };
}

// what points of the object will trigger to snapping?
// it can be just center of the object
// but we will enable all edges and center
function getObjectSnappingEdges(node) {
    var box = node.getClientRect();
    var absPos = node.absolutePosition();

    return {
        vertical: [
            {
                guide: Math.round(box.x),
                offset: Math.round(absPos.x - box.x),
                snap: 'start',
            },
            {
                guide: Math.round(box.x + box.width / 2),
                offset: Math.round(absPos.x - box.x - box.width / 2),
                snap: 'center',
            },
            {
                guide: Math.round(box.x + box.width),
                offset: Math.round(absPos.x - box.x - box.width),
                snap: 'end',
            },
        ],
        horizontal: [
            {
                guide: Math.round(box.y),
                offset: Math.round(absPos.y - box.y),
                snap: 'start',
            },
            {
                guide: Math.round(box.y + box.height / 2),
                offset: Math.round(absPos.y - box.y - box.height / 2),
                snap: 'center',
            },
            {
                guide: Math.round(box.y + box.height),
                offset: Math.round(absPos.y - box.y - box.height),
                snap: 'end',
            },
        ],
    };
}

// find all snapping possibilities
function getGuides(lineGuideStops, itemBounds) {
    var resultV = [];
    var resultH = [];

    lineGuideStops.vertical.forEach((lineGuide) => {
        itemBounds.vertical.forEach((itemBound) => {
            var diff = Math.abs(lineGuide - itemBound.guide);
            // if the distance between guild line and object snap point is close we can consider this for snapping
            if (diff < 5) {
                resultV.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        });
    });

    lineGuideStops.horizontal.forEach((lineGuide) => {
        itemBounds.horizontal.forEach((itemBound) => {
            var diff = Math.abs(lineGuide - itemBound.guide);
            if (diff < 5) {
                resultH.push({
                    lineGuide: lineGuide,
                    diff: diff,
                    snap: itemBound.snap,
                    offset: itemBound.offset,
                });
            }
        });
    });

    var guides = [];

    // find closest snap
    var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
        guides.push({
            lineGuide: minV.lineGuide,
            offset: minV.offset,
            orientation: 'V',
            snap: minV.snap,
        });
    }
    if (minH) {
        guides.push({
            lineGuide: minH.lineGuide,
            offset: minH.offset,
            orientation: 'H',
            snap: minH.snap,
        });
    }
    return guides;
}

function drawGuides(guides) {
    guides.forEach((lg) => {
        if (lg.orientation === 'H') {
            var line = new Konva.Line({
                points: [-6000, 0, 6000, 0],
                stroke: 'rgb(0, 161, 255)',
                strokeWidth: 1,
                name: 'guid-line',
                dash: [4, 6],
            });
            layer.add(line);
            line.absolutePosition({
                x: 0,
                y: lg.lineGuide,
            });
        } else if (lg.orientation === 'V') {
            var line = new Konva.Line({
                points: [0, -6000, 0, 6000],
                stroke: 'rgb(0, 161, 255)',
                strokeWidth: 1,
                name: 'guid-line',
                dash: [4, 6],
            });
            layer.add(line);
            line.absolutePosition({
                x: lg.lineGuide,
                y: 0,
            });
        }
    });
}

layer.on('dragmove', function (e) {
    // clear all previous lines on the screen
    layer.find('.guid-line').forEach((l) => l.destroy());

    // find possible snapping lines
    var lineGuideStops = getLineGuideStops(e.target);
    // find snapping points of current object
    var itemBounds = getObjectSnappingEdges(e.target);

    // now find where can we snap current object
    var guides = getGuides(lineGuideStops, itemBounds);

    // do nothing of no snapping
    if (!guides.length) {
        return;
    }

    drawGuides(guides);

    var absPos = e.target.absolutePosition();
    // now force object position
    guides.forEach((lg) => {
        switch (lg.snap) {
            case 'start': {
                switch (lg.orientation) {
                    case 'V': {
                        absPos.x = lg.lineGuide + lg.offset;
                        break;
                    }
                    case 'H': {
                        absPos.y = lg.lineGuide + lg.offset;
                        break;
                    }
                }
                break;
            }
            case 'center': {
                switch (lg.orientation) {
                    case 'V': {
                        absPos.x = lg.lineGuide + lg.offset;
                        break;
                    }
                    case 'H': {
                        absPos.y = lg.lineGuide + lg.offset;
                        break;
                    }
                }
                break;
            }
            case 'end': {
                switch (lg.orientation) {
                    case 'V': {
                        absPos.x = lg.lineGuide + lg.offset;
                        break;
                    }
                    case 'H': {
                        absPos.y = lg.lineGuide + lg.offset;
                        break;
                    }
                }
                break;
            }
        }
    });
    e.target.absolutePosition(absPos);
});

layer.on('dragend', function (e) {
    // clear all previous lines on the screen
    layer.find('.guid-line').forEach((l) => l.destroy());
});




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