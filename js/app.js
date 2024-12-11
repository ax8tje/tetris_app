document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    const width = 10


    const lTetromino = [
        [1, width+1, width*2+1 ,2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0, width, width+1, width*2+1],
        [width + 1, width+2, width*2, width*2+1],
        [0,width,width+1,width*2+1],
        [width + 1, width+2,width*2, width*2+1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width + 1, width * 2 + 1, width + 2]
    ]

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const jTetromino = [
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width + 1, width + 2, width* 2 + 2],
        [1, width + 1, width * 2 + 1, 2],
        [0, width, width+1, width+2]
    ]
    

    const sTetromino = [
        [1, width + 1, width, width * 2],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [1, width + 1, width, width * 2],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const theTetrominoes = [jTetromino, lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //random Tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    console.log(random)
    let current = theTetrominoes[random][currentRotation]

    //drawing tetrominoes
    function draw(){
        current.forEach(index =>{
            squares[currentPosition + index].classList.add('tetromino')
        })
    }

    //undrawing tetrominoes
    function undraw(){
        current.forEach(index=>{
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

    //moving tetrominoes every second
    timerId = setInterval(moveDown, 1000)

    //assign functions to keys
    function control(e) {
        if(e.keyCode === 65){
            moveLeft()
        }
        if(e.keyCode === 68){
            moveRight()
        }
        if(e.keyCode === 87){
            rotate()
        }
        if(e.keyCode === 83){
            moveDown()
        }
    }
    document.addEventListener('keyup',control)


    //move down function
    function moveDown(){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze
    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            random = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
        }
    }

    //move left function
    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }
        draw()
    }
    //move right function
    function moveRight(){
        undraw()
        const isAtLeftRight = current.some(index => (currentPosition + index) % width === width - 1)

        if(!isAtLeftRight) currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()
    }
    //rotate function
    function rotate(){
        undraw()
        currentRotation++
        if(currentRotation === current.length){
            currentRotation=0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }
    








})