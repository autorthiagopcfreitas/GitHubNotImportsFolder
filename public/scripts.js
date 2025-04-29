// Constants
const DELAYS = {
    DASHBOARD_INIT: 1000,
    SCROLL_DEBOUNCE: 100
};

const SELECTORS = {
    NAVBAR: '.navbar',
    NAV_LINKS: '.nav-link',
    NAVBAR_TOGGLER: '.navbar-toggler',
    NAVBAR_COLLAPSE: '.navbar-collapse',
    SEARCH_FORM: '.search-form',
    SEARCH_INPUT: '.search-input',
    LOADING_OVERLAY: '#loadingOverlay',
    MAIN_CONTENT: '#mainContent'
};

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const validateInput = (input, type = 'text') => {
    if (!input) return false;
    switch (type) {
        case 'text':
            return input.trim().length > 0;
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        default:
            return false;
    }
};

// Navbar Module
const NavbarManager = {
    init() {
        this.navbar = document.querySelector(SELECTORS.NAVBAR);
        this.navLinks = document.querySelectorAll(SELECTORS.NAV_LINKS);
        this.navbarCollapse = document.querySelector(SELECTORS.NAVBAR_COLLAPSE);
        
        this.setupEventListeners();
        this.highlightCurrentPage();
    },

    setupEventListeners() {
        // Close navbar when clicking outside
        document.addEventListener('click', this.handleOutsideClick.bind(this));
        
        // Close navbar when clicking a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleLinkClick.bind(this));
        });

        // Add shadow to navbar on scroll
        window.addEventListener('scroll', 
            debounce(this.handleScroll.bind(this), DELAYS.SCROLL_DEBOUNCE)
        );
    },

    handleOutsideClick(event) {
        if (!this.navbar.contains(event.target)) {
            this.navbarCollapse.classList.remove('show');
        }
    },

    handleLinkClick() {
        this.navbarCollapse.classList.remove('show');
    },

    handleScroll() {
        this.navbar.style.boxShadow = window.scrollY > 0 
            ? '0 2px 4px rgba(0,0,0,0.1)' 
            : 'none';
    },

    highlightCurrentPage() {
        this.navLinks.forEach(link => {
            if (link.getAttribute('href') === window.location.pathname) {
                link.classList.add('active');
            }
        });
    }
};

// Search Module
const SearchManager = {
    init() {
        this.searchForm = document.querySelector(SELECTORS.SEARCH_FORM);
        this.searchInput = document.querySelector(SELECTORS.SEARCH_INPUT);
        
        if (this.searchForm) {
            this.setupEventListeners();
        }
    },

    setupEventListeners() {
        this.searchForm.addEventListener('submit', this.handleSearch.bind(this));
    },

    handleSearch(e) {
        e.preventDefault();
        const searchTerm = this.searchInput.value.trim();
        
        if (validateInput(searchTerm)) {
            this.performSearch(searchTerm);
        } else {
            this.showError('Por favor, insira um termo de busca válido.');
        }
    },

    performSearch(term) {
        try {
            console.log('Searching for:', term);
            // Implement search logic here
        } catch (error) {
            this.showError('Erro ao realizar busca. Tente novamente.');
            console.error('Search error:', error);
        }
    },

    showError(message) {
        // Implement error display logic
        console.error(message);
    }
};

// Dashboard Module
const DashboardManager = {
    async init() {
        try {
            console.log('Initializing dashboard...');
            await this.initializeDashboard();
            this.showDashboard();
        } catch (error) {
            this.handleError(error);
        }
    },

    async initializeDashboard() {
        // Implement actual initialization logic here
        // Remove the simulated delay in production
        await new Promise(resolve => setTimeout(resolve, DELAYS.DASHBOARD_INIT));
    },

    showDashboard() {
        document.querySelector(SELECTORS.LOADING_OVERLAY).style.display = 'none';
        document.querySelector(SELECTORS.MAIN_CONTENT).style.display = 'block';
        console.log('Dashboard initialized successfully.');
    },

    handleError(error) {
        console.error('Error initializing dashboard:', error);
        // Apenas registrar o erro no console, sem mostrar mensagem para o usuário
    },

    showError(message) {
        // Apenas registrar o erro no console, sem mostrar mensagem para o usuário
        console.error(message);
    }
};

// Error Handling
const ErrorHandler = {
    init() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handleRejection.bind(this));
    },

    handleError(event) {
        console.error('Erro capturado:', event.error);
        this.showUserError();
    },

    handleRejection(event) {
        console.error('Rejeição não tratada:', event.reason);
        this.showUserError();
    },

    showUserError() {
        // Apenas registrar o erro no console, sem mostrar mensagem para o usuário
        console.error('Ocorreu um erro inesperado.');
    }
};

// Game Modules
const GameManager = {
    // Memory Game
    startMemoryGame() {
        const modal = new bootstrap.Modal(document.getElementById('gameModal'));
        document.getElementById('gameModalTitle').textContent = 'Jogo de Memória';
        document.getElementById('gameContainer').innerHTML = `
            <div class="memory-game-container">
                <div class="memory-game-board" id="memoryGameBoard"></div>
                <div class="memory-game-stats">
                    <div class="row">
                        <div class="col">
                            <h5>Pares Encontrados: <span id="matchedPairs">0/6</span></h5>
                        </div>
                        <div class="col">
                            <h5>Tempo: <span id="memoryGameTimer">00:00</span></h5>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.show();
        this.initializeMemoryGame();
    },

    initializeMemoryGame() {
        const cardPairs = ['😊', '😊', '😢', '😢', '😡', '😡', '😴', '😴', '😎', '😎', '🤔', '🤔'];
        this.memoryCards = this.shuffleArray([...cardPairs]);
        const gameBoard = document.getElementById('memoryGameBoard');
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < 12; i++) {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.value = this.memoryCards[i];
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${this.memoryCards[i]}</div>
                </div>
            `;
            
            card.addEventListener('click', () => this.flipCard(card));
            gameBoard.appendChild(card);
        }

        this.startTimer();
        this.gameStarted = true;
    },

    // Puzzle Game
    startPuzzleGame() {
        const modal = new bootstrap.Modal(document.getElementById('gameModal'));
        document.getElementById('gameModalTitle').textContent = 'Quebra-Cabeça';
        document.getElementById('gameContainer').innerHTML = `
            <div class="text-center">
                <div class="difficulty-buttons mb-4">
                    <button class="btn btn-primary me-2" data-difficulty="facil" onclick="GameManager.startPuzzleLevel('facil')">Fácil (3x3)</button>
                    <button class="btn btn-primary me-2" data-difficulty="medio" onclick="GameManager.startPuzzleLevel('medio')">Médio (4x4)</button>
                    <button class="btn btn-primary" data-difficulty="dificil" onclick="GameManager.startPuzzleLevel('dificil')">Difícil (5x5)</button>
                </div>
                <div class="puzzle-game-container">
                    <div class="puzzle-game-board-wrapper" id="game-board-wrapper">
                        <div class="puzzle-game-board" id="game-board"></div>
                    </div>
                    <div class="puzzle-game-stats mt-4">
                        <div class="row">
                            <div class="col">
                                <h5>Movimentos: <span id="moveCount">0</span></h5>
                            </div>
                            <div class="col">
                                <h5>Tempo: <span id="puzzleTimer">00:00</span></h5>
                            </div>
                        </div>
                    </div>
                    <div class="puzzle-game-controls mt-4">
                        <button class="btn btn-primary me-2" onclick="GameManager.shufflePuzzle()">Embaralhar</button>
                        <button class="btn btn-primary" onclick="GameManager.solvePuzzle()">Resolver</button>
                    </div>
                </div>
            </div>
        `;
        modal.show();
        this.startPuzzleLevel('facil');
    },

    // Puzzle Game Variables
    puzzleSize: 3,
    moveCount: 0,
    puzzleTimer: null,
    puzzleSeconds: 0,
    tiles: [],
    emptyTileCoords: { row: 0, col: 0 },
    puzzleImageUrl: 'assets/profile-image.jpg',
    solveTimeout: null,

    cleanupPuzzleGame() {
        if (this.solveTimeout) {
            clearTimeout(this.solveTimeout);
            this.solveTimeout = null;
        }
        if (this.puzzleTimer) {
            clearInterval(this.puzzleTimer);
            this.puzzleTimer = null;
        }

        this.moveCount = 0;
        this.puzzleSeconds = 0;
        this.tiles = [];
        this.emptyTileCoords = { row: 0, col: 0 };

        const gameContainer = document.getElementById('gameContainer');
        if (gameContainer) {
            gameContainer.innerHTML = '';
        }

        const gameBoard = document.getElementById('game-board');
        if (gameBoard) {
            const tiles = gameBoard.querySelectorAll('.puzzle-tile');
            tiles.forEach(tile => {
                tile.removeEventListener('click', this.handleTileClick.bind(this));
            });
        }
    },

    startPuzzleLevel(difficulty) {
        this.puzzleSize = difficulty === 'facil' ? 3 : difficulty === 'medio' ? 4 : 5;
        this.moveCount = 0;
        this.puzzleTimer = 0;
        this.isSolving = false;
        this.tiles = [];
        this.emptyTile = { row: this.puzzleSize - 1, col: this.puzzleSize - 1 };

        const gameBoard = document.getElementById('game-board');
        gameBoard.style.gridTemplateColumns = `repeat(${this.puzzleSize}, 1fr)`;
        gameBoard.innerHTML = '';

        this.createPuzzleTiles();
        this.shufflePuzzle();
        this.startPuzzleTimer();
    },

    createPuzzleTiles() {
        const gameBoard = document.getElementById('game-board');
        const tileSize = 100 / this.puzzleSize;

        for (let i = 0; i < this.puzzleSize * this.puzzleSize - 1; i++) {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.textContent = i + 1;
            tile.dataset.index = i;
            tile.style.width = `${tileSize}%`;
            tile.style.height = `${tileSize}%`;
            tile.onclick = () => this.handleTileClick(i);
            gameBoard.appendChild(tile);
            this.tiles.push(tile);
        }
    },

    handleTileClick(index) {
        if (this.isSolving) return;

        const row = Math.floor(index / this.puzzleSize);
        const col = index % this.puzzleSize;
        const emptyRow = this.emptyTile.row;
        const emptyCol = this.emptyTile.col;

        if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
            this.moveTile(index);
        }
    },

    moveTile(index) {
        const row = Math.floor(index / this.puzzleSize);
        const col = index % this.puzzleSize;
        const emptyIndex = this.emptyTile.row * this.puzzleSize + this.emptyTile.col;

        // Swap positions
        [this.tiles[index], this.tiles[emptyIndex]] = [this.tiles[emptyIndex], this.tiles[index]];
        
        // Update empty tile position
        this.emptyTile = { row, col };
        
        // Update move count
        this.moveCount++;
        document.getElementById('moveCount').textContent = this.moveCount;

        // Check for win
        if (this.checkPuzzleWin()) {
            this.showPuzzleVictory();
        }
    },

    shufflePuzzle() {
        if (this.isSolving) return;
        
        // Perform 1000 random valid moves
        for (let i = 0; i < 1000; i++) {
            const possibleMoves = [];
            const emptyIndex = this.emptyTile.row * this.puzzleSize + this.emptyTile.col;

            // Check all four directions
            if (this.emptyTile.row > 0) possibleMoves.push(emptyIndex - this.puzzleSize);
            if (this.emptyTile.row < this.puzzleSize - 1) possibleMoves.push(emptyIndex + this.puzzleSize);
            if (this.emptyTile.col > 0) possibleMoves.push(emptyIndex - 1);
            if (this.emptyTile.col < this.puzzleSize - 1) possibleMoves.push(emptyIndex + 1);

            // Randomly select a move
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            this.moveTile(randomMove);
        }

        this.moveCount = 0;
        document.getElementById('moveCount').textContent = '0';
    },

    checkPuzzleWin() {
        for (let i = 0; i < this.tiles.length; i++) {
            if (parseInt(this.tiles[i].textContent) !== i + 1) {
                return false;
            }
        }
        return true;
    },

    showPuzzleVictory() {
        clearInterval(this.timerInterval);
        const modal = new bootstrap.Modal(document.getElementById('gameModal'));
        modal.hide();

        const victoryModal = new bootstrap.Modal(document.getElementById('victoryModal'));
        document.getElementById('victoryMessage').textContent = 
            `Parabéns! Você completou o quebra-cabeça em ${this.moveCount} movimentos e ${this.puzzleTimer} segundos!`;
        victoryModal.show();
    },

    startPuzzleTimer() {
        clearInterval(this.timerInterval);
        this.puzzleTimer = 0;
        this.timerInterval = setInterval(() => {
            this.puzzleTimer++;
            const minutes = Math.floor(this.puzzleTimer / 60);
            const seconds = this.puzzleTimer % 60;
            document.getElementById('puzzleTimer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    },

    solvePuzzle() {
        if (this.isSolving) return;
        this.isSolving = true;

        // Implementação simples: apenas reorganiza as peças
        this.tiles.sort((a, b) => parseInt(a.textContent) - parseInt(b.textContent));
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        this.tiles.forEach(tile => gameBoard.appendChild(tile));

        this.isSolving = false;
        this.showPuzzleVictory();
    },

    cleanupPuzzleGame() {
        clearInterval(this.timerInterval);
        this.isSolving = false;
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    NavbarManager.init();
    SearchManager.init();
    DashboardManager.init();
    ErrorHandler.init();
    
    // Add event listeners for game buttons
    document.querySelectorAll('[onclick^="startMemoryGame"]').forEach(btn => {
        btn.onclick = () => GameManager.startMemoryGame();
    });
    
    document.querySelectorAll('[onclick^="startPuzzleGame"]').forEach(btn => {
        btn.onclick = () => GameManager.startPuzzleGame();
    });
});