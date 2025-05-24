const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const DEGREE = Math.PI / 180;

// Load images
const bird = new Image();
bird.src = "https://i.imgur.com/sjQzBdb.png"; // Bird image

const bg = "#70c5ce"; // Background color

// Bird object
const flappyBird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  draw() {
    ctx.drawImage(bird, this.x, this.y);
  },
  update() {
    this.speed += this.gravity;
    this.y += this.speed;
    if (this.y + this.h >= canvas.height) {
      this.y = canvas.height - this.h;
      this.speed = 0;
    }
  },
  flap() {
    this.speed = -this.jump;
  }
};

// Pipes
const pipes = [];
const pipeWidth = 50;
const gap = 120;
let pipeX = canvas.width;

function drawPipe(pipe) {
  ctx.fillStyle = "#228B22";
  ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
  ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);
}

function createPipe() {
  const top = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
  const bottom = top + gap;
  pipes.push({ x: canvas.width, top, bottom });
}

function updatePipes() {
  if (frames % 90 === 0) createPipe();

  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Collision detection
function detectCollision(pipe) {
  return (
    flappyBird.x < pipe.x + pipeWidth &&
    flappyBird.x + flappyBird.w > pipe.x &&
    (flappyBird.y < pipe.top || flappyBird.y + flappyBird.h > pipe.bottom)
  );
}

// Game loop
function draw() {
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  flappyBird.draw();
  pipes.forEach(drawPipe);
}

function update() {
  flappyBird.update();
  updatePipes();

  pipes.forEach(pipe => {
    if (detectCollision(pipe)) {
      alert("Game Over!");
      location.reload();
    }
  });
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

canvas.addEventListener("click", () => {
  flappyBird.flap();
});

loop();
