import { Vector2 } from './Vector2';

export abstract class GameObject {
  position: Vector2;
  size: Vector2;

  constructor(position: Vector2, size: Vector2) {
    this.position = position;
    this.size = size;
  }

  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}