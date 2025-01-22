document.addEventListener('DOMContentLoaded', () => {
    const GRID_WIDTH = 10; // Main grid width
    const GRID_HEIGHT = 20; // Main grid height
    const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT; // Total size of the grid
    const MINI_GRID_SIZE = 16; // Size of the mini-grid (4x4)
    const speed = 1000;

    const grid = document.querySelector('.grid');
    const miniGrid = document.querySelector('.mini-grid');
    const scoreDisplay = document.querySelector('#score');
    const linesDisplay = document.querySelector('#lines');
    const startButton = document.querySelector('#start-button');

    const squares = [];
    const miniSquares = [];
    let timerId;
    let score = 0;
    let lines = 0;

    // Function to dynamically create the grids
    function createGrid() {
        // Create main grid
        for (let i = 0; i < GRID_SIZE; i++) {
            const gridElement = document.createElement('div');
            grid.appendChild(gridElement);
        }

        // Base row for the main grid
        for (let i = 0; i < GRID_WIDTH; i++) {
            const gridElement = document.createElement('div');
            gridElement.setAttribute('class', 'taken');
            grid.appendChild(gridElement);
        }

        // Create mini-grid for the next Tetromino display
        for (let i = 0; i < MINI_GRID_SIZE; i++) {
            const miniGridElement = document.createElement('div');
            miniGrid.appendChild(miniGridElement);
        }
    }

    // Initialize grids
    createGrid();

    // Initialize square arrays for main and mini grids
    document.querySelectorAll('.grid div').forEach((div) => squares.push(div));
    document.querySelectorAll('.mini-grid div').forEach((div) => miniSquares.push(div));

    const width = 10;
    const miniWidth = 4;

     // Tetromino definitions
     const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
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
        [1, width, width + 1, width*2],
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width*2],
        [0, 1, width + 1, width + 2],
    ];

    const jTetromino = [
        [1, width+1, width*2, width*2+1],
        [0, width, width+1,width+2 ],
        [0, 1, width, width * 2],
        [0, 1, 2, width + 2],
    ];

    const theTetrominoes = [
        lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, sTetromino, jTetromino
    ];

    const smallTetrominoes = [
        [1, 5, 9, 2], // lTetromino
        [0, 4, 5, 9], // zTetromino
        [1, 4, 5, 6], // tTetromino
        [0, 1, 4, 5], // oTetromino
        [1, 5, 9, 13], // iTetromino
        [1, 4, 5, 8], // sTetromino
        [0, 4, 5, 6] // jTetromino
    ];

    const colors = [
        'block-blue', 'block-green', 'block-navy', 'block-peach', 'block-pink', 'block-yellow', 'block-purple'
    ];

    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];
    let nextRandom = Math.floor(Math.random() * theTetrominoes.length);

    // Tetromino functions (draw, undraw, moveDown, freeze, etc.)
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].classList.add(colors[random]);
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].classList.remove(colors[random]);
        });
    }

    function displayNextTetromino() {
        miniSquares.forEach(square => {
            square.classList.remove('tetromino');
            square.classList.remove(...colors);
        });

        smallTetrominoes[nextRandom].forEach(index => {
            miniSquares[index].classList.add('tetromino');
            miniSquares[index].classList.add(colors[nextRandom]);
        });
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width]?.classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index]?.classList.add('taken'));
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

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => squares[index]?.classList.contains('taken'))) {
                score += 10;
                lines++;
                scoreDisplay.textContent = score;
                linesDisplay.textContent = lines;

                // Remove the row and clear Tetromino classes
                row.forEach(index => {
                    squares[index]?.classList.remove('taken', 'tetromino', ...colors);
                });

                // Shift down the rows above
                const removedSquares = squares.splice(i, width);
                squares.unshift(...removedSquares);
                squares.forEach(cell => grid.appendChild(cell));

                // Re-check and undraw any active Tetromino overlapping the cleared rows
                undraw();
                draw();
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
            scoreDisplay.textContent = 'Game Over';
            clearInterval(timerId);
        }
    }

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

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') moveLeft();
        if (e.key === 'ArrowRight') moveRight();
        if (e.key === 'ArrowDown') moveDown();
        if (e.key === 'ArrowUp') rotate();
    });

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index]?.classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotate() {
        undraw();
        currentRotation = (currentRotation + 1) % current.length;
        current = theTetrominoes[random][currentRotation];
        draw();
    }
});
