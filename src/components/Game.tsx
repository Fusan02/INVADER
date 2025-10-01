'use client';

import { useEffect, useRef } from 'react';
import styles from './game.css';
import { Player } from '@/game/Player';
import { Enemy } from '@/game/Enemy';
import { GAME_CONFIG } from '@/constants/gameConfig';

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // プレイヤーを作成
        const player = new Player(380, 550);

        // ... 敵の配列を作成 ...
        // Enemy型のからの配列を作成
        const enemies: Enemy[] = [];

        for (let row=0; row<GAME_CONFIG.enemy.rows; row++) {
            for (let col=0; col<GAME_CONFIG.enemy.cols; col++) {
                const x = GAME_CONFIG.enemy.offsetX + col * (GAME_CONFIG.enemy.width + GAME_CONFIG.enemy.spacing);
                const y = GAME_CONFIG.enemy.offsetY + row * (GAME_CONFIG.enemy.height + GAME_CONFIG.enemy.spacing);
                // 位置の決まったEnemy型の要素を配列にpush
                enemies.push(new Enemy(x, y));
            }
        }

        let enemyDirection = 1;         // 敵の移動方向 (1: 右, -1: 左)
        let isMovingDown = false;       // 下移動中フラグ
        let downDistance = 0;           // 下に移動した距離
        const totalDownDistance = GAME_CONFIG.enemy.totalDownDistance;   // 合計で下がる距離

        // ... イベントリスナー ...
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

        // ...gameLoop ...
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
            
            // 下移動中の処理
            if (isMovingDown) {
                const step = GAME_CONFIG.enemy.step;                
                enemies.forEach(enemy => {
                    if (enemy.isAlive) {
                        enemy.position.y += step;
                        enemy.position.x += -enemyDirection * GAME_CONFIG.enemy.speed;
                    }
                });          
                
                downDistance += step;

                // 合計20px下がったら終了
                if (downDistance >= totalDownDistance) {
                    isMovingDown = false;
                    downDistance = 0;
                    enemyDirection *= -1;
                }
            } else {
                // 通常の左右移動 + 画面端のチェック
                let hitEdge = false;
                enemies.forEach(enemy => {
                    if (!enemy.isAlive) return;
                    enemy.position.x += enemyDirection * GAME_CONFIG.enemy.speed;

                    if (enemyDirection > 0 && enemy.position.x + enemy.size.width >= canvas.width) {
                        hitEdge = true;
                    }
                    if (enemyDirection < 0 && enemy.position.x <= 0) {
                        hitEdge = true;
                    }
                });

                if (hitEdge) {
                    isMovingDown = true;
                }
            }

            // 敵を描画
            enemies.forEach(enemy => {
                enemy.draw(ctx);
            });

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