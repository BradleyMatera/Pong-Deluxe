import { GameObject } from './GameObject';
import { Vector2 } from './Vector2';

export class Ball extends GameObject {
  velocity: Vector2;

  constructor() {
    super(new Vector2(400, 300), new Vector2(16, 16));
    this.velocity = new Vector2(5, 5);
  }

  update(deltaTime: number) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    if (this.position.y <= 0 || this.position.y >= 600) {
      this.velocity.y *= -1;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  reset() {
    this.position = new Vector2(400, 300);
    this.velocity = new Vector2(
      Math.random() > 0.5 ? 5 : -5,
      (Math.random() - 0.5) * 10
    );
  }
}
