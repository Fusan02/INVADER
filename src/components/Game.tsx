'use client';

import { useEffect, useRef } from 'react';
import styles from './game.css';
import { Player } from '@/game/Player';

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // プレイヤーを作成
        const player = new Player(380, 550);

        // キー入力の状態
        const keys: { [key: string]: boolean } = {};

        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.key] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animationFrameId: number;

        const gameLoop = () => {
            // 画面をクリア (黒で塗りつぶし→前の描画を消す)
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // キー入力に応じて移動
            if (keys['ArrowLeft']) {
                player.moveLeft();
            } 
            if (keys['ArrowRight']) {
                player.moveRight(canvas.width);
            }

            // プレイヤーを描画
            player.draw(ctx);

            // 次のフレームを要求
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        // クリーンアップ
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef}
            width={800}
            height={600}
            className={styles.canvas}
        />
    );
}