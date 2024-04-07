class Pipe {
    constructor(x, y, width, height, sprite, isTop, ctx) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.sprite = new Image()
        this.ctx = ctx
        this.sprite.onload = () => {
            this.draw()
        };
        this.sprite.src = sprite
        this.isTop = isTop
        this.pipeImageX = isTop ? pipeTopSpriteX : pipeBottomSpriteX
        this.pipeImageY = 0
        this.counted = false
        this.dx = -1
    }

    draw() {
        if (this.ctx) {
            if (this.isTop) {
                this.ctx.drawImage(this.sprite, this.pipeImageX, canvasHeight - this.height, this.width, this.height, this.x, this.y, this.width, this.height)
            } else {
                this.ctx.drawImage(this.sprite, this.pipeImageX, this.pipeImageY, this.width, this.height, this.x, this.y, this.width, this.height)
            }
        } else {
            console.error("Context is not defined!")
        }
    }

    update() {
        this.x += this.dx
    }
}