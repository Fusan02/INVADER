import { GAME_CONFIG } from '@/constants/gameConfig';
import { Position, Size } from './types';
import { Bullet } from './Bullet';

// プレイヤークラスの定義
export class Player {
    position: Position;
    size: Size;
    speed: number;

    constructor(x: number, y: number) {
        this.position = { x, y };
        this.size = {
            width: GAME_CONFIG.player.width,
            height: GAME_CONFIG.player.height 
        };
        this.speed = GAME_CONFIG.player.speed;
    }

    // 描画
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'green';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }

    moveLeft() {
        if (this.position.x > 0) {
            this.position.x -= this.speed;
        }
    }

    moveRight(canvasWidth: number) {
        if (this.position.x + this.size.width < canvasWidth) {
            this.position.x += this.speed;
        }
    }

    // 弾を発射
    shoot(): Bullet {
        const bulletX = this.position.x + this.size.width / 2 - GAME_CONFIG.bullet.width / 2;
        const bulletY = this.position.y;

        return new Bullet(bulletX, bulletY, GAME_CONFIG.bullet.speed);
    }
}
