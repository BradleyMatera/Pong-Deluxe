import { Ball } from './entities/Ball';
import { Paddle } from './entities/Paddle';
import { ParticleSystem } from './effects/ParticleSystem';
import { PowerUp, PowerUpType } from './powerups/PowerUp';
import { AudioManager } from './core/AudioManager';
import { Vector2 } from './core/Vector2';
import { GameObject } from './core/GameObject';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private paddle1: Paddle;
  private paddle2: Paddle;
  private balls: Ball[] = [];
  private powerUps: PowerUp[] = [];
  private particles: ParticleSystem;
  private lastTime: number = 0;
  private powerUpTimer: number = 0;
  private gameStarted: boolean = false;
  private paused: boolean = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 600;
    this.ctx = this.canvas.getContext('2d')!;
    document.getElementById('app')!.appendChild(this.canvas);

    this.paddle1 = new Paddle(50, 250);
    this.paddle2 = new Paddle(740, 250);
    this.balls.push(new Ball());
    this.particles = new ParticleSystem();

    this.setupEventListeners();
    this.showStartScreen();
  }

  private setupEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
    window.addEventListener('keypress', (e) => {
      if (e.key === ' ' && !this.gameStarted) {
        this.startGame();
      } else if (e.key === 'p') {
        this.togglePause();
      }
    });
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (this.paused) return;
    switch(e.key) {
      case 'w': this.paddle1.velocity = -15; break;
      case 's': this.paddle1.velocity = 15; break;
      case 'ArrowUp': this.paddle2.velocity = -15; break;
      case 'ArrowDown': this.paddle2.velocity = 15; break;
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    switch(e.key) {
      case 'w':
      case 's':
        this.paddle1.velocity = 0;
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        this.paddle2.velocity = 0;
        break;
    }
  }

  private spawnPowerUp() {
    const types = Object.values(PowerUpType).filter(v => typeof v === 'number');
    const randomType = types[Math.floor(Math.random() * types.length)] as PowerUpType;
    const x = Math.random() * 400 + 200;
    const y = Math.random() * 400 + 100;
    this.powerUps.push(new PowerUp(new Vector2(x, y), randomType));
  }

  private applyPowerUp(powerUp: PowerUp, paddle: Paddle) {
    AudioManager.getInstance().play('powerup');
    switch (powerUp.type) {
      case PowerUpType.SpeedUp:
        paddle.speedMultiplier = 1.5;
        setTimeout(() => paddle.speedMultiplier = 1, 5000);
        break;
      case PowerUpType.SizeBig:
        paddle.size.y *= 1.5;
        setTimeout(() => paddle.size.y /= 1.5, 5000);
        break;
      case PowerUpType.SizeSmall:
        paddle.size.y *= 0.7;
        setTimeout(() => paddle.size.y /= 0.7, 5000);
        break;
      case PowerUpType.MultiBall:
        this.balls.push(new Ball());
        break;
    }
    this.particles.emit(powerUp.position, '#ffff00', 20);
  }

  private checkCollisions() {
    this.balls.forEach(ball => {
      if (this.checkPaddleCollision(ball, this.paddle1) || 
          this.checkPaddleCollision(ball, this.paddle2)) {
        ball.velocity.x *= -1.1; // Increase speed slightly on paddle hit
        AudioManager.getInstance().play('hit');
        this.particles.emit(ball.position, '#ffffff', 10);
      }
    });

    this.powerUps = this.powerUps.filter(powerUp => {
      if (!powerUp.active) return false;
      
      [this.paddle1, this.paddle2].forEach(paddle => {
        if (this.checkCollision(powerUp, paddle)) {
          this.applyPowerUp(powerUp, paddle);
          powerUp.active = false;
        }
      });

      return powerUp.active;
    });
  }

  private checkPaddleCollision(ball: Ball, paddle: Paddle): boolean {
    if (this.checkCollision(ball, paddle)) {
      // Calculate angle based on where the ball hits the paddle
      const relativeY = (ball.position.y - paddle.position.y) / paddle.size.y;
      ball.velocity.y = (relativeY - 0.5) * 16;
      return true;
    }
    return false;
  }

  private checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    return obj1.position.x + obj1.size.x >= obj2.position.x &&
           obj1.position.x <= obj2.position.x + obj2.size.x &&
           obj1.position.y + obj1.size.y >= obj2.position.y &&
           obj1.position.y <= obj2.position.y + obj2.size.y;
  }

  private update(deltaTime: number) {
    if (!this.gameStarted || this.paused) return;

    this.paddle1.update(deltaTime);
    this.paddle2.update(deltaTime);
    this.particles.update(deltaTime);
    this.powerUps.forEach(powerUp => powerUp.update(deltaTime));

    this.powerUpTimer += deltaTime;
    if (this.powerUpTimer > 10) {
      this.powerUpTimer = 0;
      this.spawnPowerUp();
    }

    this.balls = this.balls.filter(ball => {
      ball.update(deltaTime);
      
      if (ball.position.x <= 0) {
        this.paddle2.score++;
        AudioManager.getInstance().play('score');
        return false;
      } else if (ball.position.x >= 800) {
        this.paddle1.score++;
        AudioManager.getInstance().play('score');
        return false;
      }
      return true;
    });

    if (this.balls.length === 0) {
      this.balls.push(new Ball());
    }

    this.checkCollisions();
  }

  private render() {
    // Clear canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw center line
    this.ctx.strokeStyle = 'white';
    this.ctx.setLineDash([5, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(400, 0);
    this.ctx.lineTo(400, 600);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Render game objects
    this.paddle1.render(this.ctx);
    this.paddle2.render(this.ctx);
    this.balls.forEach(ball => ball.render(this.ctx));
    this.powerUps.forEach(powerUp => powerUp.render(this.ctx));
    this.particles.render(this.ctx);

    // Render scores
    this.ctx.fillStyle = 'white';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.paddle1.score.toString(), 200, 50);
    this.ctx.fillText(this.paddle2.score.toString(), 600, 50);

    if (this.paused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.font = '36px Arial';
      this.ctx.fillText('PAUSED', 400, 300);
      this.ctx.font = '24px Arial';
      this.ctx.fillText('Press P to resume', 400, 350);
    }
  }

  private showStartScreen() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PONG DELUXE', 400, 200);
    this.ctx.font = '24px Arial';
    this.ctx.fillText('Press SPACE to start', 400, 300);
    this.ctx.fillText('Player 1: W/S keys', 400, 350);
    this.ctx.fillText('Player 2: Arrow Up/Down', 400, 380);
    this.ctx.fillText('P: Pause game', 400, 410);
  }

  private togglePause() {
    this.paused = !this.paused;
    if (!this.paused) {
      this.lastTime = performance.now();
    }
  }

  private gameLoop(currentTime: number) {
    if (this.gameStarted) {
      const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
      this.lastTime = currentTime;

      this.update(deltaTime);
      this.render();
    }
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private startGame() {
    this.gameStarted = true;
    this.lastTime = performance.now();
  }

  start() {
    this.gameLoop(0);
  }
}