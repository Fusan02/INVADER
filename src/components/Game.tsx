'use client';

import { useEffect, useRef } from 'react';
import styles from './game.css';

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const gameLoop = () => {
            // 画面をクリア (黒で塗りつぶし)
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 次のフレームを要求
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        gameLoop();

        // クリーンアップ
        return () => {
            cancelAnimationFrame(animationFrameId);
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