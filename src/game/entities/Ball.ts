import { GameObject } from '../core/GameObject';
import { Vector2 } from '../core/Vector2';

export class Ball extends GameObject {
  velocity: Vector2;

  constructor() {
    super(new Vector2(400, 300), new Vector2(16, 16));
    this.velocity = new Vector2(0, 0); // Initialize velocity
    this.reset();
  }

  update(deltaTime: number) {
    this.position.x += this.velocity.x * 60 * deltaTime;
    this.position.y += this.velocity.y * 60 * deltaTime;

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
      Math.random() > 0.5 ? 8 : -8,
      (Math.random() - 0.5) * 16
    );
  }
}