import { Position, Size } from './types';

// プレイヤークラスの定義
export class Player {
    position: Position;
    size: Size;
    speed: number;

    constructor(x: number, y: number) {
        this.position = { x, y };
        this.size = { width: 40, height: 30 };
        this.speed = 5;
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
}
