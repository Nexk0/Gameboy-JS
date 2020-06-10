// Get the css buttons
const SCORETEXT = document.querySelector('.score')
const UPPERCROSS = document.querySelector('.upperCross')
const LOWERCROSS = document.querySelector('.lowerCross')
const LEFTCROSS = document.querySelector('.leftCross')
const RIGHTCROSS = document.querySelector('.rightCross')
const BUTTONA = document.querySelector('.buttonA')
const BUTTONB = document.querySelector('.buttonB')
// Directions
const RIGHT = 0 
const LEFT = 1
const UP = 2
const DOWN = 3
// Size (16 x 16 = 256, the size of the canvas)
const GRIDSIZE = 16
const TILESCOUNT = 16


let score = 0   // Score of the snake
let snakePositionX = 10  // Position X of the snake
let snakePositionY = 10     // Position Y of the snake
let appleX = 15     // Position X of the apple
let appleY = 15     // Position Y of the apple
let snakeVelocityX = 1 // Velocity X of the snake (going left or right)
let snakeVelocityY = 0 // Velocity X of the snake (going up or down)
let trail = []  // Array of the trail
let tail = 3    // "Lenght" of the snake
let currentDirection = RIGHT    // Current direction
let nextDirection = RIGHT       // Next direction (fixing the bug where you could die going to fast up and right for exemple)
// Boolean (explicit)
let isDead = false  
let isGameOn = false
let isThemePlaying = false
let isPowerOn = false
let isAPressed = false
let isBPressed = false
// Hide the score before the launch of the Gameboy
SCORETEXT.style.visibility = "hidden"

// Get even on the black button of the gameboy and launch the gameboy if clicked on
document.querySelector(".powerButton").addEventListener("click", function () {
    const loadingScreen = document.querySelector(".screenLoading")  // Get the loading screen (made in html and not in js directly, not a)
    const redButton = document.querySelector(".roundRedButton") // Get the redCircle (power On/off)
    const SCORETEXT = document.querySelector('.score')  // Get the score of the Snake Game
    SCORETEXT.style.visibility = "hidden"
    if (!isPowerOn) {
        this.style.marginLeft = "70px" // Make the black button goes right to make it looks like it start
        isPowerOn = true
        loadingScreen.style.visibility = "visible" // Make the loading screen appears
        setTimeout(function () {        // Make the loading screen disapear after 3000 milliseconds
            loadingScreen.style.visibility = "hidden"
        }, 3000)
        redButton.style.backgroundColor = '#e71e1e' // Make the red Power Button bright red
        setTimeout(function () {    // Launch the js Game after 4000 milliseconds and set interval time (how the snake is going to move per seconds)
            canvas = document.querySelector(".canvasGame")
            ctx = canvas.getContext("2d")
            startGame = setInterval(snakeGame, 1000 / 11)
            SCORETEXT.style.visibility = "visible"
            isGameOn = true
            stopGameIfpowerOff() // See Function below
        }, 4000)
    } else {
        this.style.marginLeft = "50px"  // Shutdown the gameboy, clearing the canvas, stopping the game and reseting the tail and the score incase the gameboy is launched after a shutdown after a game
        isPowerOn = false
        loadingScreen.style.visibility = "hidden"
        SCORETEXT.style.visibility = "hidden"
        redButton.style.backgroundColor = '#6e1e1e'
        clearInterval(startGame)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        score = 0
        document.querySelector('.score').innerText = score
        tail = 3
    }
})

function stopGameIfpowerOff() { // Fixing the bug where the game will still appears if the console was off
    if (isGameOn && !isPowerOn) {
        clearInterval(startGame)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        SCORETEXT.style.visibility = "hidden"
        score = 0
        document.querySelector('.score').innerText = score
        tail = 3
    }
}

function snakeGame() {  // The entier Snake game function
    currentDirection = nextDirection
    snakePositionX += snakeVelocityX
    snakePositionY += snakeVelocityY
    if (snakePositionX < 0) {       // how the snake is moving
        snakePositionX = TILESCOUNT - 1
    }
    if (snakePositionX > TILESCOUNT - 1) {
        snakePositionX = 0
    }
    if (snakePositionY < 0) {
        snakePositionY = TILESCOUNT - 1
    }
    if (snakePositionY > TILESCOUNT - 1) {
        snakePositionY = 0
    }
    ctx.fillStyle = "#6d7f2d"   // setting the canvas color
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "black" // Setting the snake color
    for (let i = 0; i < trail.length; i++) {    // Check if the snake is dead 
        ctx.fillRect(trail[i].x * GRIDSIZE, trail[i].y * GRIDSIZE, GRIDSIZE - 2, GRIDSIZE - 2) 
        if (trail[i].x == snakePositionX && trail[i].y == snakePositionY) {
            tail = 3
            isDead = true
            clearInterval(startGame)
            setTimeout(function () { // Needed to reset the canvas, if not the canvas would not be cleared and the snake would still appears on the Game Over screen
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = 'black'
                ctx.textBaseline = 'middle'
                ctx.textAlign = 'center'
                ctx.font = '14px Gameboy'
                ctx.fillText('You had ' + score + ' points', canvas.width / 2, canvas.height / 4)
                ctx.font = '28px Gameboy'
                ctx.fillText('Game over', canvas.width / 2, canvas.height / 2)
                ctx.font = '10px Gameboy'
                ctx.fillText('Press A to restart', canvas.width / 2, canvas.height / 3)
                ctx.font = '12px Gameboy'
            }, 10)

        }
    }
    trail.push({    // Pushing the snake trail on the canvas 
        x: snakePositionX,
        y: snakePositionY
    })
    while (trail.length > tail) {
        trail.shift()
    }
    if (appleX == snakePositionX && appleY == snakePositionY) { // Spawn the apple randomly on the screen, but never ON the snake, and add tail to the snake if he eat the apple; and redraw the apple if eaten
        tabY= []
        for (let i = 0; i < TILESCOUNT; i++) {
            let count = 0
            for (let j = 0; j < trail.length; j++) {
                if (trail[j].y == i) {
                    count++
                }               
            }
            if (count != TILESCOUNT - 1) {
                tabY.push(i)
            }
        }
        y = tabY[Math.floor(Math.random() * tabY.length)]
        tabX = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
        for (let i = 0; i < trail.length; i++) {
            if (trail[i].y == y) {
                index = tabX.indexOf(trail[i].x)
                tabX.splice(index, 1)
            }
        }
        x = tabX[Math.floor(Math.random() * tabX.length)]
        tail++ // Make the snake "bigger"
        score += 10 // Add score 
        document.querySelector('.score').innerText = score
        appleX = x
        appleY = y
    }
    ctx.fillStyle = "black"
    ctx.fillRect(appleX * GRIDSIZE, appleY * GRIDSIZE, GRIDSIZE - 2, GRIDSIZE - 2)
}

//Add onclick event on css button to make it work with keyboard OR the css buttons
UPPERCROSS.addEventListener('click', event => { 
    const evt = new KeyboardEvent('keydown', {
        'keyCode': 38
    })
    document.dispatchEvent(evt)
})

LOWERCROSS.addEventListener('click', event => {
    const evt = new KeyboardEvent('keydown', {
        'keyCode': 40
    })
    document.dispatchEvent(evt)
})

LEFTCROSS.addEventListener('click', event => {
    const evt = new KeyboardEvent('keydown', {
        'keyCode': 37
    })
    document.dispatchEvent(evt)
})

RIGHTCROSS.addEventListener('click', event => {
    const evt = new KeyboardEvent('keydown', {
        'keyCode': 39
    })
    document.dispatchEvent(evt)
})

BUTTONB.addEventListener('click', event => {
    const evt = new KeyboardEvent('keydown', {
        'keyCode': 69
    })
    document.dispatchEvent(evt)
})

BUTTONA.addEventListener('click', event => {
    const evt = new KeyboardEvent('keydown', {
        'keyCode': 65
    })
    document.dispatchEvent(evt)
})


// EventListener to check wich key is pressed and to move the snake so 
document.addEventListener("keydown", logKey => {
    let log = logKey.keyCode

    if (isDead && log == 65) {
        isDead = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        currentDirection = RIGHT
        score = 0
        document.querySelector('.score').innerText = score
        startGame = setInterval(snakeGame, 1000 / 11)
    } else
        switch (log) {
            case 37:
                if (currentDirection !== RIGHT) {
                    snakeVelocityX = -1
                    snakeVelocityY = 0
                    nextDirection = LEFT
                    LEFTCROSS.style.backgroundColor = "black"
                    setTimeout(function () {
                        LEFTCROSS.style.backgroundColor = "#292d3f"
                    }, 400)
                }
                break
            case 38:
                if (currentDirection !== DOWN) {
                    snakeVelocityX = 0
                    snakeVelocityY = -1
                    nextDirection = UP
                    UPPERCROSS.style.backgroundColor = "black"
                    setTimeout(function () {
                        UPPERCROSS.style.backgroundColor = "#292d3f"
                    }, 400)
                }
                break
            case 39:
                if (currentDirection !== LEFT) {
                    snakeVelocityX = 1
                    snakeVelocityY = 0
                    nextDirection = RIGHT
                    RIGHTCROSS.style.backgroundColor = "black"
                    setTimeout(function () {
                        RIGHTCROSS.style.backgroundColor = "#292d3f"
                    }, 400)
                }
                break
            case 40:
                if (currentDirection !== UP) {
                    snakeVelocityX = 0
                    snakeVelocityY = 1
                    nextDirection = DOWN
                    LOWERCROSS.style.backgroundColor = "black"
                    setTimeout(function () {
                        LOWERCROSS.style.backgroundColor = "#292d3f"
                    }, 400)
                }
                break
            case 65:
                BUTTONA.style.backgroundColor = "#ff0371"
                isAPressed = true
                setTimeout(function () {
                    BUTTONA.style.backgroundColor = "#bb316d"
                    isAPressed = false
                }, 400)
                break
            case 69:
                BUTTONB.style.backgroundColor = "#ff0371"
                isBPressed = true
                setTimeout(function () {
                    isBPressed = false
                    BUTTONB.style.backgroundColor = "#bb316d"
                }, 400)
                break
        }
})

document.querySelector(".helpMenu").addEventListener("click", function () { // I'm really sorry about this, the help menu wasn't supposed to appeared like that but I had to turn the project in right away
    this.style.visibility = "hidden"
})


