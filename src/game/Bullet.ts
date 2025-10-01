import { GAME_CONFIG } from '@/constants/gameConfig';
import { Position, Size } from './types';

export class Bullet {
    position: Position;
    size: Size;
    speed: number;
    isActive: boolean;

    constructor(x: number, y:number, speed: number) {
        this.position = { x, y };
        this.size = { width: GAME_CONFIG.bullet.width, height: GAME_CONFIG.bullet.height };
        this.speed = speed;
        this.isActive = true;
    }

    update() {
        this.position.y -= this.speed;  // 上に移動

        // 画面外に出たら無効化
        if (this.position.y < 0) {
            this.isActive = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) return;

        ctx.fillStyle = 'yellow';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }
}