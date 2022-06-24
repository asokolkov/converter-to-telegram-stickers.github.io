const inputImage = document.getElementById('input');
const inputLabel = document.getElementById('input-label');
const inputColor = document.getElementById('input-color');
const inputText = document.getElementById('input-text');
const buttons = document.getElementById('buttons');
const galleryWindow = document.getElementById('galleryWindow');

requestAnimationFrame(drawCanvas);

const canvas = {
    width: 512,
    height: 512,
    element: document.getElementById('canvas'),
    ctx: this.element.getContext('2d'),
    text: '',
    dirty: true,
    bgColor: null,
    image: '',
    shiftPressed: false
}
const image = {
    x: 0,
    y: 0,
    scale: 1,
    data: new Image()
};
const mouse = {
    x: 0,
    y: 0,
    oldX: 0,
    oldY: 0,
    dragging: false
};

canvas.ctx.font = 'bold 48px sans-serif';
canvas.ctx.textAlign = 'center';
canvas.ctx.fillStyle = '#000';

canvas.element.addEventListener('mousemove', mouseEvent, {passive: true});
canvas.element.addEventListener('mousedown', mouseEvent, {passive: true});
canvas.element.addEventListener('mouseup', mouseEvent, {passive: true});
canvas.element.addEventListener('mouseout', mouseEvent, {passive: true});
canvas.element.addEventListener('wheel', mouseWheelEvent, {passive: false});

inputImage.onchange = function() {
    hideInputLabel(this.files[0]);
};

inputColor.onchange = function(e) {
    canvas.bgColor = e.target.value;
    if (canvas.dirty) update();
    canvas.dirty = true;
};

inputText.oninput = function(e) {
    canvas.text = e.target.value;
    if (canvas.dirty) update();
    canvas.dirty = true;
};

inputLabel.ondrop = function(e) {
    e.preventDefault();
    inputImage.files = e.dataTransfer.files;
    hideInputLabel(inputImage.files[0]);
};

inputLabel.ondragover = function(e) {
    e.preventDefault();
    this.classList.add('dragover');
};

inputLabel.ondragleave = function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
};

document.onpaste = function(e){
    const file = e.clipboardData.items[0].getAsFile();
    hideInputLabel(file);
};

function scaleAt(at, amount) {
    if (canvas.dirty) update();
    image.scale *= amount;
    image.x = at.x - (at.x - image.x) * amount;
    image.y = at.y - (at.y - image.y) * amount;
    canvas.dirty = true;
}

function drawCanvas() {
    if (canvas.dirty) {
        canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
        canvas.ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
        if (canvas.dirty) update();
        if (canvas.shiftPressed) tryAnchor();
        canvas.ctx.setTransform(image.scale, 0, 0, image.scale, image.x, image.y);
        canvas.ctx.drawImage(image.data, 0, 0);
        canvas.ctx.resetTransform();
        canvas.ctx.fillText(canvas.text, canvas.element.width / 2, canvas.element.height - 40);
    }
    requestAnimationFrame(drawCanvas);
}

function tryAnchor() {
    const range = 5;
    const imageWidth = image.data.width * image.scale;
    const imageHeight = image.data.height * image.scale;
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    const imageCenterX = image.x + imageWidth / 2;
    const imageCenterY = image.y + imageHeight / 2;
    const distances = {
        left: image.x,
        top: image.y,
        right: canvas.width - (image.x + imageWidth),
        bottom: canvas.height - (image.y + imageHeight),
        centerX: canvasCenterX - imageCenterX,
        centerY: canvasCenterY - imageCenterY
    };
    for (const [side, distance] of Object.entries(distances)) {
        if (-range >= distance || distance >= range) continue;
        if (side === 'left') image.x = 0;
        else if (side === 'top') image.y = 0;
        else if (side === 'right') image.x = canvas.width - imageWidth;
        else if (side === 'bottom') image.y = canvas.height - imageHeight;
        else if (side === 'centerX') image.x = canvasCenterX - imageWidth / 2;
        else if (side === 'centerY') image.y = canvasCenterY - imageHeight / 2;
    }
}

function update() {
    canvas.dirty = false;
    if (canvas.bgColor === null) return;
    canvas.ctx.fillStyle = canvas.bgColor;
    canvas.ctx.fillRect(0, 0, canvas.element.width, canvas.element.height);
}

function mouseEvent(e) {
    canvas.shiftPressed = e.shiftKey;
    if (e.type === 'mousedown' || e.type === 'touchstart')
        mouse.dragging = true;
    if (e.type === 'mouseup' || e.type === 'mouseout' || e.type === 'touchend')
        mouse.dragging = false;
    mouse.oldX = mouse.x;
    mouse.oldY = mouse.y;
    mouse.x = e.offsetX;
    mouse.y = e.offsetY
    if (mouse.dragging) {
        if (canvas.dirty) update();
        image.x += mouse.x - mouse.oldX;
        image.y += mouse.y - mouse.oldY;
        canvas.dirty = true;
    }
}

function mouseWheelEvent(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    if (e.deltaY < 0) scaleAt({x, y}, 1.1);
    else {
        if (image.scale < 0.04) image.scale = 0.04;
        scaleAt({x, y}, 1 / 1.1);
    }
    e.preventDefault();
}

function download() {
    const link = document.createElement('a');
    link.download = 'image512x512.png';
    link.href = canvas.image;
    link.click();
}

function closeWindow() {
    galleryWindow.style.display = 'none';
}

function showGalleryWindow() {
    const gwImage = document.getElementById('gw-img');
    gwImage.src = canvas.image;
    galleryWindow.style.display = 'flex';
}

function onSubmitClick() {
    canvas.image = canvas.element.toDataURL();
    download();
    showGalleryWindow();
}

function hideInputLabel(imageFile) {
    const fileFormat = imageFile.name.split('.').pop();
    const correctImageFormat = fileFormat === 'png' ||
        fileFormat === 'jpg' || fileFormat === 'jpeg';

    if (!correctImageFormat) {
        alert('Wrong file type. Try again.');
        return;
    }

    inputLabel.style.display = 'none';
    canvas.element.style.display = 'flex';
    buttons.style.display = 'flex';
    image.data.onload = () => {
        canvas.ctx.drawImage(image.data, 0, 0);
        canvas.element.elementFromPoint(0, 0).click();
    };
    image.data.src = URL.createObjectURL(imageFile);
}

async function addToGallery() {
    closeWindow();
    const sticker = {
        id: Date.now(),
        data: canvas.image
    };
    await fetch('/api/stickers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(sticker)
    });
}