// Audio elements
const moveSound = document.getElementById("move-sound");
const rotateSound = document.getElementById("rotate-sound");
const dropSound = document.getElementById("drop-sound");
const clearSound = document.getElementById("clear-sound");
const gameoverSound = document.getElementById("gameover-sound");
const levelupSound = document.getElementById("levelup-sound");

// Audio control functions
function playMoveSound() {
    moveSound.currentTime = 0;
    moveSound.play().catch(e => console.log("Audio play failed:", e));
}

function playRotateSound() {
    rotateSound.currentTime = 0;
    rotateSound.play().catch(e => console.log("Audio play failed:", e));
}

function playDropSound() {
    dropSound.currentTime = 0;
    dropSound.play().catch(e => console.log("Audio play failed:", e));
}

function playClearSound() {
    clearSound.currentTime = 0;
    clearSound.play().catch(e => console.log("Audio play failed:", e));
}

function playGameoverSound() {
    gameoverSound.currentTime = 0;
    gameoverSound.play().catch(e => console.log("Audio play failed:", e));
}

function playLevelupSound() {
    levelupSound.currentTime = 0;
    levelupSound.play().catch(e => console.log("Audio play failed:", e));
}

class Tetris {
    constructor(imageX, imageY, template){
        this.imageY = imageY;
        this.imageX = imageX;
        this.template = template;
        this.x = squareCountX / 2;
        this.y = 0;
    }

    checkBottom(){
        for( let i = 0; i < this.template.length; i++){
            for( let j = 0; j < this.template.length; j++){
                if(this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realY + 1 >= squareCountY) {
                    return false;
                }
                if (gameMap[realY + 1][realX].imageX != -1){
                    return false;
                }
            }
        }
        return true;
    }

    getTruncedPosition(){
        return {x: Math.trunc(this.x), y: Math.trunc(this.y)};
    }

    checkLeft(){
        for(let i = 0; i < this.template.length; i++){
            for(let j = 0; j< this.template.length; j++){
                if(this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if(realX - 1 < 0){
                    return false;
                }
                if (gameMap[realY][realX - 1].imageX != -1) return false;
            }
        }
        return true;
    }

    checkRight() {
        for(let i = 0; i < this.template.length; i++){
            for(let j = 0; j< this.template.length; j++){
                if(this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if(realX + 1 >= squareCountX){
                    return false;
                }
                if (gameMap[realY][realX + 1].imageX != -1) return false;
            }
        }
        return true;
    }

    moveRight() {
        if (this.checkRight()){
            this.x += 1;
            playMoveSound();
        }
    }

    moveLeft() {
        if(this.checkLeft()){
            this.x -= 1;
            playMoveSound();
        }
    }

    moveBottom() {
        if(this.checkBottom()){
            this.y += 1;
            score += 1;
            playDropSound();
        }
    }

    changeRotation(){
        let tempTemplate = [];
        for(let i = 0; i < this.template.length; i++)
            tempTemplate[i] = this.template[i].slice();
        let n = this.template.length;
        for(let layer = 0; layer < n/2; layer++){
            let first = layer;
            let last = n - 1 - layer;
            for(let i = first; i < last; i++){
                let offset = i - first;
                let top = this.template[first][i];
                this.template[first][i] = this.template[i][last] //top = right
                this.template[i][last] = this.template[last][last - offset] //right = bottom
                this.template[last][last - offset] = this.template[last - offset][first]; //bottom = left
                this.template[last - offset][first] = top; //left = top
            }
        }
         for(let i = 0; i < this.template.length; i++){
            for(let j = 0; j< this.template.length; j++){
                if(this.template[i][j] == 0) continue;
                let realX = i + this.getTruncedPosition().x;
                let realY = j + this.getTruncedPosition().y;
                if (realX < 0 || realX >= squareCountX || realY < 0 || realY >= squareCountY) {
                    this.template = tempTemplate;
                    return false;
                }
                if (gameMap[realY][realX - 1].imageX != -1) return false;
            }
        }
        playRotateSound();
        return true;
    }
}

const imageSquareSize  = 24 
const size = 40
const framePerSecond = 24
const gameSpeed = 2
const canvas = document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const image = document.getElementById("image");
const ctx = canvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");
let squareCountX = 10; // Standard Tetris width
let squareCountY = 20; // Standard Tetris height
let currentSize = 0; // Will hold the calculated block size
let baseGameSpeed = 2; // Default speed
let currentGameSpeed = baseGameSpeed;
let speedIncreaseThreshold = 4000; // Score needed to increase speed
let speedIncreaseAmount = 0.5; // How much faster it gets
let manualSpeedMultiplier = 1;

const shapes = [
    new Tetris(0, 120, [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
    ]),
    new Tetris(0, 96, [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
    ]),
    new Tetris(0, 72, [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
    ]),
    new Tetris(0, 48, [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
    ]),
    new Tetris(0, 24, [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ]),   
    new Tetris(0, 0, [
        [1, 1],
        [1, 1],
    ]),
    new Tetris(0, 48, [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
    ]),
];

let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score;
let initialTwoDArr;
let whiteLineThickness = 4;
let highScore = localStorage.getItem('tetrisHighScore') || 0;

let gameLoop = () => {
    setInterval(update, 1000 / (currentGameSpeed * manualSpeedMultiplier));
    setInterval(draw, 1000 / framePerSecond);
};

let deleteCompeleteRows = () => {
    let rowsCleared = 0;
    for(let i = 0; i < gameMap.length; i++){
        let t = gameMap[i];
        let isComplete = true;
        for(let j = 0; j < t.length; j++){
            if(t[j].imageX == -1) isComplete = false;
        }
        if(isComplete){
            rowsCleared++;
            console.log("complete row");
            score += 1000;
            updateHighScore();
            for(let k = i; k >0 ; k--){
                gameMap[k] = gameMap[k - 1];
            }
            let temp = [];
            for(let j = 0; j < squareCountX; j++){
                temp.push({imageX: -1, imageY: -1});
            }
            gameMap[0] = temp;
        }
    }
    if (rowsCleared > 0) {
        playClearSound();
    }
}

let update = () => {
    if(gameOver) return;
    if(score >= speedIncreaseThreshold && currentGameSpeed < 10) {
        speedIncreaseThreshold *= 2; // Double next threshold
        currentGameSpeed += speedIncreaseAmount;
        playLevelupSound();
        console.log("Speed increased to:", currentGameSpeed);
    }
    
    if(currentShape.checkBottom()){
        currentShape.y += 1;
    } else {
        for( let k = 0; k < currentShape.template.length; k++){
            for(let l = 0; l < currentShape.template.length; l++){
                if( currentShape.template[k][l] == 0) continue;
                gameMap[currentShape.getTruncedPosition().y + l][currentShape.getTruncedPosition().x + k] = 
                {imageX: currentShape.imageX, imageY: currentShape.imageY};
            }
        }
        deleteCompeleteRows();
        currentShape = nextShape;
        nextShape = getRandomShape();
        if(!currentShape.checkBottom()){
            gameOver = true;
            updateHighScore();
            playGameoverSound();
        }
        score += 10;
        updateHighScore();
    }
};

let resizeCanvas = () => {
    const container = document.getElementById('canvas-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Calculate block size to maintain aspect ratio
    const blockSizeWidth = containerWidth / squareCountX;
    const blockSizeHeight = containerHeight / squareCountY;
    currentSize = Math.min(blockSizeWidth, blockSizeHeight);
    
    // Set canvas dimensions
    canvas.width = currentSize * squareCountX;
    canvas.height = currentSize * squareCountY;
    
    // Resize next shape and score canvases
    const sidePanelSize = Math.min(containerWidth * 0.2, 100);
    nextShapeCanvas.width = sidePanelSize;
    nextShapeCanvas.height = sidePanelSize;
    scoreCanvas.width = sidePanelSize;
    scoreCanvas.height = sidePanelSize;
    
    // Redraw if game is running
    if (currentShape) {
        draw();
    }
    if (gameOver) {
        drawGameOver();
    }
};

let updateHighScore = () => {
    try {
        const currentScoreNum = Number(score);
        const highScoreNum = Number(localStorage.getItem('tetrisHighScore')) || 0;
        if (currentScoreNum > highScoreNum) {
            localStorage.setItem('tetrisHighScore', currentScoreNum);
            highScore = currentScoreNum;
        }
    } catch (e) {
        console.error("LocalStorage error:", e);
    }
    updateHighScoreDisplay();
};

let updateHighScoreDisplay = () => {
    const highScoreElement = document.getElementById('high-score-display');
    if (highScoreElement) {
        highScoreElement.innerHTML = `High Score: <span id="high-score">${highScore}</span>`;
    }
};

// Modify drawing functions to use currentSize instead of size
let drawRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

let drawBackground = () => {
    // Draw main background
    drawRect(0, 0, canvas.width, canvas.height, '#bca0dc');
    
    // Draw vertical borders (left and right)
    const borderWidth = whiteLineThickness;

    // Top border
    drawRect(
        0,
        0,
        canvas.width,
        borderWidth,
        "white"
    );
    
    // Left border
    drawRect(
        0, // Start at left edge
        0,
        borderWidth,
        canvas.height,
        "white"
    );
    
    // Right border
    drawRect(
        canvas.width - borderWidth, 
        0,
        borderWidth,
        canvas.height,
        "white"
    );

    for(let i = 0; i < squareCountX + 1; i++){
        drawRect(
            currentSize * i - whiteLineThickness,
            0,
            whiteLineThickness,
            canvas.height,
            "white"
        );
    }

    for(let i = 0; i < squareCountY + 1; i++){
        drawRect(
            0,
            currentSize * i - whiteLineThickness,
            canvas.width,
            whiteLineThickness,
            "white"
        );
    }
};

let drawCurrentTetris = () => {
    for(let i = 0; i < currentShape.template.length; i++){
        for(let j = 0; j < currentShape.template.length; j++){
            if(currentShape.template[i][j] == 0) continue;
            ctx.drawImage(
                image,
                currentShape.imageX,
                currentShape.imageY,
                imageSquareSize,
                imageSquareSize,
                Math.trunc(currentShape.x) * currentSize + currentSize * i,
                Math.trunc(currentShape.y) * currentSize + currentSize * j,
                currentSize,
                currentSize
            );
        }
    }
};

let drawSquares = () => {
    for(let i = 0; i < gameMap.length; i++){
        let t = gameMap[i];
        for(let j = 0; j < t.length; j++){
            if(t[j].imageX == -1) continue;
            ctx.drawImage(
                image, 
                t[j].imageX,
                t[j].imageY,
                imageSquareSize,
                imageSquareSize,
                j * currentSize,
                i * currentSize,
                currentSize,
                currentSize 
            );
        }
    }
};

let drawNextShape = () => {
    nctx.fillStyle = "#bca0dc";
    nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    
    // Calculate size based on canvas dimensions
    const boxSize = Math.min(nextShapeCanvas.width, nextShapeCanvas.height) * 0.8;
    const blockSize = boxSize / 4;
    const offsetX = (nextShapeCanvas.width - (nextShape.template.length * blockSize)) / 2;
    const offsetY = (nextShapeCanvas.height - (nextShape.template.length * blockSize)) / 2;

    for(let i = 0; i < nextShape.template.length; i++) {
        for(let j = 0; j < nextShape.template.length; j++) {
            if(nextShape.template[i][j] == 0) continue;
            nctx.drawImage(
                image,
                nextShape.imageX,
                nextShape.imageY,
                imageSquareSize,
                imageSquareSize,
                offsetX + blockSize * i,
                offsetY + blockSize * j,
                blockSize,
                blockSize
            );
        }
    }
};

let drawScore = () => {
    sctx.fillStyle = "#bca0dc";
    sctx.fillRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    
    const fontSize = Math.min(scoreCanvas.width * 0.2, scoreCanvas.height * 0.5);
    sctx.font = `bold ${fontSize}px Poppins`;
    sctx.fillStyle = "white";
    sctx.textAlign = "center";
    sctx.textBaseline = "middle";
    sctx.fillText(score.toString(), scoreCanvas.width / 2, scoreCanvas.height / 2);
};

let drawGameOver = () => {
    const gameOverText = document.getElementById('gameOverText');
    
    // Calculate responsive font size based on canvas dimensions
    const fontSize = Math.min(canvas.width * 0.1, canvas.height * 0.1);
    gameOverText.style.display = 'block';
    gameOverText.style.fontSize = `${fontSize}px`;
    gameOverText.style.fontFamily = 'Poppins, sans-serif';
    gameOverText.style.fontWeight = 'bold';
    
    if (window.innerWidth > window.innerHeight) {
        gameOverText.style.fontSize = '3vw';
    }
};

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawSquares();
    drawCurrentTetris();
    drawNextShape();
    drawScore();
    
    if (gameOver) {
        drawGameOver();
    } else {
        document.getElementById('gameOverText').style.display = 'none';
    }
};

let getRandomShape = () => {
    return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

let resetVars = () => {
    initialTwoDArr = []
    for(let i= 0; i < squareCountY; i++){
        let temp = [];
        for (let j = 0; j < squareCountX; j++){
            temp.push({ imageX: -1, imageY: -1});
        }
        initialTwoDArr.push(temp)
    }
    score = 0;
    gameOver = false;
    currentGameSpeed = baseGameSpeed;
    speedIncreaseThreshold = 4000;
    const savedSpeed = localStorage.getItem('tetrisSpeed');
    if(savedSpeed) {
        manualSpeedMultiplier = parseFloat(savedSpeed);
    }
    currentShape = getRandomShape();
    nextShape = getRandomShape();
    gameMap = initialTwoDArr;
    highScore = Number(localStorage.getItem('tetrisHighScore')) || 0;
    updateHighScoreDisplay(); 
    document.getElementById('gameOverText').style.display = 'none';
};

window.addEventListener("keydown", (event) => {
    if(event.keyCode == 37)
        currentShape.moveLeft();
    else if (event.keyCode == 38)
        currentShape.changeRotation();
    else if (event.keyCode == 39)
        currentShape.moveRight();
    else if (event.keyCode == 40)
        currentShape.moveBottom();
});


// Add mobile controls
document.getElementById('left-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    currentShape.moveLeft();
});
document.getElementById('right-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    currentShape.moveRight();
});
document.getElementById('rotate-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    currentShape.changeRotation();
});
document.getElementById('down-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    currentShape.moveBottom();
});
// Back button functionality
document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// For touch devices
document.getElementById('back-btn').addEventListener('touchend', (e) => {
    e.preventDefault();
    window.location.href = 'index.html';
});

// Also add click events for devices that might use mouse on mobile
document.getElementById('left-btn').addEventListener('click', () => currentShape.moveLeft());
document.getElementById('right-btn').addEventListener('click', () => currentShape.moveRight());
document.getElementById('rotate-btn').addEventListener('click', () => currentShape.changeRotation());
document.getElementById('down-btn').addEventListener('click', () => currentShape.moveBottom());

// Handle swipe gestures for better mobile control
let touchStartX = 0;
let touchStartY = 0;
let lastSwipeTime = 0;
let swipeCooldown = 200; // milliseconds between swipes
let downInterval; 
let lastTap = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    
    // For touch-only mode, add a tap handler for rotation
    if (touchOnlyMode) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            // Double tap for rotation
            currentShape.changeRotation();
        }
        
        lastTap = currentTime;
    }
}, {passive: false});

const swipeThreshold = 100; // pixels per move (tweak to sensitivity)

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;

    const diffX = touchCurrentX - touchStartX;
    const diffY = touchCurrentY - touchStartY;

    // Horizontal movement
    if (diffX > swipeThreshold) {
        currentShape.moveRight();
        touchStartX = touchCurrentX; // reset start point after move
    } else if (diffX < -swipeThreshold) {
        currentShape.moveLeft();
        touchStartX = touchCurrentX;
    }

    // Vertical movement (soft drop)
    if (diffY > swipeThreshold) {
        currentShape.moveBottom();
        touchStartY = touchCurrentY;
    }
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    
    // For final swipe detection (more prominent thresholds)
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30) { // Increased from 20 to 30
            currentShape.moveRight();
        } else if (diffX < -30) { // Increased from -20 to -30
            currentShape.moveLeft();
        }
    } 
    // Vertical swipe
    else {
        if (diffY > 40) { // Increased from 30 to 40
            currentShape.moveBottom();
        } else if (diffY < -40) { // Increased from -30 to -40
            currentShape.changeRotation();
        }
    }
    
    // Stop any continuous movement
    clearInterval(downInterval);
}, {passive: false});

let moveInterval;

function startMove(direction) {
    clearInterval(moveInterval);

    // Always fetch the latest move speed from localStorage
    let moveSpeed = parseInt(localStorage.getItem('tetrisMoveSpeed')) || 200;

    if (direction === 'left') currentShape.moveLeft();
    if (direction === 'right') currentShape.moveRight();

    moveInterval = setInterval(() => {
        if (direction === 'left') currentShape.moveLeft();
        if (direction === 'right') currentShape.moveRight();
    }, moveSpeed);
}

document.getElementById('left-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    startMove('left');
});

document.getElementById('right-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    startMove('right');
});

// Stop on release
['left-btn', 'right-btn'].forEach(id => {
    document.getElementById(id).addEventListener('touchend', (e) => {
        e.preventDefault();
        clearInterval(moveInterval);
    });
    document.getElementById(id).addEventListener('touchcancel', (e) => {
        e.preventDefault();
        clearInterval(moveInterval);
    });
});

// Smoother down button implementation
document.getElementById('down-btn').addEventListener('touchstart', (e) => {
    e.preventDefault();
    // Immediate movement
    currentShape.moveBottom();
    
    // Clear any existing interval
    clearInterval(downInterval);
    
    // Start continuous movement after a brief delay
    downInterval = setInterval(() => {
        currentShape.moveBottom();
    }, 150); // Faster repeat for smoother down movement (50ms)
});

// Clear intervals when touch ends
['left-btn', 'right-btn', 'down-btn'].forEach(id => {
    document.getElementById(id).addEventListener('touchend', (e) => {
        e.preventDefault();
        clearInterval(downInterval);
    });
    
    document.getElementById(id).addEventListener('touchcancel', (e) => {
        e.preventDefault();
        clearInterval(downInterval);
    });
});

let touchOnlyMode = false;

function initTouchOnlyMode() {
    // Load saved preference
    const savedMode = localStorage.getItem('tetrisTouchOnlyMode');
    if (savedMode === 'true') {
        touchOnlyMode = true;
        document.body.classList.add('touch-only-mode');
        
        // Hide only the control buttons in touch-only mode
        const controlsContainer = document.querySelector('.controls-container');
        if (controlsContainer) {
            controlsContainer.style.display = 'none';
        }
    }
}


window.addEventListener('load', function() {
    setTimeout(() => {
        const loading = document.getElementById('game-loading');
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }, 7000); // Show for at least 1 second
});

let initGame = () => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    resetVars();
    gameLoop();
    initTouchOnlyMode(); 
};

const loadingTips = [
    "Did you know? The Tetris theme song is called 'Korobeiniki'",
    "Tip: Press 'Up' to rotate pieces",
    "Fun fact: Tetris was created in 1984 by Alexey Pajitnov",
    "Strategy: Leave space for the I-block to clear 4 lines at once"
];

// Configuration - Adjust these for desired duration
const MIN_LOADING_TIME = 7000; // 7 seconds total loading time
const PROGRESS_UPDATE_INTERVAL = 50; // More frequent updates (ms)
const BASE_INCREMENT = 0.5; // Tiny base increment (%)
const RANDOM_INCREMENT = 1.5; // Small random boost (%)

function initLoadingScreen() {
    const loadingScreen = document.getElementById('game-loading');
    const progressFill = document.querySelector('.progress-fill');
    const loadingTip = document.getElementById('loading-tip');
    const startTime = Date.now();
    
    // Show random tip
    loadingTip.textContent = loadingTips[Math.floor(Math.random() * loadingTips.length)];
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        // Calculate time-based progress (0-100 over MIN_LOADING_TIME)
        const elapsed = Date.now() - startTime;
        const timeRatio = Math.min(elapsed / MIN_LOADING_TIME, 1);
        
        // Smooth progress calculation
        progress = Math.min(
            progress + BASE_INCREMENT + (Math.random() * RANDOM_INCREMENT),
            timeRatio * 100
        );
        
        progressFill.style.width = `${progress}%`;
        
        // Complete only after full time elapsed and progress reaches 100%
        if (progress >= 100 && elapsed >= MIN_LOADING_TIME) {
            clearInterval(interval);
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                initGame();
            }, 500);
        }
    }, PROGRESS_UPDATE_INTERVAL);
}

window.addEventListener('load', initLoadingScreen);

// Add event listener for the mobile replay button
document.getElementById('mobile-replay-btn').addEventListener('click', () => {
    resetVars();
});

document.getElementById('mobile-replay-btn').addEventListener('touchend', (e) => {
    e.preventDefault();
    resetVars();
});