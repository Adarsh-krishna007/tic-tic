const menu = document.getElementById('menu');
const register = document.getElementById('register');
const login = document.getElementById('login');
const game = document.getElementById('game');
const records = document.getElementById('records');
const gameBoard = document.getElementById('gameBoard');
const message = document.getElementById('message');
const recordList = document.getElementById('recordList');

let currentUser = null;
let currentRoom = null;
let turn = 'X';
let isGameActive = true;

// Show and hide different sections
function showMenu() {
    menu.classList.remove('hidden');
    register.classList.add('hidden');
    login.classList.add('hidden');
    game.classList.add('hidden');
    records.classList.add('hidden');
    gameBoard.classList.add('hidden');
}

function showRegister() {
    menu.classList.add('hidden');
    register.classList.remove('hidden');
}

function showLogin() {
    menu.classList.add('hidden');
    login.classList.remove('hidden');
}

function showGame() {
    game.classList.add('hidden');
    gameBoard.classList.remove('hidden');
}

function showRecords() {
    menu.classList.add('hidden');
    records.classList.remove('hidden');
    loadRecords();
}

// User registration
function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    if (username && password) {
        const data = JSON.parse(localStorage.getItem('data')) || { users: {} };
        if (data.users[username]) {
            alert('User already exists!');
        } else {
            data.users[username] = { password, wins: 0, losses: 0 };
            localStorage.setItem('data', JSON.stringify(data));
            alert('Registered successfully!');
            showLogin();
        }
    }
}

// User login
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    if (username && password) {
        const data = JSON.parse(localStorage.getItem('data')) || { users: {} };
        if (data.users[username] && data.users[username].password === password) {
            currentUser = username;
            showGame();
        } else {
            alert('Invalid credentials!');
        }
    }
}

// Create and join room
function createRoom() {
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    currentRoom = roomCode;
    // Save room data in local storage if needed
    showGame();
}

function joinRoom() {
    const roomCode = document.getElementById('roomCode').value;
    // Check if room exists
    currentRoom = roomCode;
    showGame();
}

// Load and display records
function loadRecords() {
    const data = JSON.parse(localStorage.getItem('data')) || { users: {} };
    const records = Object.entries(data.users).map(([username, stats]) => 
        `<div>${username}: Wins - ${stats.wins}, Losses - ${stats.losses}</div>`
    );
    recordList.innerHTML = records.join('');
}

// Game logic
const cells = document.querySelectorAll('[data-cell]');
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('replayButton').addEventListener('click', replayGame);
document.getElementById('backToMenuButton').addEventListener('click', showMenu);

cells.forEach(cell => cell.addEventListener('click', handleClick));

function handleClick(e) {
    const cell = e.target;
    if (cell.classList.contains('x') || cell.classList.contains('o') || !isGameActive) return;
    cell.classList.add(turn);
    if (checkWin(turn)) {
        message.textContent = `${turn} wins!`;
        isGameActive = false;
        updateStats(turn);
    } else if (Array.from(cells).every(cell => cell.classList.contains('x') || cell.classList.contains('o'))) {
        message.textContent = 'It\'s a draw!';
        isGameActive = false;
    } else {
        turn = turn === 'X' ? 'O' : 'X';
    }
}

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    return winPatterns.some(pattern => 
        pattern.every(index => cells[index].classList.contains(player))
    );
}

function restartGame() {
    cells.forEach(cell => cell.classList.remove('x', 'o'));
    message.textContent = '';
    turn = 'X';
    isGameActive = true;
    document.getElementById('replayButton').classList.add('hidden');
    document.getElementById('backToMenuButton').classList.add('hidden');
}

function replayGame() {
    restartGame();
    // Add any additional replay logic if needed
}

function updateStats(winner) {
    const data = JSON.parse(localStorage.getItem('data')) || { users: {} };
    if (winner === 'X') {
        data.users[currentUser].wins += 1;
    } else {
        data.users[currentUser].losses += 1;
    }
    localStorage.setItem('data', JSON.stringify(data));
    document.getElementById('replayButton').classList.remove('hidden');
    document.getElementById('backToMenuButton').classList.remove('hidden');
}
