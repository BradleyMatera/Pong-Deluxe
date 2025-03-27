import { GameObject } from '../core/GameObject';
import { Vector2 } from '../core/Vector2';

export enum PowerUpType {
  SpeedUp,
  SizeBig,
  SizeSmall,
  MultiBall
}

export class PowerUp extends GameObject {
  type: PowerUpType;
  active: boolean = true;

  constructor(position: Vector2, type: PowerUpType) {
    super(position, new Vector2(20, 20));
    this.type = type;
  }

  update(deltaTime: number): void {
    // Rotate or animate powerup
    this.position.y += Math.sin(Date.now() / 500) * deltaTime * 30;
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    ctx.fillStyle = this.getColor();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw icon based on type
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.getIcon(), this.position.x, this.position.y);
  }

  private getColor(): string {
    switch (this.type) {
      case PowerUpType.SpeedUp: return '#ff4444';
      case PowerUpType.SizeBig: return '#44ff44';
      case PowerUpType.SizeSmall: return '#4444ff';
      case PowerUpType.MultiBall: return '#ffff44';
    }
  }

  private getIcon(): string {
    switch (this.type) {
      case PowerUpType.SpeedUp: return '⚡';
      case PowerUpType.SizeBig: return '↕';
      case PowerUpType.SizeSmall: return '↨';
      case PowerUpType.MultiBall: return '●';
    }
  }
}