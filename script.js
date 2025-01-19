// Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = 20;
const colors = {
    snakeHead: '#FF0000', // Pokéball red
    snakeBody: '#FFFFFF', // Pokéball white
    food: '#FFDE00',      // Pokémon yellow
    grid: '#2A2A2A'       // Dark background
};

// Game state
let snake = [{x: 9 * box, y: 9 * box}];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let gameInterval;
let isPaused = false;

// Generate food in a new position
function generateFood() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
}

// Draw grid background
function drawGrid() {
    ctx.fillStyle = colors.grid;
    for (let i = 0; i < canvasSize; i++) {
        for (let j = 0; j < canvasSize; j++) {
            if ((i + j) % 2 === 0) {
                ctx.fillRect(i * box, j * box, box, box);
            }
        }
    }
}

// Draw food with a Pokéball-like appearance
function drawFood() {
    ctx.beginPath();
    ctx.arc(food.x + box/2, food.y + box/2, box/2 - 2, 0, 2 * Math.PI);
    ctx.fillStyle = colors.food;
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Draw snake with Pokémon-style colors
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.beginPath();
        ctx.rect(segment.x + 1, segment.y + 1, box - 2, box - 2);
        
        if (index === 0) {
            // Snake head
            ctx.fillStyle = colors.snakeHead;
            // Draw eyes
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.fillRect(segment.x + box/4, segment.y + box/4, 3, 3);
            ctx.fillRect(segment.x + 3*box/4 - 3, segment.y + box/4, 3, 3);
        } else {
            // Snake body
            ctx.fillStyle = colors.snakeBody;
            ctx.fill();
        }
        
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}

// Main draw function
function draw() {
    if (isPaused) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    drawSnake();
    
    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;
    
    // Check for collision with food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById('score').innerText = score;
        food = generateFood();
    } else {
        snake.pop();
    }
    
    // Game over conditions
    const hitWall = snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height;
    const hitSelf = snake.some(segment => segment.x === snakeX && segment.y === snakeY);
    
    if (hitWall || hitSelf) {
        clearInterval(gameInterval);
        document.getElementById('gameOver').style.display = 'block';
        return;
    }
    
    const newHead = {x: snakeX, y: snakeY};
    snake.unshift(newHead);
}

// Control handlers
function directionControl(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
    if (event.keyCode === 80) { // P key to pause
        isPaused = !isPaused;
    }
    if (event.keyCode === 32) { // Space to restart
        if (document.getElementById('gameOver').style.display === 'block') {
            resetGame();
        }
    }
}

// Reset game
function resetGame() {
    snake = [{x: 9 * box, y: 9 * box}];
    direction = 'RIGHT';
    score = 0;
    document.getElementById('score').innerText = score;
    food = generateFood();
    document.getElementById('gameOver').style.display = 'none';
    isPaused = false;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(draw, 200);
}

// Event listeners
document.addEventListener('keydown', directionControl);

// Start the game
resetGame();
