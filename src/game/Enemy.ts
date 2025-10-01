import { Position, Size } from './types';

export class Enemy {
    position: Position;
    size: Size;
    isAlive: boolean;

    constructor(x: number, y: number) {
        this.position = { x, y };
        this.size = { width: 30, height: 20 };
        this.isAlive = true;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isAlive) return;

        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }
}