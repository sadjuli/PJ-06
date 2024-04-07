class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId)
        this.ctx = this.canvas.getContext("2d")
        this.bird = null
        this.pipes = []
        this.score = 0
        this.highScore = localStorage.getItem('highScore') || 0
        this.gameOver = true
        this.pipeWidth = pipeWidth
        this.pipeGap = pipeGap
        this.pipeFrequency = pipeFrequency
        this.pipeTimer = 0
        this.background = new Image()
        this.background.src = gameSprites
        
        this.background.onload = () => {
            this.ctx.drawImage(this.sprites, gameTopBgSpriteX, gameTopBgSpriteY, gameTopBgWidth, gameTopBgHeight, 0, gameTopGap, canvasWidth, gameTopBgHeight)
            this.ctx.drawImage(this.sprites, gameBottomBgSpriteX, gameBottomBgSpriteY, gameBottomBgWidth, gameBottomBgHeight, 0, gameTopGap + gameTopBgHeight, canvasWidth, gameBottomBgHeight / 2)
        }
        this.backgroundX = 0
        this.backgroundSpeed = 1
        this.canvas.style.backgroundColor = gameBg

        this.sprites = new Image()
        this.sprites.src = gameSprites

        document.getElementById('startButton').addEventListener('click', () => {
            if (this.gameOver) {
                this.start()
            } else {
                this.restart()
            }
        })

        this.canvas.addEventListener('click', () => {
            if (!this.gameOver && this.bird) {
                this.bird.flap()
            }
        })
    }

    loop() {
        if (!this.gameOver) {
            this.update()
            this.draw()
            requestAnimationFrame(() => this.loop())
        }
    }

    update() {
        if (!this.bird) return
        this.bird.update()

        if (this.bird.y + this.bird.height > this.canvas.height - gameBottomBgHeight / 2) {
            this.endGame()
        }

        this.pipeTimer++;
        if (this.pipeTimer === this.pipeFrequency) {
            this.generatePipes()
            this.pipeTimer = 0
        }

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        this.backgroundX -= this.backgroundSpeed;
        if (this.backgroundX <= -canvasWidth) {
            this.backgroundX = 0
        }

        this.pipes.forEach((pipe, pipeIdx) => {
            pipe.update()
            pipe.draw(this.ctx)

            if (this.checkCollision(this.bird, pipe)) {
                this.endGame()
            }
            if (pipe.x + pipe.width < 0 && pipe.isTop) {
                this.score++
                if (this.score > this.highScore) {
                    this.highScore = this.score
                    localStorage.setItem('highScore', this.highScore)
                }
                this.pipes.splice(pipeIdx, 1)
            }
        });

        this.drawScore()
    }

    draw() {
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    
        this.ctx.drawImage(this.sprites, gameTopBgSpriteX, gameTopBgSpriteY, gameTopBgWidth, gameTopBgHeight, this.backgroundX, gameTopGap, canvasWidth, gameTopBgHeight)
        this.ctx.drawImage(this.sprites, gameTopBgSpriteX, gameTopBgSpriteY, gameTopBgWidth, gameTopBgHeight, this.backgroundX + canvasWidth, gameTopGap, canvasWidth, gameTopBgHeight)

        this.ctx.drawImage(this.sprites, gameBottomBgSpriteX, gameBottomBgSpriteY, gameBottomBgWidth, gameBottomBgHeight, this.backgroundX, gameTopGap + gameTopBgHeight, canvasWidth, gameBottomBgHeight / 2)
        this.ctx.drawImage(this.sprites, gameBottomBgSpriteX, gameBottomBgSpriteY, gameBottomBgWidth, gameBottomBgHeight, this.backgroundX + canvasWidth, gameTopGap + gameTopBgHeight, canvasWidth, gameBottomBgHeight / 2)

        if (this.bird) {
            this.bird.draw(this.ctx)
        }
        this.pipes.forEach(pipe => pipe.draw(this.ctx))
        this.drawScore()
    }

    drawScore() {
        this.ctx.fillStyle = scoreTextColor
        this.ctx.font = scoreTextFont
        this.ctx.fillText(`Score: ${this.score}`, 10, 30)
        this.ctx.fillText(`Best: ${this.highScore}`, 10, 50)
    }

    generatePipes() {
        const gapPosition = Math.random() * (canvasHeight - gameBottomBgHeight / 2 - this.pipeGap)
        const upperPipe = new Pipe(canvasWidth, 0, this.pipeWidth, gapPosition, gameSprites, true, this.ctx)
        const lowerPipe = new Pipe(canvasWidth, gapPosition + this.pipeGap, this.pipeWidth, canvasHeight - gameBottomBgHeight / 2 - gapPosition - this.pipeGap, gameSprites, false, this.ctx)
        this.pipes.push(upperPipe, lowerPipe)
    }

    checkCollision(bird, pipe) {
        return (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            bird.y < pipe.y + pipe.height &&
            bird.y + bird.height > pipe.y
        )
    }

    endGame() {
        this.gameOver = true
    }

    restart() {
        this.bird = new Bird(50, (canvasHeight / 2) - (birdFrameHeight / 2), birdFrameWidth, birdFrameHeight, gameSprites, 3)
        this.pipes = []
        this.score = 0
        this.gameOver = false
    }

    start() {
        this.gameOver = false
        this.score = 0
        this.bird = new Bird(50, (canvasHeight / 2) - (birdFrameHeight / 2), birdFrameWidth, birdFrameHeight, gameSprites, 3)
        this.pipes = []
        this.loop()
    }
}