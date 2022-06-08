import Grid from "./Grid.js"
import Tile from "./Tile.js"

window.setupGameBoard = setupGameBoard

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

const gridContainer = document.getElementById("grid-container")
let grid = new Grid(gridContainer)

const messageDiv = document.getElementById("game-message")

setupGameBoard()

function setupGameBoard() {

    if (gridContainer.firstChild) {
        while (gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.firstChild)
        }
    }

    if (messageDiv.firstChild) {
        messageDiv.style.setProperty("display", "none")
        while (messageDiv.firstChild) {
            messageDiv.removeChild(messageDiv.firstChild)
        }
    }

    grid = new Grid(gridContainer)
    grid.randomEmpty().tile = new Tile(gridContainer)
    grid.randomEmpty().tile = new Tile(gridContainer)

    setupInput()

    // console.log(grid.cellsByColumn)

}

function setupInput() {
    
    window.addEventListener("keydown", handleInput, { once: true })
    window.addEventListener("keydown", disableArrowScroll)
}

function disableArrowScroll(event) {
    event.preventDefault()
}

async function handleInput(event) {
    switch(event.key) {
        case "ArrowUp":
        case "w":
            if (canMoveUp()) {
                await moveUp()
                break
            }
            setupInput()
            return
        case "ArrowDown":
        case "s":
            if (canMoveDown()) {
                await moveDown()
                break
            }
            setupInput()
            return
        case "ArrowRight":
        case "d":
            if (canMoveRight()) {
                await moveRight()
                break
            }
            setupInput()
            return
        case "ArrowLeft":
        case "a":
            if (canMoveLeft()) {
                await moveLeft()
                break
            }
            setupInput()
            return
        default:
            setupInput()
            return
    }

    grid.cells.forEach(cell => cell.mergeTiles())
    const newTile = new Tile(gridContainer)
    grid.randomEmpty().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveLeft()) {
        
        gameOver()
        // newTile.animation(true).then(() => {
        //     alert("You Lose")
        // })
        return
    }

    setupInput()
}

function gameOver() {
    
    if (!messageDiv.firstChild) {
        let gameOver = document.createElement("p")
        gameOver.innerHTML = "Game over!"
        messageDiv.appendChild(gameOver)

        let playAgain = document.createElement("button")
        playAgain.setAttribute("onclick", "setupGameBoard()")
        playAgain.id = "play-again"
        playAgain.innerHTML = "Play Again"

        messageDiv.appendChild(playAgain)

        messageDiv.style.setProperty("display", "flex")
    }
}

// playAgain.appendChild(document.createElement("input").setAttribute("type", "submit").setAttribute("name", "win").setAttribute("value", "Submit Score"))

function canMoveUp() {
    // console.log(canMove(grid.cellsByColumn))
    return canMove(grid.cellsByColumn)
}

function canMoveDown() {
    // console.log(canMove(grid.cellsByColumn.map(row => [...row].reverse())))
    return canMove(grid.cellsByColumn.map(row => [...row].reverse()))
}

function canMoveRight() {
    // console.log(canMove(grid.cellsByRow.map(row => [...row].reverse())))
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMoveLeft() {
    // console.log(canMove(grid.cellsByRow))
    return canMove(grid.cellsByRow)
}

function canMove(cells) {
    return cells.some(columnOrRow => {
        return columnOrRow.some((cell, index) => {
            if (index == 0) return false
            if (cell.tile == null) return false
            const futureCell = columnOrRow[index - 1]
            return futureCell.canMerge(cell.tile)
        })
    })
}

function moveUp() {
    return slideTiles(grid.cellsByColumn)
}

function moveDown() {
    return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    return slideTiles(grid.cellsByRow)
}

function moveRight() {
    return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
    cells.flatMap(columnOrRow => {
        const promises = []
        for (let i = 1; i < columnOrRow.length; i++) {
            const cell = columnOrRow[i]
            if (cell.tile == null) continue
            let lastValidCell
            for (let j = i - 1; j >= 0; j--) {
                const futureCell = columnOrRow[j]
                if (!futureCell.canMerge(cell.tile)) break
                lastValidCell = futureCell
            }
            if (lastValidCell != null) {
                promises.push(cell.tile.animation())
                if (lastValidCell.tile != null) {
                    lastValidCell.mergeTile = cell.tile
                } else {
                    lastValidCell.tile = cell.tile
                }
                cell.tile = null
            }
        }
        return promises
    }))
}
