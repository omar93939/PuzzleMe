const BACKGROUND_COLOR = ["#eee4da", "#eee1c9", "#f3b27a", "#f69664", "#f77c5f", "#f75f3b", "#edd073", "#edcc62", "#edc950", "#edc53f", "#edc22e"]

export default class Tile {
    #tileElement
    #x
    #y
    #innertile
    #number
    constructor(gridContainer, number = (Math.random() > 0.5) ? 2 : 4 ) {
        this.#tileElement = document.createElement("div")
        this.#tileElement.classList.add("tile")
        this.#innertile = document.createElement("div")
        this.#innertile.classList.add("tile-inner")
        this.#innertile.textContent = number
        this.#tileElement.style.setProperty("--background-color", (number == 2) ? "#eee4da" : "#eee1c9")
        this.#tileElement.append(this.#innertile)
        gridContainer.append(this.#tileElement)
        this.number = number
    }

    set number(n) {
        this.#number = n
        this.#innertile.textContent = n
        const power = Math.log2(n)
        this.#tileElement.style.setProperty("--background-color", BACKGROUND_COLOR[power - 1])
        if (n >= 8) this.#tileElement.style.setProperty("--color", "#f9f6f2")
        if (n >= 100 && n < 1000) {
            this.#innertile.style.setProperty("font-size", "45px")
        } else if (n >= 1000) {
            this.#innertile.style.setProperty("font-size", "35px")
        }
    }

    set x(number) {
        this.#x = number
        this.#tileElement.style.setProperty("--x", number)
    }

    set y(number) {
        this.#y = number
        this.#tileElement.style.setProperty("--y", number)
    }

    get number() {
        return this.#number
    }

    remove() {
        this.#tileElement.remove()
    }

    animation(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(animation ? "animationend" : "transitionend", resolve, {
                once: true,
            })
        })
    }
}
