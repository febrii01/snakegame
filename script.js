const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 500;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

const snakeHeadImg = new Image();
snakeHeadImg.src = "ular.png";

const snakeBodyImg = new Image();
snakeBodyImg.src = "body.png";

const backgroundImg = new Image();
backgroundImg.src = "bekgron.png";

const foodImg = new Image();
foodImg.src = "food.png";

let snake = [{ x: 160, y: 160 }];
let direction = { x: 20, y: 0 };
let food = { x: 320, y: 320 };
let score = 0;
let speed = 100;
let gameRunning = false;
let gameOver = false;

function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.drawImage(snakeHeadImg, segment.x, segment.y, 20, 20);
    } else {
      ctx.drawImage(snakeBodyImg, segment.x, segment.y, 20, 20);
    }
  });
}

function drawFood() {
  ctx.drawImage(foodImg, food.x, food.y, 20, 20);
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 30);
}

function drawGameOver() {
  ctx.font = "50px Arial";
  ctx.fillStyle = "red";
  ctx.fillText("GameOver", SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT / 2);
  ctx.font = "30px Arial";
  ctx.fillText(
    "Tap To Restart",
    SCREEN_WIDTH / 2 - 100,
    SCREEN_HEIGHT / 2 + 50
  );
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  if (snake[0].x === food.x && snake[0].y === food.y) {
    score++;
    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  food.x = Math.floor(Math.random() * (SCREEN_WIDTH / 20)) * 20;
  food.y = Math.floor(Math.random() * (SCREEN_HEIGHT / 20)) * 20;
}

function checkCollision() {
  if (
    snake[0].x < 0 ||
    snake[0].x >= SCREEN_WIDTH ||
    snake[0].y < 0 ||
    snake[0].y >= SCREEN_HEIGHT
  ) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      return true;
    }
  }

  return false;
}

function resetGame() {
  snake = [{ x: 160, y: 160 }];
  direction = { x: 20, y: 0 };
  score = 0;
  placeFood();
  gameOver = false;
}

function gameLoop() {
  if (!gameRunning) return;

  if (checkCollision()) {
    gameOver = true;
    gameRunning = false;
  }

  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  drawBackground();
  drawSnake();
  drawFood();
  drawScore();

  if (gameOver) {
    drawGameOver();
  } else {
    moveSnake();
    setTimeout(gameLoop, speed);
  }
}

function startGame() {
  if (gameOver) {
    resetGame();
  }
  gameRunning = true;
  gameLoop();
}

let startx, starty, endx, endy;

canvas.addEventListener("touchmove", function (event) {
  startx = event.touches[0].clientX;
  starty = event.touches[0].clientY;
});

canvas.addEventListener("touchmove", function (event) {
  endx = event.touches[0].clientX;
  endy = event.touches[0].clientY;
});

canvas.addEventListener("touchend", function () {
  let deltax = endx - startx;
  let deltay = endy - starty;

  if (Math.abs(deltax) > Math.abs(deltay)) {
    if (deltax > 0 && direction.x === 0) {
      direction = { x: 20, y: 0 };
    } else if (deltax < 0 && direction.x === 0) {
      direction = { x: -20, y: 0 };
    }
  } else {
    if (deltay > 0 && direction.y === 0) {
      direction = { x: 0, y: 20 };
    } else if (deltay < 0 && direction.y === 0) {
      direction = { x: 0, y: -20 };
    }
  }
});

canvas.addEventListener("click", function () {
  if (!gameRunning) {
    startGame();
  }
});

ctx.font = "50px Arial";
ctx.fillStyle = "green";
ctx.fillText("Tap To Start", SCREEN_WIDTH / 2 - 150, SCREEN_HEIGHT / 2);
