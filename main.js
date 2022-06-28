const canvas = document.getElementById('canvas');
const inputImage = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const inputColor = document.getElementById('input-color');
const inputAddBG = document.getElementById('change-bg-add');
const inputRemoveBG = document.getElementById('change-bg-remove');
const inputText = document.getElementById('text-input');


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

const originalFillStroke = Konva.Context.prototype.fillStrokeShape;
Konva.Context.prototype.fillStrokeShape = function(shape) {
    if (shape instanceof Konva.Text) {
        if (shape.getStrokeEnabled()) this._stroke(shape);
        if (shape.getFillEnabled()) this._fill(shape);
    }
    else originalFillStroke.call(this, shape);
};

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
    const elements = stage.find('.element').concat(stage.find('.text'))
    tr.nodes(elements.filter(shape =>
        Konva.Util.haveIntersection(selection.element.getClientRect(),
            shape.getClientRect())));
});

stage.on('click tap', e => selectElementEvent(e));

function selectElementEvent(e) {
    if (selection.element.visible()) return;

    const element = e.target;

    if (element === stage) {
        tr.nodes([]);
        return;
    }

    if (!element.hasName('element') && !element.hasName('text')) return;

    const ctrlPressed = e.evt.ctrlKey;
    const isSelected = tr.nodes().includes(element);

    if (!ctrlPressed && !isSelected) tr.nodes([element]);
    if (ctrlPressed && !isSelected) addToNodes(element);
    if ((!ctrlPressed && isSelected) || (ctrlPressed && isSelected)) removeFromNodes(element);
}

layer.on('dragstart', function () {
    stage.find('.text').forEach(text => text.moveToTop());
});

layer.on('dragmove', e => {
    removeLines();

    const linesPositions = getLinesPositions(e.target);
    const elementBounds = getElementSnappingEdges(e.target);
    const lines = getPossibleLines(linesPositions, elementBounds);

    if (!lines.length) return;

    drawLines(lines);

    const position = e.target.absolutePosition();
    lines.forEach(guideline => {
        if (guideline.snap === 'start') {
            if (guideline.orientation === 'V') position.x = guideline.lineGuide + guideline.offset;
            else if (guideline.orientation === 'H') position.y = guideline.lineGuide + guideline.offset;
        }
        else if (guideline.snap === 'center') {
            if (guideline.orientation === 'V') position.x = guideline.lineGuide + guideline.offset;
            else if (guideline.orientation === 'H') position.y = guideline.lineGuide + guideline.offset;
        }
        else if (guideline.snap === 'end') {
            if (guideline.orientation === 'V') position.x = guideline.lineGuide + guideline.offset;
            else if (guideline.orientation === 'H') position.y = guideline.lineGuide + guideline.offset;
        }
    });

    e.target.absolutePosition(position);
});

layer.on('dragend', () => removeLines());


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

canvas.ondragover = function(e) {
    e.preventDefault();
    this.classList.add('dragover');
};

canvas.ondragleave = function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
};

canvas.ondrop = function(e) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
    this.classList.remove('dragover');
};

inputColor.oninput = function(e) {
    background.fill(e.target.value);
};

inputColor.onchange = function() {
    inputAddBG.style.display = 'none';
    inputRemoveBG.style.display = 'flex';
};


function removeBG() {
    inputAddBG.style.display = 'flex';
    inputRemoveBG.style.display = 'none';
    background.fill(null);
}

function getLinesPositions(skippableElement) {
    const verticalPositions = [0, stageWidth / 2, stageWidth];
    const horizontalPositions = [0, stageHeight / 2, stageHeight];

    stage.find('.element').forEach(element => {
        if (element === skippableElement) return;
        const box = element.getClientRect();
        verticalPositions.push(box.x, box.x + box.width, box.x + box.width / 2);
        horizontalPositions.push(box.y, box.y + box.height, box.y + box.height / 2);
    });

    return {
        vertical: [...new Set(verticalPositions)],
        horizontal: [...new Set(horizontalPositions)]
    };
}

function getElementSnappingEdges(element) {
    const box = element.getClientRect();
    const position = element.absolutePosition();

    return {
        vertical: [
            {
                guide: Math.round(box.x),
                offset: Math.round(position.x - box.x),
                snap: 'start',
            },
            {
                guide: Math.round(box.x + box.width / 2),
                offset: Math.round(position.x - box.x - box.width / 2),
                snap: 'center',
            },
            {
                guide: Math.round(box.x + box.width),
                offset: Math.round(position.x - box.x - box.width),
                snap: 'end',
            },
        ],
        horizontal: [
            {
                guide: Math.round(box.y),
                offset: Math.round(position.y - box.y),
                snap: 'start',
            },
            {
                guide: Math.round(box.y + box.height / 2),
                offset: Math.round(position.y - box.y - box.height / 2),
                snap: 'center',
            },
            {
                guide: Math.round(box.y + box.height),
                offset: Math.round(position.y - box.y - box.height),
                snap: 'end',
            }
        ]
    };
}

function getLinesWithDifference(linesPositions, elementBounds) {
    const result = []
    const range = 5;
    linesPositions.forEach(position => {
        elementBounds.forEach(element => {
            const difference = Math.abs(position - element.guide);
            if (difference >= range) return;
            result.push({
                lineGuide: position,
                diff: difference,
                snap: element.snap,
                offset: element.offset,
            });
        });
    });
    return result;
}

function getPossibleLines(linesPositions, elementBounds) {
    const vertical = getLinesWithDifference(linesPositions.vertical, elementBounds.vertical);
    const horizontal = getLinesWithDifference(linesPositions.horizontal, elementBounds.horizontal);
    const result = [];

    const minV = vertical.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
        result.push({
            lineGuide: minV.lineGuide,
            offset: minV.offset,
            orientation: 'V',
            snap: minV.snap
        });
    }

    const minH = horizontal.sort((a, b) => a.diff - b.diff)[0];
    if (minH) {
        result.push({
            lineGuide: minH.lineGuide,
            offset: minH.offset,
            orientation: 'H',
            snap: minH.snap
        });
    }

    return result;
}

function drawLines(lines) {
    lines.forEach(guideline => {
        const line = new Konva.Line({
            stroke: 'rgb(0, 161, 255)',
            strokeWidth: 1,
            name: 'guideline',
            dash: [4, 6]
        });
        const orientation = guideline.orientation === 'H';
        line.setAttr('points', orientation ? [-6000, 0, 6000, 0] : [0, -6000, 0, 6000]);
        layer.add(line);
        line.absolutePosition(orientation
            ? { x: 0, y: guideline.lineGuide }
            : { x: guideline.lineGuide, y: 0 }
        );
    });
}

function removeLines() {
    layer.find('.guideline').forEach((l) => l.destroy());
}

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
    files.forEach(file => addImage(file));

    inputLabel.style.display = 'none';
    canvas.style.display = 'flex';
    for (const element of [...document.getElementsByClassName('disabled')]) {
        element.classList.remove('disabled');
        for (let i = 0; i < element.children.length; i++)
            if (element.children[i].disabled) element.children[i].disabled = false;
        element.disabled = false;
    }
}

function addImage(file) {
    if (!isValidFileFormat(file)) return;

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

        layer.add(image);
    };
    imageObj.src = URL.createObjectURL(file);
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
}

function onHelpClick() {

}

function addTextEvent(button) {
    const position = stage.getRelativePointerPosition();
    const text = new Konva.Text({
        x: position.x,
        y: position.y,
        draggable: true,
        fontSize: 65,
        fill: 'white',
        stroke: 'black',
        strokeWidth: 5,
        name: 'text',
        align: 'center',
        verticalAlign: 'middle'
    });
    layer.add(text);
    inputText.select();
    inputText.value='';

    inputText.oninput = e => text.setText(e.target.value);
    setTimeout(() => {
        document.onclick = () => deactivateAddingTextCondition(button, text);
    }, 10);
}

function activateAddingTextCondition(button) {
    button.style.backgroundColor = '#FFD166';
    stage.on('mouseenter.addingText', () => {
        document.body.style.cursor = 'text';
    });
    stage.on('mouseleave.addingText', () => {
        document.body.style.cursor = 'default';
    });
    stage.off('click tap');
    stage.on('click tap', () => addTextEvent(button));
}

function deactivateAddingTextCondition(button, text) {
    if (text && !text.getAttr('text')) text.remove();

    addingTextCondition = false;

    button.style.backgroundColor = '#EF476F';

    document.onclick = () => false;
    inputText.oninput = () => false;

    stage.off('mouseenter.addingText mouseleave.addingText');
    document.body.style.cursor = 'default';

    stage.off('click tap');
    stage.on('click tap', e => selectElementEvent(e));
}

let addingTextCondition = false;

function toggleAddingText(button) {
    addingTextCondition = !addingTextCondition;
    if (addingTextCondition) activateAddingTextCondition(button);
    else deactivateAddingTextCondition(button, null);
}