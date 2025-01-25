document.addEventListener('DOMContentLoaded', () => {
    // Constants for grid dimensions and game speed
    const GRID_WIDTH = 10;
    const GRID_HEIGHT = 20;
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;
    const MINI_GRID_SIZE = 16;
    const speed = 1000;

    // DOM elements for game and UI
    const grid = document.querySelector('.grid');
    const miniGrid = document.querySelector('.mini-grid');
    const scoreDisplay = document.querySelector('#score');
    const linesDisplay = document.querySelector('#lines');
    const startButton = document.querySelector('#start-button');

    // DOM elements for the hamburger menu and navigation
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const closeMenu = document.querySelector('.close-menu');
    const homeLink = document.querySelector('#home-link');
    const howToPlayLink = document.querySelector('#how-to-play-link');

    const squares = [];
    const miniSquares = [];
    let timerId;
    let score = 0;
    let lines = 0;

    function createGrid() {
        // Clear existing grid and mini-grid
        grid.innerHTML = '';
        miniGrid.innerHTML = '';
        squares.length = 0;
        miniSquares.length = 0;

        // Create main grid cells
        for (let i = 0; i < GRID_SIZE; i++) {
            const gridElement = document.createElement('div');
            grid.appendChild(gridElement);
            squares.push(gridElement);
        }
    
        // Add a bottom row with "taken" class for collision detection
        for (let i = 0; i < GRID_WIDTH; i++) {
            const gridElement = document.createElement('div');
            gridElement.setAttribute('class', 'taken');
            grid.appendChild(gridElement);
            squares.push(gridElement);
        }
    
        // Create cells for the mini-grid
        for (let i = 0; i < MINI_GRID_SIZE; i++) {
            const miniGridElement = document.createElement('div');
            miniGrid.appendChild(miniGridElement);
            miniSquares.push(miniGridElement);
        }
    }
    

    createGrid();


    // Tetromino configurations for the main grid and mini-grid
    const width = 10;
    const miniWidth = 4;

    const lTetromino = [
        [width, width+1, width+2, 2],
        [1, width+1, 2*width+1, 2*width+2],
        [2*width, width, width + 1, width +2],
        [0, 1, width+1, 2*width+1]
    ];

    const zTetromino = [
        [0, 1, width+1, width+2],
        [2, width+1, width+2, 2*width+1],
        [width, width + 1, 2 * width + 1, 2 * width + 2],
        [1, width, width + 1, 2*width]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [1,2, width+1,width+2],
        [1,2, width+1,width+2],
        [1,2, width+1,width+2],
        [1,2, width+1,width+2]
    ];

    const iTetromino = [
        [width,width+1,width+2,width+3],
        [2,width + 2, 2*width+2,3*width+2],
        [2*width, 2*width + 1, 2*width+2, 2*width+3],
        [1, width + 1, 2*width + 1, 3*width + 1]
    ];

    const sTetromino = [
        [1,2,width,width+1],
        [1,width+1,width+2,2*width+2],
        [width+1, width+2, 2*width, 2*width + 1],
        [0, width, width + 1, 2*width + 1]
    ];

    const jTetromino = [
        [0,width,width+1,width+2],
        [1,2,width+1,width*2+1],
        [width+1,width+2,width, 2*width+2],
        [1,width+1,width*2,width*2+1]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, sTetromino, jTetromino];

    const smallTetrominoes = [
        [1, 5, 9, 10],
        [1, 5, 6, 10],
        [1, 4, 5, 6],
        [1, 2, 5, 6],
        [1, 5, 9, 13],
        [2, 5, 6, 9],
        [1, 5, 9, 8]
    ];

    const colors = ['block-blue', 'block-green', 'block-navy', 'block-peach', 'block-pink', 'block-yellow', 'block-purple'];

    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];
    let nextRandom = Math.floor(Math.random() * theTetrominoes.length);

    // Draw the current Tetromino on the grid
    function draw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].classList.add(colors[random]);
        });
    }

    // Remove the current Tetromino from the grid
    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].classList.remove(colors[random]);
        });
    }

    // Display the next Tetromino in the mini-grid
    function displayNextTetromino() {
        miniSquares.forEach((square) => {
            square.classList.remove('tetromino');
            square.classList.remove(...colors);
        });

        smallTetrominoes[nextRandom].forEach((index) => {
            miniSquares[index].classList.add('tetromino');
            miniSquares[index].classList.add(colors[nextRandom]);
        });
    }

    // Move the Tetromino down by one row
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Check if the Tetromino should stop moving and freeze it
    function freeze() {
        if (current.some((index) => squares[currentPosition + index + width]?.classList.contains('taken'))) {
            current.forEach((index) => squares[currentPosition + index].classList.add('taken'));
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            addScore();
            draw();
            displayNextTetromino();
            gameOver();
        }
    }
    

    // Add score for cleared rows
    function addScore() {
        for (let i = GRID_HEIGHT - 1; i >= 0; i--) {
            const start = i * GRID_WIDTH;
            const row = Array.from({ length: GRID_WIDTH }, (_, index) => start + index);
    
            if (row.every((index) => squares[index].classList.contains('taken'))) {
                score += 10;
                lines++;
                scoreDisplay.textContent = score;
                linesDisplay.textContent = lines;
    
                row.forEach((index) => {
                    squares[index].classList.remove('taken', 'tetromino', ...colors);
                });
    
                const removedSquares = squares.splice(start, GRID_WIDTH);
                const emptySquares = Array.from({ length: GRID_WIDTH }, () => {
                    const emptySquare = document.createElement('div');
                    return emptySquare;
                });
    
                squares.unshift(...emptySquares);
                grid.innerHTML = '';
                squares.forEach((square) => grid.appendChild(square));
    
                // Recheck the same row after shifting down
                i++;
            }
        }
    }
    

    // End the game if a Tetromino cannot move
    let isGameOver = false;
    function gameOver() {
        if (current.some((index) => squares[currentPosition + index]?.classList.contains('taken'))) {
            scoreDisplay.textContent = 'Game Over';
            clearInterval(timerId);
            isGameOver = true;
        }
    }

    // Move the Tetromino to the right
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some((index) => squares[currentPosition + index]?.classList.contains('taken'))) currentPosition -= 1;
        draw();
    }

    // Move the Tetromino to the left
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some((index) => squares[currentPosition + index]?.classList.contains('taken'))) currentPosition += 1;
        draw();
    }

    
// Wall kick data for JLSTZ and I Tetrominoes
const wallKickData = {
    JLSTZ: {
        "0>R": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        "R>0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        "R>2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        "2>R": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        "2>L": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        "L>2": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        "L>0": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        "0>L": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    },
    I: {
        "0>R": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
        "R>0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
        "R>2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
        "2>R": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
        "2>L": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
        "L>2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
        "L>0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
        "0>L": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    },
    O: {}, // O Tetromino does not have wall kicks
};

// Rotate function with wall kick support
function rotate(isClockwise = true) {
    const nextRotation = (currentRotation + (isClockwise ? 1 : -1) + 4) % 4;
    const currentState = ["0", "R", "2", "L"][currentRotation];
    const nextState = ["0", "R", "2", "L"][nextRotation];

    // Select the correct kick data for the tetromino
    const kicks = random === 4 ? wallKickData.I[`${currentState}>${nextState}`] : wallKickData.JLSTZ[`${currentState}>${nextState}`] || [];

    const nextTetromino = theTetrominoes[random][nextRotation];

    // Validation helper
    const isValidPosition = (position, tetromino) => 
    tetromino.every((index) => {
        const newIndex = position + index;

        console.log(`Checking newIndex: ${newIndex}, Current Position: ${position}, Tetromino Index: ${index}`);

        // Bounds check
        if (newIndex < 0 || newIndex >= GRID_SIZE) {
            console.log(`Out of bounds: ${newIndex}`);
            return false;
        }

        // Prevent row wrapping
        const startCol = position % GRID_WIDTH;
        const endCol = (newIndex) % GRID_WIDTH;

        if (Math.abs(startCol - endCol) > index % GRID_WIDTH) {
            console.log(`Row wrapping detected: StartCol: ${startCol}, EndCol: ${endCol}`);
            return false;
        }

        // Check if position is taken
        if (squares[newIndex]?.classList.contains("taken")) {
            console.log(`Position taken: ${newIndex}`);
            return false;
        }

        return true;
    });

    

    // Attempt basic rotation
    if (isValidPosition(currentPosition, nextTetromino)) {
        undraw();
        currentRotation = nextRotation;
        current = nextTetromino;
        draw();
        return;
    }

    // Attempt wall kicks
    for (const [dx, dy] of kicks) {
        const offset = dx + dy * GRID_WIDTH;
        const newPosition = currentPosition + offset;
    
        console.log(`Testing kick offset: [${dx}, ${dy}] -> New Position: ${newPosition}`);
        
        if (isValidPosition(newPosition, nextTetromino)) {
            undraw();
            currentPosition = newPosition;
            currentRotation = nextRotation;
            current = nextTetromino;
            draw();
            return;
        }
    }
    

    console.log("Rotation failed: No valid positions found.");
}

    
    

    // Start or pause the game
    startButton.addEventListener('click', () => {
        if (isGameOver) {
            restartGame();
        } else {
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            } else {
                draw();
                timerId = setInterval(moveDown, speed);
                displayNextTetromino();
            }
        }
    });

    // Restart game with start/pause button
    function restartGame() {
        clearInterval(timerId);
        timerId = null;
    
        isGameOver = false;
        score = 0;
        lines = 0;
        scoreDisplay.textContent = score;
        linesDisplay.textContent = lines;
        currentPosition = 4;
        currentRotation = 0;
    
        grid.innerHTML = '';
        squares.length = 0;

        createGrid();

        random = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayNextTetromino();

        draw();
        timerId = setInterval(moveDown, speed);
    }

    // Handle keyboard controls for Tetromino movement
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') moveLeft();
        if (e.key === 'ArrowRight') moveRight();
        if (e.key === 'ArrowDown') moveDown();
        if (e.key === 'ArrowUp') rotate();
    });
    

    // Hamburger Menu Integration
    function pauseGame() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function resumeGame() {
        if (!timerId) {
            timerId = setInterval(moveDown, speed);
        }
    }

    // Open Menu
    hamburger.addEventListener('click', () => {
        menu.style.display = 'flex';
    });

    // Close Menu
    closeMenu.addEventListener('click', () => {
        menu.style.display = 'none';
    });

    // Navigate Back to Home
    homeLink.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Show How to Play Information
    howToPlayLink.addEventListener('click', () => {
        alert('How to Play:\n\n- Use Arrow Keys to move.\n- Rotate using Up Arrow.\n- Clear lines to score points.');
    });

    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'dark-mode-toggle';
    darkModeToggle.textContent = '🌙';
    document.body.appendChild(darkModeToggle);

    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = '☀️';
        } else {
            darkModeToggle.textContent = '🌙';
        }
    };

    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Optional: Save user preference for dark mode in localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Glow
    const glow = document.createElement('div');
    glow.classList.add('glow');
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
    const x = e.pageX; 
    const y = e.pageY; 

    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    });

});