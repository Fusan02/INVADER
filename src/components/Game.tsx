'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './game.css';
import { Player } from '@/game/Player';
import { Enemy } from '@/game/Enemy';
import { GAME_CONFIG } from '@/constants/gameConfig';
import { Bullet } from '@/game/Bullet';
import { checkCollision } from '@/game/collision';
import { GameState } from '@/game/types';
import StartScreen from './StartScreen';

export default function Game() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState>(GameState.START);
    const gameStateRef = useRef(gameState);
    const [, setScore] = useState(0);
    const [, setLives] = useState(3);
    const [gameStartKey, setGameStartKey] = useState(0);
    const [difficulty, setDifficulty] = useState(1);  // 難易度を保持

    const handleStart = (selectedDifficulty: number) => {
        setGameState(GameState.PLAYING);
        setScore(0);
        setLives(3);
        setDifficulty(selectedDifficulty);
        setGameStartKey(prev => prev + 1);
    };

    useEffect(() => {
        gameStateRef.current = gameState;
    }, [gameState]);

    useEffect(() => {
        // スタート画面の時はゲームループは開始しない
        if (gameStateRef.current === GameState.START) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // プレイヤーを作成
        const player = new Player(380, 550);

        // ... 弾の配列を作成 ...
        const bullets: Bullet[] = [];
        const enemyBullets: Bullet[] = [];
        // スペース長押しで弾発射できるかできないか。
        const isCheating = false;

        // ... スコア ... 
        let currentScore = 0;
        let currentLives = 3;
        let currentGameState = GameState.PLAYING;

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
        const level = [GAME_CONFIG.enemy.easy, GAME_CONFIG.enemy.normal, GAME_CONFIG.enemy.hard];
        let enemyShootTimer = 0;

        // ... イベントリスナー ...
        // キー入力の状態
        const keys: { [key: string]: boolean } = {};

        const handleKeyDown = (e: KeyboardEvent) => {
            keys[e.key] = true;

            if (!isCheating) {
                // プレイ中のみスペースキーで弾発射
                if (e.key === ' ' && currentGameState === GameState.PLAYING) {
                    bullets.push(player.shoot());
                }

                // リスタート (Rキー)
                if (e.key === 'r' && currentGameState !== GameState.PLAYING) {
                    setGameState(GameState.START);  // スタート画面に戻る
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keys[e.key] = false;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        let animationFrameId: number;
        let lastTime = 0;
        const targetFPS = 60;
        const frameInterval = 1000 / targetFPS;  // 16.666ms

        // ...gameLoop ...
        const gameLoop = (currentTime: number = 0) => {
            // FPS制限
            const deltaTime = currentTime - lastTime;

            if (deltaTime < frameInterval) {
                animationFrameId = requestAnimationFrame(gameLoop);
                return;
            }

            lastTime = currentTime - (deltaTime % frameInterval);

            // ... ループ時のレンダリング ...
            // 画面をクリア (黒で塗りつぶし→前の描画を消す)
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ゲームオーバーまたはクリア時
            if (currentGameState !== GameState.PLAYING) {
                enemies.forEach(enemy => enemy.draw(ctx));
                bullets.forEach(bullet => bullet.draw(ctx));
                enemyBullets.forEach(bullt => bullt.draw(ctx));
                player.draw(ctx);

                // UI表示
                ctx.fillStyle = currentGameState === GameState.GAME_OVER? 'red' : 'yellow';
                ctx.font = '48px Arial';
                const message = currentGameState === GameState.GAME_OVER ? 'GAME OVER' : 'GAME CLEAR!';
                const messageWidth = ctx.measureText(message).width;
                ctx.fillText(message, (canvas.width - messageWidth) / 2, canvas.height / 2);

                ctx.font = '24px Arial';
                const restartText  = 'Press R to Restart';
                const restartWidth = ctx.measureText(restartText).width;
                ctx.fillStyle = 'white';
                ctx.fillText(restartText, (canvas.width - restartWidth) / 2, canvas.height / 2 + 50);

                // スコアと残機表示
                ctx.font = '24px Arial';
                ctx.fillText(`Score: ${currentScore}`, (canvas.width) / 2 - 50, canvas.height / 2 + 100);

                animationFrameId = requestAnimationFrame(gameLoop);
                return;
            }

            // プレイヤーの移動
            if (keys['ArrowLeft']) {
                player.moveLeft();
            } 
            if (keys['ArrowRight']) {
                player.moveRight(canvas.width);
            }

            // ... 弾 ...
            if (isCheating) {
                // プレイ中のみスペースキーで弾発射
                if (keys[' '] && currentGameState === GameState.PLAYING) {
                    bullets.push(player.shoot());
                }

                // リスタート (Rキー)
                if (keys['r'] && currentGameState !== GameState.PLAYING) {
                    setGameState(GameState.START);
                }
            }
            
            // プレイヤーの弾の更新
            bullets.forEach(bullet => {
                if (bullet.isActive) {
                    bullet.update(canvas.height);
                }
            });

            // 敵の弾の更新
            enemyBullets.forEach(bullet => {
                if (bullet.isActive) {
                    bullet.update(canvas.height);
                }
            });

            // プレイヤーの球と敵の衝突判定
            bullets.forEach(bullet => {
                if (!bullet.isActive) return;

                enemies.forEach(enemy => {
                    if (!enemy.isAlive) return;

                    if (checkCollision(bullet.position, bullet.size, enemy.position, enemy.size)) {
                        bullet.isActive = false;
                        enemy.isAlive = false;
                        currentScore += 10;
                        setScore(currentScore);
                    }
                });
            });

            // 敵の弾とプレイヤーの衝突判定
            enemyBullets.forEach(bullet => {
                if (!bullet.isActive) return;

                if (checkCollision(bullet.position, bullet.size, player.position, player.size)) {
                    bullet.isActive = false;
                    currentLives--;
                    setLives(currentLives);

                    if (currentLives <= 0) {
                        currentGameState = GameState.GAME_OVER;
                        setGameState(GameState.GAME_OVER);
                    }
                }
            });

            // ゲームクリア判定　（全ての敵を倒す）
            const aliveEnemies = enemies.filter(e => e.isAlive);
            if (aliveEnemies.length === 0) {
                currentGameState = GameState.GAME_CLEAR;
                setGameState(GameState.GAME_CLEAR);
            }

            // 敵がプレイヤーの位置まで到達したらゲームオーバー
            const enemyReachedBottom = enemies.some(
                enemy => enemy.isAlive && enemy.position.y + enemy.size.height >= player.position.y
            );
            if (enemyReachedBottom) {
                currentGameState = GameState.GAME_OVER;
                setGameState(GameState.GAME_OVER);
            }

            // 敵がランダムに弾を発射
            enemyShootTimer++;
            if (enemyShootTimer > level[difficulty]) { // 難易度に応じて撃つ頻度変更
                enemyShootTimer = 0;

                const aliveEnemies = enemies.filter(e => e.isAlive);
                if (aliveEnemies.length > 0) {
                    const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies. length)];     //ランダムに敵から１匹選ぶ
                    enemyBullets.push(randomEnemy.shoot());     // 敵の弾を発射
                }
            }

            // 無効な弾を削除
            const activeBullets = bullets.filter(b => b.isActive);
            bullets.length = 0;
            bullets.push(...activeBullets);

            const activeEnemyBullets = enemyBullets.filter(b => b.isActive);
            enemyBullets.length = 0;
            enemyBullets.push(...activeEnemyBullets);
            
            
            // 敵の移動
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

            // UI表示
            ctx.fillStyle = 'white';
            ctx.font = '20px Arial';
            ctx.fillText(`Score: ${currentScore}`, 10, 30);
            ctx.fillText(`Lives: ${currentLives}`, 10, 60);

            // 敵を描画
            enemies.forEach(enemy => {
                enemy.draw(ctx);
            });
            // 弾を描画
            bullets.forEach(bullet => {
                bullet.draw(ctx);
            });
            enemyBullets.forEach(bullet => {
                bullet.draw(ctx);
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
    }, [gameStartKey, difficulty]);

    return (
        <div>
            {gameState === GameState.START ? (
                <StartScreen onStart={handleStart} />
            ) : (
                <canvas 
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className={styles.canvas}
                />
            )}
        </div>
    );
}