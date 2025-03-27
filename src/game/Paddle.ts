import { GameObject } from './GameObject';
import { Vector2 } from './Vector2';

export class Paddle extends GameObject {
  velocity: number = 0;
  score: number = 0;

  constructor(x: number, y: number) {
    super(new Vector2(x, y), new Vector2(10, 100));
  }

  update(deltaTime: number) {
    this.position.y += this.velocity * deltaTime;
    this.position.y = Math.max(0, Math.min(500, this.position.y));
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white';
    ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}