document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button');
    const width = 10;

    // Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width + 1, width * 2 + 1, width + 2],
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ];

    const jTetromino = [
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width + 1, width + 2, 2],
        [1, width + 1, width * 2 + 1, 0],
        [width, 0, 1, 2],
    ];

    const sTetromino = [
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2],
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, jTetromino, sTetromino];
    let currentPosition = 4;
    let currentRotation = 0;

    // Select a random Tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];
    let nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    let timerId;
    const normalSpeed = 1000;
    let score = 0;

    // Moving Tetromino 1 sec after touching taken tile
    let graceTimeLeft = 0;
    const graceDuration = 1000;

    // Draw and undraw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
        });
    }

    // Move Tetromino down
    function moveDown() {
        if(graceTimeLeft > 0){
            return;
        }
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    // Freeze Tetromino
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            if(graceTimeLeft === 0){
                graceTimeLeft = graceDuration;
                setTimeout(()=>{
                    if(current.some(index => squares[currentPosition + index+ width].classList.contains('taken'))) {
                        current.forEach(index => squares[currentPosition+index].classList.add('taken'))

                        // Start a new Tetronimo
                        random = nextRandom;
                        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
                        current = theTetrominoes[random][currentRotation];
                        currentPosition = 4;

                        draw();
                        displayNextTetromino();
                        addScore();
                        gameOver();
                    }
                    graceTimeLeft = 0;
                }, graceDuration);
            }
        }
    }

    // Move the Tetromino left, unless at the edge or there's a blockage
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        graceTimeLeft = 0;
        draw();
    }

    // Move the Tetromino right, unless at the edge or there's a blockage
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        graceTimeLeft = 0;
        draw();
    }

    // Rotate the Tetromino
    function rotate() {
        undraw();
        currentRotation = (currentRotation + 1) % current.length;
        current = theTetrominoes[random][currentRotation];
        graceTimeLeft = 0; 
        draw();
    }

    // Add functionality to the controls
    function control(e) {
        if (e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        } else if (e.key === 'ArrowUp') {
            rotate();
        } else if (e.key === 'ArrowDown') {
            moveDown();
        }
    }

    document.addEventListener('keydown', control);

    // Show the next up Tetromino in the mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth], // jTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // sTetromino
    ];

    function displayNextTetromino() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        });
    }

    // Add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                ScoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                });
                const removedSquares = squares.splice(i, width);
                squares.unshift(...removedSquares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    // Game Over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            ScoreDisplay.innerHTML = 'Game Over';
            clearInterval(timerId);
        }
    }

    // Start Button
    StartBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, normalSpeed);
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            displayNextTetromino();
        }
    });
});
