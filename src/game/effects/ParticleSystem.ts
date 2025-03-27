import { Vector2 } from '../core/Vector2';

interface Particle {
  position: Vector2;
  velocity: Vector2;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  emit(position: Vector2, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        position: new Vector2(position.x, position.y),
        velocity: new Vector2(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        ),
        color,
        life: 1,
        maxLife: 1,
        size: Math.random() * 4 + 2
      });
    }
  }

  update(deltaTime: number) {
    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      particle.position = particle.position.add(particle.velocity.multiply(deltaTime));
      return particle.life > 0;
    });
  }

  render(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(particle => {
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
}