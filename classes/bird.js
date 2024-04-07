class Bird {
    constructor(x, y, width, height, sprite, frameCount) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.sprite = sprite
        this.animationFrames = []
        this.frameIndex = 0
        this.frameCount = frameCount;
        this.frameWidth = birdFrameWidth;
        this.frameHeight = birdFrameHeight;
        this.animationSpeed = 5
        this.velocity = velocity
        this.gravity = gravity
        this.loadAnimationFrames()
    }

    loadAnimationFrames() {
        for (let i = 0; i < this.frameCount; i++) {
            const frameX = birdSpriteX
            const frameY = birdSpriteY + i * this.frameHeight
            const frameImage = new Image()
            frameImage.src = this.sprite
            this.animationFrames.push({ x: frameX, y: frameY, image: frameImage })
        }
    }

    flap() {
        this.velocity = -5
    }

    update() {
        this.velocity += this.gravity
        this.y += this.velocity
        this.animate()
    }

    animate() {
        this.frameIndex = Math.floor(Date.now() / 100) % this.frameCount;
    }

    draw(ctx) {
        const frame = this.animationFrames[this.frameIndex]
        ctx.drawImage(frame.image, frame.x, frame.y, this.frameWidth, this.frameHeight, this.x, this.y, this.width, this.height)
    }
}