import { GAME_CONFIG } from '@/constants/gameConfig';
import { Bullet } from './Bullet';
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

    // 敵の弾を発射
    shoot(): Bullet {
        const bulletX = this.position.x + this.size.width / 2 - GAME_CONFIG.bullet.width / 2;
        const bulletY = this.position.y + this.size.height;
        return new Bullet(bulletX, bulletY, -GAME_CONFIG.bullet.speed); // 下方向（マイナス）で飛ばす
    }
}