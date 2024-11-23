const ROLE_CIV = "Civilian";
const ROLE_DOCTOR = "Doctor";
const ROLE_COP = "Cop";
const ROLE_MAFIA = "Mafia";
const ROLE_JOKER = "Joker";
const ROLE_SK = "Serial Killer"
const roles = [ROLE_CIV, ROLE_DOCTOR, ROLE_COP, ROLE_MAFIA, ROLE_JOKER, ROLE_SK];


class Player {
    /**
     * @type {string}
     */
    #name;
    get name() {
        return this.#name;
    }
    set name(n) {
        this.#name = n;
    }
    /**
     * @type {string}
     */
    #role;
    get role() {
        return this.#role;
    }
    set role(r) {
        this.#role = r;
    }
    #roleLock = false;
    get roleLock() {
        return this.#roleLock;
    }
    set roleLock(locked) {
        this.#roleLock = locked;
    }
    toggleLock() {
        this.#roleLock = !this.#roleLock;
    }

    /**
     * @type {boolean}
     */
    #alive;
    get alive() {
        return this.#alive;
    }
    get dead() {
        return !this.#alive;
    }

    kill() {
        this.#alive = false;
    }

    respawn() {
        this.#alive = true;
    }

    toggleLife() {
        this.#alive = !this.#alive;
    }
    
    constructor(name, role=ROLE_CIV) {
        this.#name = name;
        this.#role = role;
        this.#alive = true;
    }


}

class PlayerElement {
    /**
     * @type {Player}
     */
    #player;
    /**
     * 
     * @param {Player} player 
     */
    constructor(player) {
        this.#player = player;
    }

    notify() {
        // Handle changes and update the element
    }

}

class GameRenderer {
    /**
     * @type {Game}
     */
    #game;
    constructor(game) {
        this.#game = game;
    }

    render() {
        this.renderLhs();
        this.renderRhs();
    }

    renderLhs() {
        const root = document.getElementById("playersAlive");
        root.innerHTML = "";
        for (const player of this.#game.getPlayersAlive()) {
            const playerItem = this.renderItem(player);
            root.appendChild(playerItem);
        }
    }

    renderRhs() {
        const root = document.getElementById("playersDead");
        root.innerHTML = "";
        for (const player of this.#game.getPlayersDead()) {
            const playerItem = this.renderItem(player);
            root.appendChild(playerItem);
        }
    }

    renderItem(player) {
        const e_root = $div({class: "player-data"});
        e_root.appendChild($div({class: "name", text: player.name}));
        const e_role = $div({class: "role"});
        e_root.appendChild(e_role);
        const e_roleLock = $span({class: "lock"});
        const e_roleLockIcon = $i({
            class: (player.roleLock ? "bi bi-lock" : "bi bi-unlock")
        });
        e_roleLock.appendChild(e_roleLockIcon);
        e_role.appendChild(e_roleLock);
        e_role.appendChild($div({class: "rolename", text: player.role}));
        e_role.addEventListener("click", (event) => {
            event.stopPropagation();
            player.toggleLock();
            // Toggle role lock
            e_roleLockIcon.className = player.roleLock ? "bi bi-lock" : "bi bi-unlock";
        });

        const lifeClass = player.alive ? "alive" : "dead";
        e_root.appendChild($div({class: `life ${lifeClass}`}));

        e_root.addEventListener("click", (event) => {
            // Toggle kill
            player.toggleLife();
            this.render();
        });
        return e_root;
    }
}

class Game {
    #settings = {
        mafiaCount: 1,
        hasJoker: false,
        hasSerialKiller: false,
        playersText: ""
    }

    /**
     * @type {Array<Player>}
     */
    #players = [];
    /**
     * @type {GameRenderer}
     */
    #renderer;

    constructor() {
        // Initialize Settings Handlers
        const mafiaCountInput = document.getElementById("mafiaCountInput");
        mafiaCountInput.addEventListener("change", () => {
            this.#settings.mafiaCount = parseInt(mafiaCountInput.value);
        });

        // TODO verify its 'checked'
        const jokerToggleInput = document.getElementById("jokerToggleInput");
        jokerToggleInput.addEventListener("change", () => {
            this.#settings.hasJoker = jokerToggleInput.checked;
        });
        const skToggleInput = document.getElementById("skToggleInput");
        skToggleInput.addEventListener("change", () => {
            this.#settings.hasSerialKiller = skToggleInput.checked;
        });

        const playerListInput = document.getElementById("playerListInput");
        playerListInput.addEventListener("change", () => {
            this.#settings.playersText = playerListInput.value;
            this.#updatePlayers();
        });

        this.#renderer = new GameRenderer(this);

        const restartButton = document.getElementById("restartButton");
        restartButton.addEventListener("click", (event) => {
            if (!event.shiftKey && !confirm("Restart?")) {
                return;
            }
            this.#restart();
            this.#renderer.render();
        });

        const randomizeButton = document.getElementById("randomizeButton");
        randomizeButton.addEventListener("click", (event) => {
            if (!event.shiftKey && !confirm("Randomize?")) {
                return;
            }
            this.#randomize();
            this.#renderer.render();
        });
    }

    #restart() {
        for (const player of this.#players) {
            player.respawn();
        }
    }

    #randomize() {
        const roleCounts = {
            [ROLE_COP]: 0,
            [ROLE_DOCTOR]: 0,
            [ROLE_MAFIA]: 0,
            [ROLE_JOKER]: 0,
            [ROLE_SK]: 0,
            [ROLE_CIV]: 0
        }
        const remaining = this.#players.slice();
        for (let i = remaining.length; i --> 0; ) {
            const player = remaining[i];
            if (player.roleLock) {
                remaining.splice(i, 1);
                roleCounts[player.role]++;
            }
        }

        const randomUnlocked = shuffleArray(remaining);

        let index = 0;
        if (roleCounts[ROLE_COP] === 0) {
            randomUnlocked[index++].role = ROLE_COP;
        }
        if (roleCounts[ROLE_DOCTOR] === 0) {
            randomUnlocked[index++].role = ROLE_DOCTOR;
        }
        for (let i = roleCounts[ROLE_MAFIA]; i < this.#settings.mafiaCount; ++i) {
            randomUnlocked[index++].role = ROLE_MAFIA;
        }
        if (this.#settings.hasJoker && roleCounts[ROLE_JOKER] === 0) {
            randomUnlocked[index++].role = ROLE_JOKER;
        }
        if (this.#settings.hasSerialKiller && roleCounts[ROLE_SK] === 0) {
            randomUnlocked[index++].role = ROLE_SK;
        }
        while (index < randomUnlocked.length) {
            randomUnlocked[index++].role = ROLE_CIV;
        }
        this.#sortPlayers();
    }

    #sortPlayers() {
        this.#players.sort((a, b) => b.role.localeCompare(a.role));
    }

    #getPlayer(name) {
        for (const player of this.#players) {
            if (player.name === name) {
                return player;
            }
        }
        return null;
    }

    #updatePlayers() {
        const names = this.#settings.playersText
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);
        const nameSet = new Set();
        for (const name of names) {
            nameSet.add(name);
        }
        // Remove deleted players
        for (let i = this.#players.length; i --> 0;) {
            const player = this.#players[i];
            if (!nameSet.has(player.name)) {
                this.#players.splice(i, 1);
            }
        }
        // Insert new ones
        for (const name of names) {
            if (!this.#getPlayer(name)) {
                this.#players.push(new Player(name));
            }
        }
        this.#sortPlayers();
        this.#renderer.render();
    }

    getPlayersAlive() {
        return this.#players.filter(p => p.alive);
    }

    getPlayersDead() {
        return this.#players.filter(p => p.dead);
    }

    // Need buttons to handle macro actions
}

const game = new Game();
