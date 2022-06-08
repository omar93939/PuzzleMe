const ROW_COUNT = getRowCount()
const GRID_SIZE = (ROW_COUNT * 106.25) + (ROW_COUNT * 15) + 15
let rows = []

export default class Grid {
    constructor(gridElement) {
        // Set game-container dimensions
        gridElement.parentElement.style.setProperty("--grid-size", `${GRID_SIZE}px`)
        // Set site-container dimensions
        gridElement.parentElement.parentElement.style.setProperty("--grid-size", `${GRID_SIZE}px`)
        // Create grid (rows & cells)
        rows = createRowElements(gridElement).map((rowElement, index) => {
            return new Row(
                rowElement,
                index % GRID_SIZE
            )
        })
        //console.log(rows)
    }

    get cells() {
        let cellList = []
        for (let i = 0; i < ROW_COUNT; i++) {
            for (let j = 0; j < ROW_COUNT; j++) {
                cellList.push(rows[i].cells[j])
            }
        }
        return cellList
    }

    get cellsByRow() {
        let rowGrid = []
        for (let i = 0; i < ROW_COUNT; i++) {
            rowGrid[i] = []
            for (let j = 0; j < ROW_COUNT; j++) {
                rowGrid[i].push(rows[i].cells[j])
            }
        }
        return rowGrid
    }

    get cellsByColumn() {
        let columnGrid = []
        for (let i = 0; i < ROW_COUNT; i++) {
            columnGrid[i] = []
            for (let j = 0; j < ROW_COUNT; j++) {
                columnGrid[i].push(rows[j].cells[i])
            }
        }
        return columnGrid
    }

    // Find a random empty cell (if the cell which was randomly selected is not empty, then it will proceed to the next cell)
    randomEmpty() {
        const randomRow = Math.floor(Math.random() * ROW_COUNT)
        const randomCell = Math.floor(Math.random() * ROW_COUNT)

        // Realized later that could have used do while instead. Didn't know js had do while.
        if (rows[randomRow].cells[randomCell].tile == null) {
            return rows[randomRow].cells[randomCell]
        }

        for (let j = (randomCell + 1) % ROW_COUNT; j % ROW_COUNT != randomCell; j++) {
            if (rows[randomRow].cells[j % ROW_COUNT].tile == null) {
                return rows[randomRow].cells[j % ROW_COUNT]
            }
        }

        for (let i = (randomRow + 1) % ROW_COUNT; i % ROW_COUNT != randomRow; i++) {
            if (rows[i % ROW_COUNT].cells[randomCell].tile == null) {
                return rows[i % ROW_COUNT].cells[randomCell]
            }
            for (let j = (randomCell + 1) % ROW_COUNT; j % ROW_COUNT != randomCell; j++) {
                if (rows[i % ROW_COUNT].cells[j % ROW_COUNT].tile == null) {
                    return rows[i % ROW_COUNT].cells[j % ROW_COUNT]
                }
            }
        }
        console.log("This should never be seen!!!!!!!!!!")
        return null
    }
}

class Row {
    #rowElement
    #cells
    #y
    constructor(rowElement, y) {
        this.#rowElement = rowElement
        this.#cells = createCellElements(rowElement).map((cellElement, index) => {
            return new Cell(
                cellElement,
                index % GRID_SIZE,
                y
            )
        })
        this.#y = y
    }

    get cells() {
        return this.#cells
    }

    get y() {
        return this.#y
    }

}

class Cell {
    #cellElement
    #x
    #y
    #tile
    #mergeTile
    constructor(cellElement, x, y) {
        this.#cellElement = cellElement
        this.#x = x
        this.#y = y
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    get tile() {
        return this.#tile
    }

    set tile(number) {
        this.#tile = number
        if (number == null) return
        this.#tile.x = this.#x
        this.#tile.y = this.#y
        rows[this.#y].cells[this.#x] = this
    }

    get mergeTile() {
        return this.#mergeTile
    }

    set mergeTile(number) {
        this.#mergeTile = number
        if (number == null) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
        rows[this.#y].cells[this.#x] = this
    }

    canMerge(tile) {
        if (this.tile == null || (this.tile.number == tile.number && this.mergeTile == null)) {
            return true
        }
        return false
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return
        // console.log(`${this.tile.number}, ` + this.mergeTile.number)
        this.tile.number = this.tile.number + this.mergeTile.number
        this.mergeTile.remove()
        this.mergeTile = null

        if (this.tile.number == 2048) {
            if (document.getElementById("history")) {
                const messageDiv = document.getElementById("game-message")

                if (!messageDiv.firstChild) {
                    let gameWin = document.createElement("p")
                    gameWin.innerHTML = "You Won!"
                    messageDiv.appendChild(gameWin)

                    let playAgain = document.createElement("form")
                    playAgain.setAttribute("method", "post")
                    let playAgainButton = document.createElement("input")
                    playAgainButton.setAttribute("type", "submit")
                    playAgainButton.setAttribute("value", "Submit Score")
                    playAgain.appendChild(playAgainButton)
                    playAgainButton.id = "play-again"

                    messageDiv.appendChild(playAgain)

                    messageDiv.style.setProperty("display", "flex")
                }
            }
        }
    }
}

function createRowElements(gridElement) {
    const rows = []
    for (let i = 0; i < ROW_COUNT; i++) {
        const row = document.createElement("div")
        row.classList.add("grid-row")
        rows.push(row)
        gridElement.append(row)
    }
    return rows
}

function createCellElements(row) {
    const cells = []
    for (let i = 0; i < ROW_COUNT; i++) {
        const cell = document.createElement("div")
        cell.classList.add("grid-cell")
        cells.push(cell)
        row.append(cell)
    }
    return cells
}

function getRowCount() {
    let path = window.location.pathname
    if (path == "/2048/easy") {
        return 6
    } else if (path == "/2048/medium") {
        return 5
    } else {
        return 4
    }
}
