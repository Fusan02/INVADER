'use client';

import { useState } from 'react';
import styles from './startScreen.css';

interface StartScreenProps {
    onStart: (difficulty: number) => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
    const [selectedDifficulty, setSelectedDifficulty] = useState(1); // 0: Easy, 1: Normal, 2: Hard

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>INVADER</h1>

            <div className={styles.instructions}>
                <h2>How to Play</h2>
                <p>← → : 左右に動く</p>
                <p>スペース : 撃つ</p>
                <p>敵を全て倒せ！</p>
            </div>

            <div className={styles.difficultySection}>
                <h2>難易度選択</h2>
                <div className={styles.difficultyButtons}>
                    <button
                        className={selectedDifficulty === 0 ? styles.difficultyButtonActive : styles.difficultyButton}
                        onClick={() => setSelectedDifficulty(0)}
                    >
                        Easy
                    </button>
                    <button
                        className={selectedDifficulty === 1 ? styles.difficultyButtonActive : styles.difficultyButton}
                        onClick={() => setSelectedDifficulty(1)}
                    >
                        Normal
                    </button>
                    <button
                        className={selectedDifficulty === 2 ? styles.difficultyButtonActive : styles.difficultyButton}
                        onClick={() => setSelectedDifficulty(2)}
                    >
                        Hard
                    </button>
                </div>
            </div>

            <button className={styles.startButton} onClick={() => onStart(selectedDifficulty)}>
                START GAME
            </button>

            <div className={styles.footer}>
                <p>START GAMEを押して始める</p>
            </div>
        </div>
    );
}