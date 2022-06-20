class Canvas {
    constructor(element) {
        this.element = element;
        this.ctx = element.getContext('2d');
        this.text = '';
        this.dirty = true;
        this.bgColor = null;
        this.image = '';

        this.ctx.font = 'bold 48px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#000';
    }
}