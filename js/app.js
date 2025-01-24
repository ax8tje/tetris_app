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

    // Function to create the main grid and mini-grid
    function createGrid() {
        // Create main grid cells
        for (let i = 0; i < GRID_SIZE; i++) {
            const gridElement = document.createElement('div');
            grid.appendChild(gridElement);
        }

        // Add a bottom row with "taken" class for collision detection
        for (let i = 0; i < GRID_WIDTH; i++) {
            const gridElement = document.createElement('div');
            gridElement.setAttribute('class', 'taken');
            grid.appendChild(gridElement);
        }

        // Create cells for the mini-grid
        for (let i = 0; i < MINI_GRID_SIZE; i++) {
            const miniGridElement = document.createElement('div');
            miniGrid.appendChild(miniGridElement);
        }
    }

    createGrid();


    // Add all grid and mini-grid cells to respective arrays
    document.querySelectorAll('.grid div').forEach((div) => squares.push(div));
    document.querySelectorAll('.mini-grid div').forEach((div) => miniSquares.push(div));

    // Tetromino configurations for the main grid and mini-grid
    const width = 10;
    const miniWidth = 4;

    const lTetromino = [
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width, width + 1, width + 2, 2],
        [0, 1, width + 1, width * 2 + 1],
        [width, width + 1, width + 2, width * 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const sTetromino = [
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2]
    ];

    const jTetromino = [
        [1, width + 1, width * 2, width * 2 + 1],
        [0, width, width + 1, width + 2],
        [0, 1, width, width * 2],
        [0, 1, 2, width + 2]
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
            draw();
            displayNextTetromino();
            addScore();
            gameOver();
        }
    }
    

    // Add score for cleared rows
    function addScore() {
        for (let i = 0; i < GRID_HEIGHT; i++) {
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
            }
        }
    }
    
    
    

    // End the game if a Tetromino cannot move
    function gameOver() {
        if (current.some((index) => squares[currentPosition + index]?.classList.contains('taken'))) {
            scoreDisplay.textContent = 'Game Over';
            clearInterval(timerId);
        }
    }

    // Move the Tetromino to the left
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some((index) => squares[currentPosition + index]?.classList.contains('taken'))) currentPosition += 1;
        draw();
    }

    // Move the Tetromino to the right
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some((index) => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some((index) => squares[currentPosition + index]?.classList.contains('taken'))) currentPosition -= 1;
        draw();
    }

    // Rotate the Tetromino
    function rotate() {
        undraw();
        currentRotation = (currentRotation + 1) % current.length;
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    // Start or pause the game
    startButton.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, speed);
            displayNextTetromino();
        }
    });

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
