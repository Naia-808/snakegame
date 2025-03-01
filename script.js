const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const easyModeButton = document.getElementById("easy-mode");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = []; // Array to hold multiple fruits
let direction = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let easyMode = false;
let gameSpeed = 100; // Default speed (100ms)

// List of fruits
const fruits = ["🍎", "🍇", "🍓", "🍒"];

// Display initial high score
highScoreElement.textContent = `High Score: ${highScore}`;

// Add clouds to the background
function createClouds() {
    const cloudContainer = document.body;
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement("div");
        cloud.classList.add("cloud");
        cloud.style.width = `${Math.floor(Math.random() * 150) + 100}px`;
        cloud.style.height = `${Math.floor(Math.random() * 50) + 50}px`;
        cloud.style.top = `${Math.floor(Math.random() * 80)}%`;
        cloud.style.animationDuration = `${Math.floor(Math.random() * 20) + 10}s`;
        cloudContainer.appendChild(cloud);
    }
}

createClouds();

function gameLoop() {
    update();
    draw();
    setTimeout(gameLoop, gameSpeed);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Easy Mode: Teleport snake to the opposite side when it hits a wall
    if (easyMode) {
        if (head.x < 0) head.x = tileCount - 1;
        if (head.x >= tileCount) head.x = 0;
        if (head.y < 0) head.y = tileCount - 1;
        if (head.y >= tileCount) head.y = 0;
    } else {
        // Normal Mode: Check for collision with walls or itself
        if (
            head.x < 0 || head.x >= tileCount ||
            head.y < 0 || head.y >= tileCount ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            resetGame();
            return;
        }
    }

    // Add the new head to the snake
    snake.unshift(head);

    // Check if snake eats any of the fruits
    let ateFood = false;
    for (let i = 0; i < food.length; i++) {
        if (head.x === food[i].x && head.y === food[i].y) {
            score++;
            scoreElement.textContent = `Score: ${score}`;

            // Update high score if the current score is higher
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                highScoreElement.textContent = `High Score: ${highScore}`;
            }

            // Remove the eaten fruit and add a new one
            food.splice(i, 1);
            placeFood();
            ateFood = true;
            break;
        }
    }

    // Remove the tail only if the snake did not eat food
    if (!ateFood) {
        snake.pop();
    }
}

function draw() {
    // Draw chessboard pattern
    for (let x = 0; x < tileCount; x++) {
        for (let y = 0; y < tileCount; y++) {
            ctx.fillStyle = (x + y) % 2 === 0 ? "#fff3b0" : "#ffe082"; // Light yellow and dark yellow
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
        }
    }

    // Draw snake
    snake.forEach((segment, index) => {
        // Draw the snake's body (kawaii style)
        ctx.fillStyle = "#76c7c0"; // Teal green for the snake's body
        ctx.beginPath();
        ctx.arc(
            segment.x * gridSize + gridSize / 2,
            segment.y * gridSize + gridSize / 2,
            gridSize / 2 - 1,
            0,
            Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();

        // Draw kawaii face on the head
        if (index === 0) {
            // Eyes
            ctx.fillStyle = "#000"; // Black for the eyes
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + gridSize / 2 - 5,
                segment.y * gridSize + gridSize / 2 - 5,
                2,
                0,
                Math.PI * 2
            );
            ctx.arc(
                segment.x * gridSize + gridSize / 2 + 5,
                segment.y * gridSize + gridSize / 2 - 5,
                2,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.closePath();

            // Blush (below the eyes)
            ctx.fillStyle = "#ff6f61"; // Coral color for blush
            ctx.beginPath();
            ctx.arc(
                segment.x * gridSize + gridSize / 2 - 5,
                segment.y * gridSize + gridSize / 2 + 5, // Move blush below the eyes
                3,
                0,
                Math.PI * 2
            );
            ctx.arc(
                segment.x * gridSize + gridSize / 2 + 5,
                segment.y * gridSize + gridSize / 2 + 5, // Move blush below the eyes
                3,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.closePath();
        }
    });

    // Draw fruits
    ctx.font = `${gridSize}px Arial`;
    food.forEach(fruit => {
        ctx.fillText(fruit.emoji, fruit.x * gridSize, fruit.y * gridSize + gridSize);
    });
}

function placeFood() {
    // Add 3 fruits to the game
    while (food.length < 3) {
        const newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            emoji: fruits[Math.floor(Math.random() * fruits.length)] // Random fruit
        };

        // Ensure food doesn't spawn on the snake or on other fruits
        if (
            !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) &&
            !food.some(fruit => fruit.x === newFood.x && fruit.y === newFood.y)
        ) {
            food.push(newFood);
        }
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    food = []; // Clear existing food
    placeFood();
}

// Easy Mode button functionality
easyModeButton.addEventListener("click", () => {
    easyMode = !easyMode; // Toggle Easy Mode
    gameSpeed = easyMode ? 150 : 100; // Slow down the snake in Easy Mode
    easyModeButton.textContent = easyMode ? "Normal Mode" : "Easy Mode";
    easyModeButton.style.backgroundColor = easyMode ? "#ff6f61" : "#4caf50"; // Change button color
});

document.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

placeFood();
gameLoop();
